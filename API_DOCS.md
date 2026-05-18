# GigFlow Comprehensive API Documentation

Base URL: `http://localhost:5000/api/v1`
Content-Type: `application/json`

---

## Standard Responses

**Success Response (200 OK / 201 Created)**
```json
{
  "success": true,
  "data": { ... } // Varies per endpoint
}
```

**Error Response (4xx / 5xx)**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ] // Optional array of validation errors
}
```

### Common HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created.
- `400 Bad Request`: Validation failed (check the `errors` array).
- `401 Unauthorized`: Missing, expired, or invalid JWT token.
- `403 Forbidden`: Insufficient permissions (e.g., Sales user accessing Admin routes).
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.

---

## Auth Endpoints (`/api/v1/auth`)

### 1. Sign Up
Creates a new inactive user account and sends a verification email.

- **URL:** `/auth/signup`
- **Method:** `POST`
- **Auth Required:** No
- **Rate Limit:** High restriction to prevent spam.
- **Request Body Payload:**
  ```json
  {
    "name": "John Doe",       // Required. String (2-100 chars).
    "email": "user@test.com", // Required. Valid email format.
    "password": "Password1!", // Required. Min 8 chars. Must contain 1 uppercase, 1 lowercase, 1 number.
    "role": "sales"           // Optional. 'sales' or 'admin'. Default: 'sales'.
  }
  ```
- **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Signup successful! Please check your email to verify your account."
  }
  ```

### 2. Verify Email
Verifies a user's email address using the token sent to their inbox.

- **URL:** `/auth/verify-email`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body Payload:**
  ```json
  {
    "token": "a1b2c3d4..."    // Required. The token from the URL link.
  }
  ```

### 3. Sign In
Authenticates a user and returns short-lived access and long-lived refresh tokens.

- **URL:** `/auth/signin`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body Payload:**
  ```json
  {
    "email": "user@test.com", // Required.
    "password": "Password1!"  // Required.
  }
  ```
- **Success Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "64abcdef...",
        "name": "John Doe",
        "email": "user@test.com",
        "role": "sales",
        "isEmailVerified": true
      },
      "tokens": {
        "accessToken": "ey...",
        "refreshToken": "ey..."
      }
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized`: "Invalid credentials"
  - `403 Forbidden`: "Please verify your email first"

### 4. Refresh Token
Exchanges a valid refresh token for a new set of tokens.

- **URL:** `/auth/refresh-token`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body Payload:**
  ```json
  {
    "refreshToken": "ey..." // Required.
  }
  ```

### 5. Sign Out
Invalidates the current user's refresh token on the server.

- **URL:** `/auth/signout`
- **Method:** `POST`
- **Auth Required:** Yes (Bearer Token)
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Signed out successfully"
  }
  ```

### 6. Get Current User Profile
Retrieves the profile of the currently authenticated user.

- **URL:** `/auth/me`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)

---

## Leads Endpoints (`/api/v1/leads`)

### 1. Get Leads (with Pagination & Filtering)
Retrieves a paginated list of leads. Sales users only see their own assigned leads; Admins see all leads across the system.

- **URL:** `/leads`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)
- **Query Parameters:**
  - `page` (number, default: 1): Must be a positive integer.
  - `limit` (number, default: 10): Max 100.
  - `status` (string, optional): `'New'`, `'Contacted'`, `'Qualified'`, `'Lost'`
  - `source` (string, optional): `'Website'`, `'Instagram'`, `'Referral'`
  - `search` (string, optional): Searches `name` and `email` using MongoDB `$regex`. Max 100 chars.
  - `sort` (string, optional): `'latest'`, `'oldest'`
