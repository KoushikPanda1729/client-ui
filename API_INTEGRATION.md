# API Integration Guide

## Backend API Structure

Your backend uses **HTTP-only cookies** for authentication with the following endpoints:

### Auth Endpoints

#### 1. Register

```
POST /auth/register
Payload: {
  "firstName": "Koushik",
  "lastName": "Doe",
  "email": "test@gmail.com",
  "password": "Password@123!"
}
Response: {
  "id": 16
}
```

- Sets `accessToken` and `refreshToken` cookies

#### 2. Login

```
POST /auth/login
Payload: {
  "email": "test@gmail.com",
  "password": "Password@123!"
}
Response: {
  "id": 16
}
```

- Sets `accessToken` and `refreshToken` cookies

#### 3. Get Current User

```
GET /auth/self
Response: {
  "id": 16,
  "firstName": "Koushik",
  "lastName": "Doe",
  "email": "test@gmail.com",
  "role": "customer"
}
```

- Requires authentication cookie

#### 4. Refresh Token

```
POST /auth/refresh
Response: {
  "id": 16
}
```

- Uses `refreshToken` cookie to get new `accessToken`

#### 5. Logout

```
POST /auth/logout
```

- Clears authentication cookies

## Frontend Implementation

### Updated Type Definitions

**User Interface** (`src/types/user.types.ts`):

```typescript
export interface User {
  id: number; // Changed from string
  firstName: string; // Changed from "name"
  lastName: string; // New field
  email: string;
  role: "customer" | "admin" | "manager"; // Updated roles
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Auth Types** (`src/types/auth.types.ts`):

```typescript
export interface RegisterCredentials {
  firstName: string; // Split from "name"
  lastName: string; // New field
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number; // Only returns ID
}

export interface UserProfileResponse extends User {}
```

### Updated API Constants

**Endpoints** (`src/utils/constants.ts`):

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    SELF: "/auth/self", // Changed from "PROFILE"
  },
  USERS: {
    LIST: "/users",
    DETAIL: (id: number) => `/users/${id}`, // number instead of string
    UPDATE: (id: number) => `/users/${id}`,
    DELETE: (id: number) => `/users/${id}`,
  },
};
```

### Updated Auth Service

**Service Methods** (`src/services/auth.service.ts`):

```typescript
class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, credentials);
  }

  async logout(): Promise<void> {
    return apiService.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async refresh(): Promise<AuthResponse> {
    return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH);
  }

  async getSelf(): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.AUTH.SELF);
  }
}
```

### Updated Redux Actions

**Auth Slice** (`src/store/slices/authSlice.ts`):

```typescript
// Login flow: call /auth/login, then fetch /auth/self
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      await authService.login(credentials);
      const user = await authService.getSelf();
      setStoredUser(user);
      return user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

// Register flow: call /auth/register, then fetch /auth/self
export const register = createAsyncThunk(
  "auth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      await authService.register(credentials);
      const user = await authService.getSelf();
      setStoredUser(user);
      return user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);

// Refresh token: call /auth/refresh, then fetch /auth/self
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      await authService.refresh();
      const user = await authService.getSelf();
      setStoredUser(user);
      return user;
    } catch (error) {
      const err = error as RejectedError;
      return rejectWithValue(err.message);
    }
  }
);
```

## HTTP-Only Cookies Setup

### Frontend Configuration

**Axios Instance** (`src/lib/axios.ts`):

```typescript
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // ← IMPORTANT: Automatically sends cookies
});
```

### Backend Requirements

Your backend must:

1. **Set CORS correctly**:

```typescript
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true, // ← Required for cookies
  })
);
```

2. **Set cookies with proper options**:

```typescript
res.cookie("accessToken", token, {
  httpOnly: true, // ← Can't be accessed by JavaScript
  secure: false, // ← Set to true in production (HTTPS)
  sameSite: "lax", // ← CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes
});
```

3. **Clear cookies on logout**:

```typescript
res.clearCookie("accessToken");
res.clearCookie("refreshToken");
```

## Usage Examples

### Register New User

```typescript
import { useAppDispatch } from "@/store/hooks";
import { register } from "@/store/slices/authSlice";

const dispatch = useAppDispatch();

const handleRegister = async () => {
  await dispatch(
    register({
      firstName: "Koushik",
      lastName: "Panda",
      email: "test@gmail.com",
      password: "Password@123!",
    })
  );
};
```

### Login

```typescript
await dispatch(
  login({
    email: "test@gmail.com",
    password: "Password@123!",
  })
);
```

### Get Current User

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, isAuthenticated } = useAuth();

// user = {
//   id: 16,
//   firstName: "Koushik",
//   lastName: "Panda",
//   email: "test@gmail.com",
//   role: "customer"
// }
```

### Refresh Token

```typescript
import { refreshToken } from "@/store/slices/authSlice";

// Call periodically or on 401 error
await dispatch(refreshToken());
```

### Logout

```typescript
import { logout } from "@/store/slices/authSlice";

await dispatch(logout());
```

## Token Flow

```
1. User logs in
   → POST /auth/login
   → Backend sets accessToken + refreshToken cookies
   → Frontend calls GET /auth/self
   → User data stored in Redux + localStorage

2. Subsequent API calls
   → Cookies automatically sent with every request
   → No need to manually add Authorization header

3. Access token expires
   → API returns 401
   → Frontend calls POST /auth/refresh
   → Backend validates refreshToken cookie
   → Backend sets new accessToken cookie
   → Retry original request

4. User logs out
   → POST /auth/logout
   → Backend clears cookies
   → Frontend clears Redux + localStorage
```

## Security Benefits

### HTTP-Only Cookies vs Local Storage

**HTTP-Only Cookies** (Your Implementation):
✅ Not accessible via JavaScript
✅ Protected from XSS attacks
✅ Automatically included in requests
✅ Backend controls expiration

**Local Storage** (Less Secure):
❌ Accessible via JavaScript
❌ Vulnerable to XSS attacks
❌ Manual token management required

## Testing with Your Backend

1. **Start your backend** (port 8000):

```bash
# Your backend should be running on http://localhost:8000
```

2. **Update .env.local**:

```env
PORT=3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

3. **Start frontend**:

```bash
npm run dev
```

4. **Test authentication flow**:
   - Register: http://localhost:3001/register
   - Login: http://localhost:3001/login
   - Check cookies in DevTools → Application → Cookies

## Cookie Verification

After login, you should see in browser DevTools:

```
localhost (http://localhost:3001)
├── accessToken  (HttpOnly, expires in 15 min)
└── refreshToken (HttpOnly, expires in 7 days)
```

---

**Last Updated**: 2026-01-08
