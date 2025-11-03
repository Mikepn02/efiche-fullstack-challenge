# Efiche Challenge – Run Guide (Backend + Frontend)

This repository contains a NestJS backend (with Prisma + PostgreSQL) and a Next.js frontend.

Follow this guide to run the application locally for development, with optional Docker instructions for the database (and an alternative API container).

---

## Prerequisites
- Node.js 18+ (20 recommended)
- pnpm (recommended) or npm
  - Install pnpm globally: `npm i -g pnpm`
- Docker & Docker Compose (optional, for running Postgres or the provided API image)

Ports used by default:
- Backend API: http://localhost:8000
- Frontend app: http://localhost:3000
- Postgres (via docker-compose): localhost:5433
- Swagger (API docs): http://localhost:8000/api-docs

---

## 1) Start the Database (recommended via Docker Compose)

The backend includes a docker-compose file you can use to run PostgreSQL locally. From a terminal:

```bash
cd backend
# Start only Postgres in the background
docker compose up -d postgres
```

- Postgres will be available on localhost:5433 (mapped to the container’s 5432).
- Default credentials (as per docker-compose):
  - user: `postgres`
  - password: `nzabera2006`
  - database: `starter_template`

You can stop it with:
```bash
docker compose down
```

Optional: The compose file also defines `pgadmin` for DB inspection on http://localhost:5050 and an `api` service using a published image. For local development of this repo, it’s usually better to run the backend from source (see below) and use only the Postgres container.

---

## 2) Run the Backend (NestJS + Prisma)

1) Install dependencies
```bash
cd backend
pnpm install
```

2) Create a `.env` file in `backend` and set the following variables (example for Dockerized Postgres):
```env
# backend/.env
DATABASE_URL="postgresql://postgres:nzabera2006@localhost:5433/starter_template"
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="1d"
PORT=8000
MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=johndoe@example.com
MAIL_PASS=pass1234
APP_URL=http://localhost:8000
```

3) Generate Prisma client and run migrations
```bash
pnpm prisma generate
pnpm prisma migrate dev
```

4) Start the backend in watch mode
```bash
pnpm dev
```

- The API should be up at http://localhost:8000
- Swagger docs are at http://localhost:8000/api-docs

Notes:
- If you run your own Postgres (not via Docker), set `DATABASE_URL` accordingly (host/port/user/password/dbname).
- For production builds you can use `pnpm build` then `pnpm start:prod`.

---

## 3) Run the Frontend (Next.js)

1) Install dependencies
```bash
cd frontend
pnpm install
```

2) Create a `.env.local` file in `frontend` and set:
```env
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3) Start the development server
```bash
pnpm dev
```

- Open http://localhost:3000 in your browser.

For production:
```bash
pnpm build
pnpm start
```

---

## 4) Running Both Together
- Start Postgres (via Docker):
  - `cd backend && docker compose up -d postgres`
- Start Backend:
  - `cd backend && pnpm dev`
- Start Frontend:
  - `cd frontend && pnpm dev`

You should then have:
- API at http://localhost:8000 (Swagger at /api-docs)
- Frontend at http://localhost:3000 using `NEXT_PUBLIC_API_URL=http://localhost:8000`

---

## Optional: Dockerized API (prebuilt image)
The `backend/docker-compose.yml` also defines an `api` service using the image `mikepn/backend-service:latest` (exposed on port 8000) and wired to the same Postgres container.

If you prefer that route instead of running the backend from source:
```bash
cd backend
# Start Postgres + API image
docker compose up -d postgres api
```

Then point the frontend to `NEXT_PUBLIC_API_URL=http://localhost:8000` and run the frontend as described above. Note: this runs the prebuilt image, not your local source code.

---

## Troubleshooting
- Port already in use:
  - Change `PORT` in backend `.env` or stop the conflicting service.
  - For Postgres, ensure nothing else is using 5433/5432. You can edit the docker-compose port mapping if needed.
- Prisma migration errors:
  - Confirm `DATABASE_URL` is correct and the database is reachable.
  - Try `pnpm prisma generate` before `pnpm prisma migrate dev`.
- Env variables not applied:
  - Ensure `.env` (backend) and `.env.local` (frontend) files are in the correct folders and the apps were restarted after changes.
- CORS/Auth issues from the frontend:
  - Make sure `NEXT_PUBLIC_API_URL` matches the backend URL and that your backend CORS and JWT configs are set as intended.

---

## Project Structure
- `backend/` – NestJS API, Prisma schema, Dockerfile and docker-compose.
- `frontend/` – Next.js app consuming the API.

For additional backend details, see `backend/README.md`.