- **Success Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "leads": [
        {
          "_id": "64...xyz",
          "name": "Jane Smith",
          "email": "jane@company.com",
          "phone": "+1234567890",
          "status": "New",
          "source": "Website",
          "notes": "Interested in premium plan.",
          "assignedTo": { "_id": "...", "name": "Sales Rep" },
          "createdAt": "2024-01-01T12:00:00.000Z",
          "updatedAt": "2024-01-01T12:00:00.000Z"
        }
      ],
      "meta": {
        "page": 1,
        "limit": 10,
        "total": 45,
        "totalPages": 5,
        "hasNextPage": true,
        "hasPrevPage": false
      }
    }
  }
  ```

### 2. Create Lead
Creates a new lead.

- **URL:** `/leads`
- **Method:** `POST`
- **Auth Required:** Yes (Bearer Token)
- **Request Body Payload:**
  ```json
  {
    "name": "Jane Smith",         // Required. String (2-100 chars)
    "email": "jane@company.com",  // Required. Valid email.
    "status": "New",              // Optional. Default: 'New'. ('New', 'Contacted', 'Qualified', 'Lost')
    "source": "Website",          // Required. ('Website', 'Instagram', 'Referral')
    "notes": "Met at conference", // Optional. Max 1000 characters.
    "assignedTo": "64...abc"      // Optional. Valid MongoID. (Admins only. Auto-assigned to self if Sales).
  }
  ```

### 3. Get Lead by ID
Retrieves details of a specific lead.

- **URL:** `/leads/:id`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)
- **URL Parameters:**
  - `id`: Valid MongoDB ObjectId.

### 4. Update Lead
Updates specific fields of an existing lead.

- **URL:** `/leads/:id`
- **Method:** `PUT`
- **Auth Required:** Yes (Bearer Token)
- **URL Parameters:**
  - `id`: Valid MongoDB ObjectId.
- **Request Body Payload:** (All fields optional. Same constraints as Create Lead)
  ```json
  {
    "status": "Qualified",
    "notes": "Updated notes."
  }
  ```

### 5. Delete Lead
Permanently removes a lead.

- **URL:** `/leads/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (ADMIN ONLY)

### 6. Get Pipeline Stats
Retrieves aggregate statistics for the dashboard.

- **URL:** `/leads/stats`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)
- **Success Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "total": 150,
      "byStatus": {
        "New": 50,
        "Contacted": 40,
        "Qualified": 40,
        "Lost": 20
      },
      "bySource": {
        "Website": 100,
        "Referral": 50
      }
    }
  }
  ```

### 7. Export Leads to CSV
Generates a CSV file of leads matching the current filter criteria.

- **URL:** `/leads/export`
- **Method:** `GET`
- **Auth Required:** Yes (Bearer Token)
- **Query Parameters:** Same as `Get Leads` (e.g., `?status=Qualified`)
- **Success Response (200):**
  - **Headers:** `Content-Type: text/csv`, `Content-Disposition: attachment; filename=leads_export.csv`
  - **Body:** Raw CSV string.

---

## Users Endpoints (`/api/v1/users`)
*Note: ALL endpoints in this module require an **ADMIN** role. Sales users will receive a `403 Forbidden` error.*

### 1. List Users
Retrieves a list of all registered users in the system.

- **URL:** `/users`
- **Method:** `GET`
- **Auth Required:** Yes (Admin Only)
- **Success Response (200):**
  ```json
  {
    "success": true,
    "data": [
      {
        "_id": "64...xyz",
        "name": "Jane Admin",
        "email": "jane@test.com",
        "role": "admin",
        "isEmailVerified": true,
        "createdAt": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
  ```

### 2. Get User by ID
Retrieves details of a specific user account.

- **URL:** `/users/:id`
- **Method:** `GET`
- **Auth Required:** Yes (Admin Only)
- **URL Parameters:**
  - `id`: Valid MongoDB ObjectId.

### 3. Update User Role
Changes the permission level of a user.

- **URL:** `/users/:id/role`
- **Method:** `PATCH`
- **Auth Required:** Yes (Admin Only)
- **URL Parameters:**
  - `id`: Valid MongoDB ObjectId.
- **Request Body Payload:**
  ```json
  {
    "role": "admin" // Required. 'admin' or 'sales'.
  }
  ```

### 4. Delete User
Permanently deletes a user account from the system.

- **URL:** `/users/:id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Admin Only)
- **URL Parameters:**
  - `id`: Valid MongoDB ObjectId.
- **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```
