import { Injectable } from "@nestjs/common";
import { prisma } from "@epreuve/database";

@Injectable()
export class DatabaseService {
  readonly prisma = prisma;
}
