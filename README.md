# Epreuve Web

Monorepo Turbo pour une app Next.js avec Prisma ORM, PostgreSQL, BetterAuth et Tailwind CSS.

## Prerequis

- Node.js 20+
- npm 10+
- PostgreSQL

## Installation

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run dev
```

Le dossier `apps/web` est reserve au projet Next.js que le frontend initialisera.
Le dossier `apps/api` est reserve a l'API NestJS.
Le package `packages/database` contient le setup Prisma/PostgreSQL partage.

## Scripts

- `npm run dev`: lance les apps en mode developpement
- `npm run build`: build tous les packages
- `npm run lint`: lint tous les packages
- `npm run typecheck`: verifie TypeScript
- `npm run db:generate`: genere le client Prisma
- `npm run db:migrate`: applique une migration Prisma locale
- `npm run db:studio`: ouvre Prisma Studio
