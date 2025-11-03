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

# Install **only production dependencies + Prisma CLI**
RUN pnpm install --prod && pnpm add prisma --global

# Copy built artifacts and Prisma schema from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Generate Prisma client in production (global prisma available)
RUN npx prisma generate --schema=prisma/schema.prisma

# Set Node.js memory limit
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Expose application port
EXPOSE 8000

# Run migrations and start the app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
