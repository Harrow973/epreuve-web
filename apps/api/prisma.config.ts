import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "prisma/config";

const configDir = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(configDir, "../../.env") });

function resolvePrismaDatabaseUrl(): string {
  const migrationDatabaseUrl = process.env.PRISMA_MIGRATE_DATABASE_URL?.trim();
  const runtimeDatabaseUrl = process.env.DATABASE_URL?.trim();
  const databaseUrl = migrationDatabaseUrl || runtimeDatabaseUrl;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL est requis pour Prisma. PRISMA_MIGRATE_DATABASE_URL peut remplacer cette URL pour les migrations.",
    );
  }

  return databaseUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: resolvePrismaDatabaseUrl(),
  },
});
