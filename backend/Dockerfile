# =========================
# Builder stage
# =========================
FROM node:20-slim AS builder
WORKDIR /app

# Install pnpm and NestJS CLI
RUN npm install -g pnpm @nestjs/cli

# Copy package files and install all dependencies (dev + prod)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Copy full project
COPY . .

# Generate Prisma client before building TS code
RUN npx prisma generate --schema=prisma/schema.prisma

# Build the NestJS project
RUN pnpm build

# =========================
# Production stage
# =========================
FROM node:20-slim AS production
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl libssl-dev

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies temporarily (to include Prisma CLI)
RUN pnpm install

# Copy built artifacts and Prisma schema from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Generate Prisma client in production
RUN npx prisma generate --schema=prisma/schema.prisma

# Remove devDependencies to slim down image
RUN pnpm prune --prod

# Set Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Expose application port
EXPOSE 8000

# Run migrations and start the app
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/src/main.js"]