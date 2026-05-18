# SmartLeads Backend (Express + TypeScript + MongoDB)

Backend API for the SmartLeads dashboard. Includes authentication (JWT access + refresh), email verification, password reset, leads CRUD, CSV export, role-based access, request validation, and production hardening (health check, error handler, graceful shutdown).

## Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT auth (access + refresh)
- Nodemailer (SMTP)
- `express-validator` (request validation)
- Docker (production image)

## Folder Structure

```
backend/
  src/
    app.ts                 # Express app + routes + middleware
    server.ts              # Server startup + graceful shutdown
    config/                # env config loader/validation
    database/              # MongoDB connection
    middlewares/           # auth, validation, rate limiting, error handlers
    modules/               # feature modules (auth/leads/users)
    utils/                 # helpers (jwt, mail, api responses, errors)
  Dockerfile
  .env.example
```

## Prerequisites

- Node.js 20+ recommended
- Yarn (or npm)
- MongoDB connection string (Atlas or self-hosted)

## Environment Variables

Copy the example file and fill values:

```
cp .env.example .env
```

Required:

- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL` (comma-separated allowed origins)

Recommended:

- `NODE_ENV=development|production`
- `PORT=5000`

Email (required when `NODE_ENV=production`):

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`
- `SMTP_USER`, `SMTP_PASS`
- `EMAIL_FROM_ADDRESS`, `EMAIL_FROM_NAME`

## Install & Run (Local)

From repo root:

```
yarn --cwd backend install
yarn --cwd backend dev
```

Build & lint:

```
yarn --cwd backend build
yarn --cwd backend lint
```

Default base URL:

- `http://localhost:5000/api/v1`

## Health Check

- `GET /api/v1/health`

Expected response:

```json
{ "success": true, "status": "ok" }
```

## API Overview

Base prefix: `/api/v1`

Auth:

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/verify-email`
- `POST /auth/resend-verification`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/refresh-token`
- `POST /auth/signout`
- `GET /auth/me`

Leads (auth required):

- `GET /leads`
- `GET /leads/:id`
- `POST /leads`
- `PUT /leads/:id`
- `DELETE /leads/:id` (admin only)
- `GET /leads/stats`
- `GET /leads/export`

Users (auth required; admin-only actions depend on route rules):

- `GET /users`
- `GET /users/:id`
- `PATCH /users/:id/role`
- `DELETE /users/:id`

## Docker (Run Locally)

Build:

```
docker build -t smartleads-backend ./backend
```

Run:

```
docker run --rm -p 5000:5000 --env-file ./backend/.env smartleads-backend
```

## Deploy (DigitalOcean App Platform)

Use the repo folder `backend/` as the service root and deploy via `backend/Dockerfile`.

Set environment variables in App Platform:

- `NODE_ENV=production`
- `PORT=5000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `CLIENT_URL=https://<your-netlify-site>.netlify.app`
- SMTP vars (see above)

Health check path:

- `/api/v1/health`
