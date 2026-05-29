FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/web ./apps/web

RUN npm ci
RUN npm run build -w web

FROM nginx:alpine

COPY --from=builder /app/apps/web/dist /usr/share/nginx/html