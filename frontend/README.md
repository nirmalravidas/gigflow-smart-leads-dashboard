# GigFlow Frontend (React + Vite)

The frontend for the **GigFlow Smart Leads Dashboard**. It provides a premium, responsive, and highly interactive user interface utilizing modern glassmorphism design principles.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite (Lightning fast HMR & optimized production builds)
- **Styling**: Tailwind CSS v4 (Theme variables & custom animations)
- **State Management**: Zustand (Client state) & TanStack Query v5 (Server state & caching)
- **Forms & Validation**: React Hook Form + Zod
- **Routing**: React Router v7
- **Icons**: Lucide React

---

## Architecture & Feature Folders

The frontend follows a domain-driven structure, grouping components by feature rather than type:

```text
frontend/
├── src/
│   ├── api/            # Axios interceptors & API wrapper functions
│   ├── components/     # UI Elements
│   │   ├── layout/     # Sidebar, AppLayout, ProtectedRoutes
│   │   ├── leads/      # LeadsTable, LeadsFilterBar
│   │   └── ui/         # Reusable primitives (Buttons, Inputs, Spinners)
│   ├── hooks/          # Custom React hooks (e.g., useDebounce)
│   ├── pages/          # Main route components (Auth, Dashboard, Leads)
│   ├── store/          # Zustand slices (authStore, leadsStore)
│   ├── types/          # TypeScript interfaces and enums
│   └── utils/          # Helper functions (getErrorMessage, etc.)
├── index.html
├── vite.config.ts
└── tailwind.config (implied via Tailwind v4 @theme in index.css)
```

---

## Local Development

### 1. Environment Setup
Create a `.env` file in the `frontend` directory based on the `.env.example` (or simply create one):
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Run Development Server
```bash
yarn dev
```
The app will be available at `http://localhost:5173`.

---

## Building & Linting

**Run the TypeScript compiler and Vite build:**
```bash
yarn build
```

**Run ESLint:**
```bash
yarn lint
```

---

## Deployment (Vercel / Netlify)

This project is a Single Page Application (SPA). When deploying to static hosts, you must configure URL rewrites to prevent `404` errors on refresh.

### Vercel (Recommended)
Vercel automatically detects Vite and configures everything for you out of the box. Just set your `VITE_API_URL` environment variable in the Vercel dashboard.

### Netlify
We have provided a `public/_redirects` file which explicitly handles SPA routing:
```text
/* /index.html 200
```
- **Build Command**: `yarn build`
- **Publish Directory**: `dist`
- **Env Variables**: Add `VITE_API_URL=https://your-backend.com/api/v1` to the Netlify UI.
