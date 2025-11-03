# Efiche Challenge – Quick Start Guide

NestJS backend + Next.js frontend with PostgreSQL. Run locally or with Docker.

## Prerequisites
- Node.js 18+ & pnpm (`npm i -g pnpm`)
- Docker & Docker Compose (optional, for Postgres)

**Default ports:**
- Backend: http://localhost:8000 (Swagger: /api-docs)
- Frontend: http://localhost:3000
- Postgres: localhost:5433

---

## Quick Start

### 1. Database (Docker)
```bash
cd backend
docker compose up -d postgres
```
**Default:** `postgres` / `****` / `starter_template`

### 2. Backend Setup
```bash
cd backend
pnpm install

# Create .env file
DATABASE_URL="postgresql://postgres:password@localhost:5433/starter_template"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="1d"
PORT=8000
# ... other env vars (MAIL_HOST, MAIL_PORT, etc.)

# Setup database
pnpm prisma generate
pnpm prisma migrate dev

# Seed database (creates admin user + sample programs)
pnpm seed

# Start backend
pnpm dev
```

**Seed creates:**
- Admin user: `admin@example.com` / `admin123` (configurable via `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`)
- 10 sample programs (various statuses: ONGOING, COMPLETED, ARCHIVED)

### 3. Frontend Setup
```bash
cd frontend
pnpm install

# Create .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

# Start frontend
pnpm dev
```

---

## Running Everything
```bash
# Terminal 1: Database
cd backend && docker compose up -d postgres

# Terminal 2: Backend
cd backend && pnpm dev

# Terminal 3: Frontend
cd frontend && pnpm dev
```

Access: Frontend → http://localhost:3000 | API → http://localhost:8000

---

## Troubleshooting
- **Port conflicts:** Change `PORT` in backend `.env` or stop conflicting services
- **Migration errors:** Verify `DATABASE_URL` and run `pnpm prisma generate` first
- **Env not applied:** Restart apps after `.env` changes
- **CORS/Auth issues:** Ensure `NEXT_PUBLIC_API_URL` matches backend URL

---

## Project Structure
- `backend/` – NestJS API, Prisma, Docker config
- `frontend/` – Next.js app

See `backend/README.md` for detailed backend docs.
