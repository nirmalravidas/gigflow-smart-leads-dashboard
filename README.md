# GigFlow – Smart Leads Dashboard

GigFlow is a full-stack, feature-rich web application built to streamline lead management for modern sales teams. It features a scalable Express + TypeScript backend, a responsive and visually stunning React (Vite) frontend, robust JWT-based authentication, role-based access control (RBAC), and high-performance server-side pagination and filtering.

---

## Feature-Based Architecture

GigFlow strictly follows a **Feature-Based Architecture** (also known as Domain-Driven Design or Modular Architecture) in both the Frontend and Backend. This means that instead of grouping files by technical role (e.g., all controllers in one folder, all routes in another), the codebase is organized around **features** (e.g., Auth, Leads, Users).

### Why Feature-Based?
- **Scalability**: As the app grows, you don't end up with massive folders of 50 controllers. Each feature is self-contained.
- **Maintainability**: When working on "Leads", all relevant models, controllers, services, routes, and validators are located in `src/modules/leads`.
- **Encapsulation**: Features expose only what is necessary, reducing tight coupling.

#### Backend Structure Example:
```text
backend/src/modules/leads/
├── controller/         # Handles HTTP requests/responses for Leads
├── service/            # Core business logic and permission checks
├── repository/         # Database query builders for Leads
├── dao/                # Data Access Objects (direct Mongoose model interaction)
├── routes/             # Express routes for the Leads feature
└── validators/         # Zod schemas for validating Leads payloads
```

#### Frontend Structure Example:
```text
frontend/src/
├── components/leads/   # UI components specifically for Leads (Table, Filters, Forms)
├── pages/auth/         # Pages related to Authentication (Login, Signup)
├── store/              # Zustand state slices (e.g., auth.store.ts, leads.store.ts)
└── api/                # Axios API wrappers separated by domain
```

---

## Authentication & JWT Workflow

The authentication system is built for security and seamless user experience, utilizing a **short-lived Access Token** and a **long-lived Refresh Token**.

### How Authentication Works:
1. **Signup**: A user submits their details. The backend hashes the password (using bcrypt), creates an inactive user account, and generates a secure email verification token.
2. **Email Verification**: An email is sent to the user containing a link. Clicking this link hits the `/verify-email` endpoint, activating the account.
3. **Signin**: The user logs in with their credentials. Upon success, the backend generates an `accessToken` (e.g., valid for 15 mins) and a `refreshToken` (e.g., valid for 7 days). 
4. **Token Storage**: The backend stores a hashed version of the refresh token in the database (allowing manual invalidation/logout), and sends the raw tokens to the frontend. The frontend securely stores these in memory or local storage.

### The Refresh Token Auto-Rotation Logic
When the frontend makes a request and the `accessToken` expires, the backend responds with a `401 Unauthorized`. 

**The Workflow:**
1. The frontend uses an Axios interceptor to catch the `401` response.
2. The interceptor pauses the original request and calls `POST /api/v1/auth/refresh-token` with the stored `refreshToken`.
3. The backend validates the `refreshToken`, checks it against the database, and if valid, issues a *brand new* pair of tokens.
4. The frontend saves the new tokens, updates the request headers, and automatically retries the original request. The user experiences zero interruption.

