# GigFlow – Setup & Installation Guide

Welcome to the GigFlow Smart Leads Dashboard! This guide will walk you through setting up the project locally for development, as well as running it via Docker.

GigFlow consists of two independent services:
1. **Backend**: Express + TypeScript + MongoDB
2. **Frontend**: React + Vite + Tailwind CSS v4

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **Yarn** (Install via `npm install -g yarn`)
- **MongoDB** (You can use a local instance or a free cloud cluster from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- **Docker & Docker Compose** (Optional, only if you want to run the containerized version)

---

## Option 1: Local Development Setup (Recommended for Coding)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd gigflow-smart-leads-dashboard
```

### Step 2: Set up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
3. Open the `.env` file in your code editor and fill in the required values. **Important fields to update:**
   - `MONGODB_URI`: Your MongoDB connection string (e.g., `mongodb://localhost:27017/gigflow` or an Atlas URI).
   - `JWT_SECRET` & `JWT_REFRESH_SECRET`: Random secure strings used for token generation.
   - `CLIENT_URL`: Set this to `http://localhost:5173` to allow CORS requests from your local frontend.
   - `SMTP_*`: Your email provider credentials (required for the email verification flow). You can use a free testing service like [Mailtrap](https://mailtrap.io/) for development.

4. Install dependencies:
   ```bash
   yarn install
   ```
5. Start the backend development server:
   ```bash
   yarn dev
   ```
   *The backend will now be running at `http://localhost:5000`.*

### Step 3: Set up the Frontend
1. Open a **new terminal window** and navigate to the frontend directory from the project root:
   ```bash
   cd frontend
   ```
2. Copy the environment file (if applicable, or create one):
   ```bash
   cp .env.example .env 
   # Or manually create .env and add: VITE_API_URL=http://localhost:5000/api/v1
   ```
3. Install frontend dependencies:
   ```bash
   yarn install
   ```
4. Start the frontend development server:
   ```bash
   yarn dev
   ```
   *The frontend will now be running at `http://localhost:5173`.*

You can now open `http://localhost:5173` in your browser. The frontend will automatically communicate with the backend API!

---

## Option 2: Docker Setup (Quickest Run)

If you just want to run the application to test it without installing Node.js or MongoDB locally, you can use Docker Compose.

*Note: The `docker-compose.yml` file expects a backend `.env` file to exist.*

### Step 1: Configure Backend Environment Variables
```bash
cd backend
cp .env.example .env
```
Ensure your `.env` has the correct `MONGODB_URI`. If you want to use a cloud database, put the Atlas URI here. If you want to run MongoDB in Docker, you would need to add a `mongo` service to the `docker-compose.yml` file.

Make sure `CLIENT_URL` allows the Docker port (e.g., `CLIENT_URL=http://localhost:8080`).

### Step 2: Run Docker Compose
From the root of the project:
```bash
docker-compose up --build
```

### Step 3: Access the App
- **Frontend**: Available at `http://localhost:8080`
- **Backend API**: Available at `http://localhost:5000/api/v1`

To stop the containers, press `Ctrl+C` in the terminal, or run:
```bash
docker-compose down
```

---

## Testing the Authentication Flow
1. Once the app is running, navigate to the **Sign Up** page.
2. Enter your details to create an account.
3. Check your configured SMTP email inbox (or Mailtrap) for the verification link.
4. Click the link to verify your email.
5. Log in with your new credentials!

## Troubleshooting
- **CORS Errors**: Ensure your backend `.env` file has the `CLIENT_URL` exactly matching your frontend URL (e.g., `http://localhost:5173`). Do not include a trailing slash.
- **Vite/Tailwind CSS not updating**: If the UI looks broken, Vite's cache might be stuck. Stop the frontend server, run `rm -rf node_modules/.vite`, and run `yarn dev` again.
- **Database Connection Failure**: Ensure your MongoDB instance is actively running and your IP is whitelisted (if using Atlas).
