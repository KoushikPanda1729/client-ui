# Client UI - Project Architecture

## 📁 Folder Structure

```
client-ui/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with Redux Provider
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
│
├── src/
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Common components (Button, Input, etc.)
│   │   │   ├── Button.tsx
│   │   │   ├── Button.test.tsx
│   │   │   └── index.ts
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── features/             # Feature-specific components
│   │       ├── auth/
│   │       │   ├── LoginForm.tsx
│   │       │   ├── LoginForm.test.tsx
│   │       │   └── RegisterForm.tsx
│   │       └── user/
│   │           ├── UserProfile.tsx
│   │           └── UserList.tsx
│   │
│   ├── store/                    # Redux store configuration
│   │   ├── index.ts              # Store setup
│   │   ├── hooks.ts              # Typed Redux hooks
│   │   └── slices/               # Redux slices
│   │       ├── authSlice.ts
│   │       ├── userSlice.ts
│   │       └── index.ts
│   │
│   ├── services/                 # API service layer
│   │   ├── api.ts                # Base API service
│   │   ├── auth.service.ts       # Auth-related API calls
│   │   ├── user.service.ts       # User-related API calls
│   │   └── index.ts
│   │
│   ├── utils/                    # Utility functions
│   │   ├── constants.ts          # Constants & enums
│   │   ├── helpers.ts            # Helper functions
│   │   ├── validators.ts         # Validation functions
│   │   ├── formatters.ts         # Data formatting functions
│   │   └── index.ts
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useDebounce.ts
│   │   └── index.ts
│   │
│   ├── types/                    # TypeScript types/interfaces
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   │
│   ├── lib/                      # Third-party library configurations
│   │   ├── axios.ts              # Axios instance with interceptors
│   │   ├── redux-provider.tsx   # Redux Provider wrapper
│   │   └── utils.ts              # Shadcn utils (cn helper)
│   │
│   ├── middleware/               # Custom middleware
│   │   └── auth.middleware.ts
│   │
│   └── __tests__/                # Test utilities
│       ├── setup.ts              # Vitest setup
│       ├── mocks/                # MSW mocks
│       │   ├── handlers.ts
│       │   ├── server.ts
│       │   └── data.ts
│       └── utils/                # Test utilities
│           ├── test-utils.tsx
│           └── test-helpers.ts
│
├── public/                       # Static assets
├── .husky/                       # Git hooks
│   └── pre-commit
├── .env.local                    # Environment variables
├── .env.example                  # Environment variables template
├── .eslintrc.js                  # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .nvmrc                        # Node version
├── vitest.config.ts              # Vitest configuration
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── components.json               # Shadcn/ui configuration
└── package.json                  # Dependencies and scripts
```

## 🔑 Key Features

### Authentication with HTTP-Only Cookies

- **Secure**: Token stored in HTTP-only cookies (not accessible via JavaScript)
- **Automatic**: Cookies sent automatically with each request (`withCredentials: true`)
- **Backend-managed**: Backend sets/clears cookies on login/logout
- **LocalStorage**: Only stores non-sensitive user data

### State Management (Redux Toolkit)

- **Slices**: authSlice, userSlice
- **Async Thunks**: For API calls with loading/error states
- **Typed Hooks**: `useAppDispatch`, `useAppSelector`
- **Provider**: Wrapped in root layout

### API Layer

- **Axios Instance**: Configured with base URL, timeout, interceptors
- **withCredentials**: Enabled for cookie support
- **Interceptors**:
  - Request: Auto-include credentials
  - Response: Handle 401, format errors
- **Services**: Separated by domain (auth, user)

### Testing Setup (Vitest)

- **Unit Tests**: Co-located with source files (`.test.tsx`)
- **Integration Tests**: In `__tests__/integration/`
- **MSW**: Mock Service Worker for API mocking
- **Coverage**: v8 provider with HTML/JSON reports
- **Test Utils**: Custom render with Redux provider

### Code Quality Tools

- **Prettier**: Code formatting (100-char line width)
- **ESLint**: Linting with TypeScript, React, Next.js rules
- **Husky**: Pre-commit hooks
- **lint-staged**: Auto-fix on commit
- **TypeScript**: Strict mode enabled