#### Axios Interceptor Code Snippet (Frontend):
```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = useAuthStore.getState();
        // Call refresh endpoint
        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        useAuthStore.getState().setTokens(data.data.accessToken, data.data.refreshToken);
        
        // Update header and retry original request
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Filtration & Pagination Logic

GigFlow handles thousands of leads efficiently by utilizing **Server-Side Pagination and Filtering**.

### The Flow:
1. **Frontend Draft State**: The frontend utilizes Zustand to hold a "draft" state of the filters (Status, Source, Search Query). As the user types or selects dropdowns, the UI updates but no API call is made.
2. **Applying Filters**: When the user clicks "Apply", the draft state is committed to the active filter state, and the page is reset to `1`.
3. **API Request**: React Query triggers an API call with the filters as query parameters (e.g., `/api/v1/leads?status=NEW&search=john&page=1&limit=10`).
4. **Backend Query Builder**: The backend receives the query parameters.
   - Exact matches are used for `status` and `source`.
   - The `search` parameter is escaped to prevent ReDoS (Regular Expression Denial of Service) and transformed into a MongoDB `$regex` query searching across `name` and `email` with `$or`.
5. **Database Execution**: The query uses `skip` and `limit` to retrieve only the required page. It also returns total counts for pagination metadata.

#### Backend Filtering Logic Snippet:
```typescript
// backend/src/modules/leads/repository/lead.repository.ts
export const buildLeadQuery = (filters: LeadFilters, userId: string, role: string) => {
  const query: any = {};
  
  // RBAC: Sales users only see their own leads. Admins see all.
  if (role !== UserRole.ADMIN) {
    query.assignedTo = userId;
  }

  if (filters.status) query.status = filters.status;
  if (filters.source) query.source = filters.source;
  
  if (filters.search) {
    const safeRegex = new RegExp(escapeRegex(filters.search), 'i');
    query.$or = [
      { name: { $regex: safeRegex } },
      { email: { $regex: safeRegex } },
    ];
  }
  return query;
};
```

---

## API Endpoints

### Auth `(/api/v1/auth)`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/signup` | Create a new user account | No |
| `POST` | `/verify-email` | Verify email via token | No |
| `POST` | `/signin` | Login and receive JWT tokens | No |
| `POST` | `/refresh-token` | Issue new JWT pair | No |
| `POST` | `/forgot-password` | Send password reset link | No |
| `POST` | `/reset-password` | Reset password using token | No |
| `POST` | `/signout` | Invalidate refresh token | Yes |
| `GET`  | `/me` | Get current user profile | Yes |

### Leads `(/api/v1/leads)`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | Get paginated & filtered leads | Yes |
| `POST` | `/` | Create a new lead | Yes |
| `GET`  | `/stats` | Get pipeline metrics (Admin only) | Yes (Admin) |
| `GET`  | `/export` | Export filtered leads to CSV | Yes |
| `GET`  | `/:id` | Get single lead details | Yes |
| `PUT`  | `/:id` | Update lead status/details | Yes |
| `DELETE`| `/:id` | Delete a lead | Yes |

### Users `(/api/v1/users)`
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET`  | `/` | Get paginated user list | Yes (Admin) |
| `PUT`  | `/:id/role` | Change a user's role | Yes (Admin) |
| `DELETE`| `/:id` | Delete a user account | Yes (Admin) |

---

## How to Setup and Run the Project

### Prerequisites
- Node.js (v18 or higher)
- Yarn (`npm install -g yarn`)
- MongoDB (Local instance or MongoDB Atlas)
- Docker (Optional)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd gigflow-smart-leads-dashboard
```

### 2. Backend Setup
```bash
cd backend

# Copy environment variables
cp .env.example .env

# Open .env and configure your variables:
# MONGODB_URI=mongodb://localhost:27017/gigflow
# JWT_SECRET=your_super_secret_key
# JWT_REFRESH_SECRET=your_super_refresh_secret
# CLIENT_URL=http://localhost:5173

# Install dependencies
yarn install

# Run the development server
yarn dev
```
*The backend runs at: `http://localhost:5000/api/v1`*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend

# Install dependencies
yarn install

# Run the development server
yarn dev
```
*The frontend runs at: `http://localhost:5173`*

### 4. Running with Docker Compose (Optional)
If you prefer running everything in containers without installing Node locally:
```bash
# In the root directory
docker-compose up --build
```
This will spin up both the Frontend and Backend services, bridging them together automatically.

---

## UI/UX Design (Frontend)

The Frontend is built entirely around a **premium, dark-mode glassmorphism** aesthetic using **Tailwind CSS v4**. 
- **Centralized Theming**: Color palettes, gradients, and semantic variables (e.g., `--color-primary`, `--color-background`) are strictly maintained in `index.css` leveraging Tailwind's new `@theme` API.
- **Glassmorphism**: Heavy use of `backdrop-blur`, semi-transparent backgrounds, and glowing drop shadows ensures a modern depth-of-field experience.
- **Micro-animations**: Seamless transitions, hover-states, and custom CSS keyframes provide a dynamic, highly responsive interface.
