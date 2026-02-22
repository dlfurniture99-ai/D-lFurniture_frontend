import { userApi } from "@/app/apis/config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const result = await userApi.post(`auth/register`, data);

    // Token is stored in HTTP-only cookie by backend, no need to store manually
    // Store user info in localStorage for client-side access
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error: any) {
    return error;
  }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  try {
    const result = await userApi.post(`auth/login`, data);

    // Token is stored in HTTP-only cookie by backend, no need to store manually
    // Store user info in localStorage for client-side access
    if (result.user) {
      localStorage.setItem('user', JSON.stringify(result.user));
    }

    return result;
  } catch (error: any) {
    return error.message;
  }
}

export function logout() {
  // Token is in HTTP-only cookie, browser will clear it on logout response
  localStorage.removeItem('user');
}

export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function isAuthenticated(): boolean {
  // Check if user info exists in localStorage
  // Token is in HTTP-only cookie and will be automatically sent with requests
  return getUser() !== null;
}