### UI Components

- **Shadcn/ui**: Pre-built accessible components
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Reusable components in `src/components/`

## 📦 NPM Scripts

```json
{
  "dev": "next dev -p 3001", // Start dev server on port 3001
  "build": "next build", // Build for production
  "start": "next start -p 3001", // Start production server
  "lint": "eslint ...", // Run ESLint
  "lint:fix": "eslint ... --fix", // Auto-fix ESLint issues
  "lint:check": "eslint ...", // Check for linting errors
  "format:fix": "prettier --write ...", // Format code with Prettier
  "format:check": "prettier --check ...", // Check Prettier formatting
  "test": "vitest", // Run tests
  "test:ui": "vitest --ui", // Run tests with UI
  "test:coverage": "vitest --coverage", // Run tests with coverage
  "test:watch": "vitest --watch" // Run tests in watch mode
}
```

## 🔧 Configuration Files

### Environment Variables (`.env.local`)

```env
PORT=3001
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Axios Configuration (`src/lib/axios.ts`)

```typescript
- baseURL: API_BASE_URL
- timeout: 15000ms
- withCredentials: true  // ← Important for HTTP-only cookies
- Auto-redirect to /login on 401
```

### Redux Store (`src/store/index.ts`)

```typescript
- Slices: auth, user
- Typed hooks: useAppDispatch, useAppSelector
- Middleware: serializableCheck disabled
```

### Vitest Configuration (`vitest.config.ts`)

```typescript
- Environment: jsdom
- Setup: src/__tests__/setup.ts
- Coverage: v8 provider
- Alias: @ → ./src
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your API base URL
```

### 3. Run Development Server

```bash
npm run dev
```

Access at: http://localhost:3001

### 4. Run Tests

```bash
npm test              # Run all tests
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

### 5. Lint & Format

```bash
npm run lint:fix      # Fix linting issues
npm run format:fix    # Format code
```

## 📝 Usage Examples

### API Call with HTTP-Only Cookies

```typescript
// Login (sets cookie on backend)
await authService.login({ email, password });

// Subsequent requests automatically include cookie
await userService.getUsers();

// Logout (clears cookie on backend)
await authService.logout();
```

### Redux with TypeScript

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

const dispatch = useAppDispatch();
const { user, loading } = useAppSelector((state) => state.auth);

// Dispatch async action
await dispatch(login({ email, password }));
```

### Custom Hook

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, isAuthenticated, loading } = useAuth();
```

### Component with Test

```typescript
// Button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>;
}

// Button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("renders button", () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText("Click me")).toBeInTheDocument();
});
```

## 🔒 Security

### HTTP-Only Cookies

- ✅ Token not accessible via JavaScript
- ✅ Protected against XSS attacks
- ✅ Automatically included in requests
- ✅ Backend manages cookie lifecycle

### CORS Configuration (Backend)

```typescript
// Backend must set:
credentials: true;
origin: "http://localhost:3001";
```

### Cookie Options (Backend)

```typescript
httpOnly: true
secure: true (in production)
sameSite: 'strict'
```

## 📚 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Shadcn/ui
- **HTTP Client**: Axios
- **Testing**: Vitest + Testing Library + MSW
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky + lint-staged
- **Node Version**: v24.11.1 (via NVM)

## 📖 Best Practices

1. **Components**: One component per file, co-locate tests
2. **Types**: Define types in `src/types/`, use strict TypeScript
3. **API Calls**: Use service layer, handle errors consistently
4. **Redux**: Use async thunks for API calls, keep slices focused
5. **Tests**: Write tests alongside components, aim for >80% coverage
6. **Commits**: Pre-commit hooks auto-format and lint
7. **Naming**: Use PascalCase for components, camelCase for functions
8. **Imports**: Use @ alias for cleaner imports

## 🎯 Next Steps

1. Add more components (Input, Modal, Card, etc.)
2. Create protected routes with auth middleware
3. Add error boundary for better error handling
4. Set up CI/CD pipeline
5. Add E2E tests with Playwright/Cypress
6. Implement logging and monitoring
7. Add internationalization (i18n)
8. Optimize bundle size and performance

---

**Documentation Last Updated**: 2026-01-08
