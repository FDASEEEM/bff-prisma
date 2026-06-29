# bff-prisma — NestJS 10 Backend for Frontend  ->  :3006
# Multi-stage: (1) build compila TypeScript, (2) runtime slim.

# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# Stage 2: runtime
FROM node:20-alpine AS runtime

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3006

USER node

EXPOSE 3006

CMD ["node", "dist/main.js"]
