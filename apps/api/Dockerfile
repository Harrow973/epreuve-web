FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY apps/api ./apps/api

RUN npm ci
RUN npm run build -w api

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
COPY packages ./packages
COPY --from=builder /app/apps/api/dist ./apps/api/dist

RUN npm ci --omit=dev

CMD ["node", "apps/api/dist/main.js"]