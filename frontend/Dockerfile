FROM node:20-alpine AS deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.12.2 --activate


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile


FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.12.2 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env .env 

RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production


RUN addgroup -S appgroup && adduser -S appuser -G appgroup


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules


EXPOSE 3000

USER appuser
CMD ["node", "./node_modules/next/dist/bin/next", "start", "-p", "3000"]


