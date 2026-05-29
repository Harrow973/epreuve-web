import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";
import { DatabaseService } from "../database/database.service";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "troov_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

type RegisterInput = {
  email?: unknown;
  password?: unknown;
  name?: unknown;
};

type LoginInput = {
  email?: unknown;
  password?: unknown;
};

type CookieOptions = {
  httpOnly: boolean;
  sameSite: "lax";
  secure: boolean;
  maxAge: number;
  path: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  // Registration uses Better Auth's native `user` and `account` table shape.
  async register(input: RegisterInput) {
    const email = this.normalizeEmail(input.email);
    const password = this.requirePassword(input.password);
    const name = this.normalizeName(input.name, email);

    const passwordHash = await this.hashPassword(password);

    try {
      const user = await this.database.prisma.user.create({
        data: {
          email,
          name,
          profile: {
            create: {
              displayName: name,
            },
          },
          accounts: {
            create: {
              accountId: email,
              providerId: "credential",
              password: passwordHash,
            },
          },
        },
        select: this.userSelect(),
      });

      return { user };
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException("Email already registered");
      }

      throw error;
    }
  }

  // Login verifies the credential account, then stores only a hash of the browser token.
  async login(input: LoginInput, metadata: { ipAddress?: string; userAgent?: string }) {
    const email = this.normalizeEmail(input.email);
    const password = this.requirePassword(input.password);

    const user = await this.database.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: {
          where: {
            accountId: email,
            providerId: "credential",
          },
          take: 1,
        },
        profile: true,
      },
    });

    const passwordHash = user?.accounts[0]?.password;

    if (!user || !passwordHash || !(await this.verifyPassword(password, passwordHash))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    if (user.profile?.status !== "ACTIVE" || user.profile?.deletedAt) {
      throw new UnauthorizedException("User account is not active");
    }

    const sessionToken = this.createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

    await this.database.prisma.$transaction([
      this.database.prisma.session.create({
        data: {
          token: this.hashSessionToken(sessionToken),
          userId: user.id,
          expiresAt,
          ipAddress: metadata.ipAddress,
          userAgent: metadata.userAgent,
        },
      }),
      this.database.prisma.userProfile.update({
        where: { userId: user.id },
        data: { lastLoginAt: new Date() },
      }),
    ]);

    return {
      sessionToken,
      cookieName: SESSION_COOKIE,
      cookieOptions: this.sessionCookieOptions(),
      user: this.serializeUser(user),
    };
  }

  // The `/me` endpoint trusts only a live session row, not user-provided ids.
  async me(sessionToken?: string) {
    if (!sessionToken) {
      throw new UnauthorizedException("Not authenticated");
    }

    const session = await this.database.prisma.session.findUnique({
      where: { token: this.hashSessionToken(sessionToken) },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!session || session.expiresAt <= new Date()) {
      throw new UnauthorizedException("Session expired");
    }

    if (session.user.profile?.status !== "ACTIVE" || session.user.profile?.deletedAt) {
      throw new UnauthorizedException("User account is not active");
    }

    return {
      user: this.serializeUser(session.user),
    };
  }

  getSessionCookieName() {
    return SESSION_COOKIE;
  }

  private normalizeEmail(value: unknown) {
    if (typeof value !== "string") {
      throw new BadRequestException("Email is required");
    }

    const email = value.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new BadRequestException("Email is invalid");
    }

    return email;
  }

  private requirePassword(value: unknown) {
    if (typeof value !== "string") {
      throw new BadRequestException("Password is required");
    }

    if (value.length < 8 || value.length > 128) {
      throw new BadRequestException("Password must be between 8 and 128 characters");
    }

    return value;
  }

  private normalizeName(value: unknown, email: string) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim().slice(0, 150);
    }

    return email.split("@")[0];
  }

  // Scrypt is available in Node core, so the API does not need a bcrypt dependency.
  private async hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const hash = (await scrypt(password, salt, 64)) as Buffer;

    return `scrypt:${salt}:${hash.toString("hex")}`;
  }

  private async verifyPassword(password: string, storedHash: string) {
    const [scheme, salt, hash] = storedHash.split(":");

    if (scheme !== "scrypt" || !salt || !hash) {
      return false;
    }

    const expected = Buffer.from(hash, "hex");
    const actual = (await scrypt(password, salt, expected.length)) as Buffer;

    return expected.length === actual.length && timingSafeEqual(expected, actual);
  }

  private createSessionToken() {
    return randomBytes(32).toString("base64url");
  }

  // Session tokens are random; the database stores a SHA-256 digest in `session.token`.
  private hashSessionToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  }

  private sessionCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_MAX_AGE_SECONDS * 1000,
      path: "/",
    };
  }

  private userSelect() {
    return {
      id: true,
      email: true,
      emailVerified: true,
      name: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    } as const;
  }

  private serializeUser(user: {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
    profile?: {
      role?: string;
      status?: string;
    } | null;
  }) {
    return {
      id: user.id,
      email: user.email,
      emailVerified: user.emailVerified,
      name: user.name,
      image: user.image,
      role: user.profile?.role ?? "USER",
      status: user.profile?.status ?? "ACTIVE",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      profile: user.profile ?? null,
    };
  }

  private isUniqueConstraintError(error: unknown) {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    );
  }
}
