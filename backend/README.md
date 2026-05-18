# GigFlow Backend (Express + TypeScript)

The scalable and secure backend API for the **GigFlow Smart Leads Dashboard**. It provides robust JWT authentication, strict role-based access control (RBAC), and high-performance lead aggregation via MongoDB.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (Access + Auto-Rotating Refresh Tokens)
- **Security**: Helmet, CORS, Express-Rate-Limit, Bcrypt
- **Validation**: Express-Validator & Zod (via shared types)
- **Email Service**: Nodemailer (SMTP)

---

## Feature-Based Structure

The backend organizes logic by domains rather than technical boundaries:

```text
backend/
├── src/
│   ├── config/                # Environment validation & loading
│   ├── database/              # MongoDB connection handling
│   ├── middlewares/           # Global logic (Auth, Rate Limiter, Error Handler)
│   ├── modules/               # The Core Features
│   │   ├── auth/              # Signup, Signin, Tokens, Password Reset
│   │   ├── leads/             # Lead CRUD, Stats, CSV Export, Filtering
│   │   └── users/             # User Management (Admin only)
│   ├── types/                 # Shared TypeScript interfaces & enums
│   └── utils/                 # Helpers (JWT generation, Mailer)
├── app.ts                     # Express app initialization
├── server.ts                  # Server startup & Graceful Shutdown logic
└── Dockerfile                 # Production-ready Docker configuration
```

---

## Local Development

### 1. Environment Setup
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in the required variables:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET` & `JWT_REFRESH_SECRET`: Secure random strings.
- `CLIENT_URL`: Important for CORS! Set to `http://localhost:5173`.
- `SMTP_*`: Your SMTP server credentials (e.g., Mailtrap, SendGrid).

### 2. Install Dependencies
```bash
yarn install
```

### 3. Run Development Server
```bash
yarn dev
```
The server will start on `http://localhost:5000` using `ts-node-dev` for hot-reloading.

---

## Building & Production

To compile the TypeScript code down to production-ready JavaScript:
```bash
yarn build
```
This generates a `/dist` folder.

To start the production server:
```bash
yarn start
```

---

## Deployment (DigitalOcean App Platform)

This backend is perfectly structured to deploy on platforms like DigitalOcean, Render, or Railway.

**DigitalOcean App Platform Guide**:
1. Connect your GitHub repository.
2. Select the `backend/` directory as the source.
3. DigitalOcean will automatically detect the `package.json` `start` script.
4. Input all of your `.env` variables into the App Platform dashboard.
5. **Health Check**: Set the health check path to `/api/v1/health`.

### Docker
Alternatively, you can build and run the provided `Dockerfile` anywhere:
```bash
docker build -t gigflow-backend ./backend
docker run -p 5000:5000 --env-file ./backend/.env gigflow-backend
```
