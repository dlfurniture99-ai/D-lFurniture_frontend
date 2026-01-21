# Authentication Components Documentation

This document describes the authentication system implemented in the D&L Furnitech frontend.

## Overview

The authentication system provides:
- User login functionality
- User signup (registration) functionality
- JWT token management
- Protected routes with user context
- User menu with account navigation

## Components

### 1. LoginForm Component
**Location:** `components/auth/LoginForm.tsx`

**Features:**
- Email and password input fields
- Password visibility toggle
- Form validation
- Error handling and display
- Loading states
- Link to signup page

**Usage:**
```tsx
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return <LoginForm />;
}
```

### 2. SignupForm Component
**Location:** `components/auth/SignupForm.tsx`

**Features:**
- First name, last name, email, and password inputs
- Password confirmation field
- Password visibility toggles
- Comprehensive validation
- Error display
- Loading states
- Link to login page

**Usage:**
```tsx
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return <SignupForm />;
}
```

## API Integration

### api.ts
**Location:** `lib/api.ts`

Provides the following functions and types:

#### Types
```typescript
interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

#### Functions
- `loginUser(payload: LoginPayload): Promise<AuthResponse>` - Login with email and password
- `signupUser(payload: SignupPayload): Promise<AuthResponse>` - Create new account
- `setAuthToken(token: string): void` - Store JWT token in localStorage
- `getAuthToken(): string | null` - Retrieve JWT token from localStorage
- `removeAuthToken(): void` - Clear JWT token from localStorage
- `getAuthHeaders(): Record<string, string>` - Get headers with authorization token

#### Configuration
- Base URL: `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:3001/api`)
- Login endpoint: `POST /auth/login`
- Signup endpoint: `POST /auth/signup`

## Authentication Hook

### useAuth Hook
**Location:** `lib/useAuth.ts`

Custom React hook for managing authentication state.

**Usage:**
```tsx
'use client';

import { useAuth } from '@/lib/useAuth';

export default function MyComponent() {
  const { user, token, isLoading, isAuthenticated, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <p>Welcome, {user?.firstName}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return <div>Please log in</div>;
}
```

**Returns:**
```typescript
{
  user: User | null;           // Decoded user info from JWT
  token: string | null;         // Current JWT token
  isLoading: boolean;           // Initial load state
  isAuthenticated: boolean;     // Whether user is logged in
  logout(): void;               // Function to clear auth
}
```

## Pages

### Login Page
**Location:** `app/auth/login/page.tsx`

- Accessible at `/auth/login`
- Displays LoginForm component
- Styling with gradient background
- Back to home link
- Security features information

### Signup Page
**Location:** `app/auth/signup/page.tsx`

- Accessible at `/auth/signup`
- Displays SignupForm component
- Account benefits display
- Back to home link

### Account Page
**Location:** `app/account/page.tsx`

- Accessible at `/account`
- Shows user account menu
- Links to: profile, addresses, orders, wishlist

### Orders Page
**Location:** `app/orders/page.tsx`

- Accessible at `/orders`
- Shows user's order history
- Empty state when no orders

## Header Integration

The Header component has been updated to include:

### Authenticated Users
- User name display with profile icon
- Dropdown menu with:
  - Account info display (name and email)
  - Link to My Account
  - Link to My Orders
  - Logout button

### Unauthenticated Users
- Login link
- Sign up button

**Related changes in `components/Header.tsx`:**
- Added `useAuth` hook import
- Added user menu state management
- Added user menu dropdown UI
- Integrated logout functionality

## Configuration

### Environment Variables
Create `.env.local` in the frontend root:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

**Note:** Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Security Features

1. **JWT Token Storage:** Tokens stored in browser localStorage
2. **Token Persistence:** Tokens remain across browser sessions
3. **Token Expiration:** Backend validates token expiration
4. **Password Hashing:** Handled by backend
5. **HTTPS Support:** Ready for production with HTTPS

## Backend API Expectations

The frontend expects the backend to provide:

### Login Endpoint
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "buyer"
  }
}

Response (Error):
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Signup Endpoint
```
POST /auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response (Success):
{
  "success": true,
  "message": "Account created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "buyer"
  }
}

Response (Error):
{
  "success": false,
  "message": "Email already registered"
}
```

## Styling

- Uses Tailwind CSS for styling
- Color scheme matches D&L Furnitech design:
  - Primary gold: `color-gold` / `#D4AF37`
  - Dark background: `bg-gray-950` / `bg-black`
  - Neutral borders: `border-gray-800`
- Responsive design (mobile and desktop)
- Dark mode aesthetic

## Testing Credentials

For local testing with the backend:

```
Email: test@example.com
Password: password123
First Name: Test
Last Name: User
```

## Future Enhancements

Potential improvements:
1. Google/OAuth authentication
2. Two-factor authentication
3. Password reset functionality
4. Email verification
5. Session persistence with refresh tokens
6. Protected routes with middleware
7. Role-based access control (RBAC)
8. Social login (Facebook, Google)

## Troubleshooting

### Login failing with "Invalid credentials"
- Verify email and password are correct
- Check backend is running on correct port
- Verify `NEXT_PUBLIC_API_BASE_URL` environment variable

### Token not persisting
- Check browser localStorage is enabled
- Verify token is being saved (check browser DevTools)
- Check for CORS issues

### Cannot access protected pages
- Ensure token is valid and not expired
- Check user is authenticated using `useAuth` hook
- Verify backend token validation

## Related Files

- `lib/api.ts` - API endpoints and token management
- `lib/useAuth.ts` - Authentication hook
- `components/auth/LoginForm.tsx` - Login form component
- `components/auth/SignupForm.tsx` - Signup form component
- `components/Header.tsx` - Header with auth integration
- `app/auth/login/page.tsx` - Login page
- `app/auth/signup/page.tsx` - Signup page
- `app/account/page.tsx` - Account dashboard
- `app/orders/page.tsx` - Orders page
