# =========================
# Builder stage
# =========================
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm & Nest CLI
RUN npm install -g pnpm @nestjs/cli

# Copy package files and install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy all source files and build
COPY . .
RUN pnpm build

# =========================
# Production stage
# =========================
FROM node:20-alpine AS production
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy only prod deps (optional: install @prisma/client)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

# Copy build output and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

EXPOSE 8000

# Run migrations and start app
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/main.js"]
