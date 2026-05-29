import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { notImplemented } from "../../common/not-implemented";
import { AuthService } from "./auth.service";

type HttpRequest = {
  ip?: string;
  headers: {
    cookie?: string;
    "user-agent"?: string | string[];
  };
};

type HttpResponse = {
  cookie: (
    name: string,
    value: string,
    options: {
      httpOnly: boolean;
      sameSite: "lax";
      secure: boolean;
      maxAge: number;
      path: string;
    },
  ) => void;
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Public endpoint used by the future registration screen.
  @Post("register")
  register(@Body() body: unknown) {
    return this.authService.register(body ?? {});
  }

  // Login sets an HTTP-only cookie so the frontend never stores the session token manually.
  @Post("login")
  async login(
    @Body() body: unknown,
    @Req() request: HttpRequest,
    @Res({ passthrough: true }) response: HttpResponse,
  ) {
    const result = await this.authService.login(body ?? {}, {
      ipAddress: request.ip,
      userAgent: this.getUserAgent(request),
    });

    response.cookie(result.cookieName, result.sessionToken, result.cookieOptions);

    return {
      user: result.user,
    };
  }

  @Post("logout")
  logout() {
    return notImplemented("auth.logout");
  }

  @Post("refresh")
  refresh() {
    return notImplemented("auth.refresh");
  }

  @Post("verify-email")
  verifyEmail(@Body() body: unknown) {
    return { ...notImplemented("auth.verifyEmail"), body };
  }

  @Post("resend-verification")
  resendVerification(@Body() body: unknown) {
    return { ...notImplemented("auth.resendVerification"), body };
  }

  @Post("forgot-password")
  forgotPassword(@Body() body: unknown) {
    return { ...notImplemented("auth.forgotPassword"), body };
  }

  @Post("reset-password")
  resetPassword(@Body() body: unknown) {
    return { ...notImplemented("auth.resetPassword"), body };
  }

  // `/auth/me` reads the same cookie that `login` writes and returns the current profile.
  @Get("me")
  me(@Req() request: HttpRequest) {
    return this.authService.me(this.getCookie(request, this.authService.getSessionCookieName()));
  }

  private getCookie(request: HttpRequest, name: string) {
    const cookieHeader = request.headers.cookie;

    if (!cookieHeader) {
      return undefined;
    }

    const cookies = cookieHeader.split(";").map((cookie: string) => cookie.trim());
    const cookie = cookies.find((value: string) => value.startsWith(`${name}=`));

    if (!cookie) {
      return undefined;
    }

    return decodeURIComponent(cookie.slice(name.length + 1));
  }

  private getUserAgent(request: HttpRequest) {
    const userAgent = request.headers["user-agent"];

    return Array.isArray(userAgent) ? userAgent.join(" ") : userAgent;
  }
}
