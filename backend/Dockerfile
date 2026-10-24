# ─── Stage 1: deps ───────────────────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* ./
COPY prisma ./prisma/

RUN pnpm install --frozen-lockfile --prod

# ─── Stage 2: builder ────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm@9

COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY src ./src/

RUN pnpm install --frozen-lockfile
RUN pnpm run db:generate
RUN pnpm run build

# ─── Stage 3: runner ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -S msingi && adduser -S msingi -G msingi

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

RUN chown -R msingi:msingi /app
USER msingi

EXPOSE 4000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
