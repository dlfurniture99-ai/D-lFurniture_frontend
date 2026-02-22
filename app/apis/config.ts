// ============================================================
// FETCH-BASED API CONFIGURATION
// ============================================================

// Environment variables (Next.js client-side safe)
const API_BASE_URL = (globalThis as any).NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const NODE_ENV = (globalThis as any).NODE_ENV || 'development';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

interface ErrorResponse {
  message: string;
  statusCode: number;
  error?: any;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

// ============================================================
// API CLIENT CLASS
// ============================================================

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  /**
   * Get authorization token from localStorage
   */
  protected getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  /**
   * Build headers with authorization
   */
  protected buildHeaders(options?: RequestOptions): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...options?.headers };
    const token = this.getAuthToken();

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle response
   */
  protected async handleResponse<T>(response: Response): Promise<T> {
    // Log response in development
    if (NODE_ENV === 'development') {
      console.log(`[API Response] ${response.status} ${response.url}`);
    }

    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    let data: any;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Check for HTTP errors
    if (!response.ok) {
      const errorMessage = data?.message || `HTTP Error ${response.status}`;

      // Handle 401 Unauthorized
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('authToken');
          sessionStorage.removeItem('user');
          // window.location.href = '/login';
        }
      }

      // Log error in development
    

      throw {
        message: errorMessage,
        statusCode: response.status,
        error: data,
      } as ErrorResponse;
    }

    if (NODE_ENV === 'development') {
      console.log('Response Data:', data);
    }

    return data;
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options);

    if (NODE_ENV === 'development') {
      console.log(`[API Request] GET ${url}`);
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (NODE_ENV === 'development') {
        console.error('[Request Error]', error);
      }
      throw error;
    }
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (NODE_ENV === 'development') {
        console.error('[Request Error]', error);
      }
      throw error;
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (NODE_ENV === 'development') {
        console.error('[Request Error]', error);
      }
      throw error;
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options);

    if (NODE_ENV === 'development') {
      console.log(`[API Request] DELETE ${url}`);
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (NODE_ENV === 'development') {
        console.error('[Request Error]', error);
      }
      throw error;
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.buildHeaders(options);

    if (NODE_ENV === 'development') {
      console.log(`[API Request] PATCH ${url}`);
    }

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        credentials: 'include',
        body: data ? JSON.stringify(data) : undefined,
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      if (NODE_ENV === 'development') {
        console.error('[Request Error]', error);
      }
      throw error;
    }
  }
}

// ============================================================
// API INSTANCES
// ============================================================

export const userApi = new ApiClient(`${API_BASE_URL}/`);
export const adminApi = new ApiClient(`${API_BASE_URL}/admin`);
export const apiClient = new ApiClient(API_BASE_URL);

// Admin Auth API Client
export const adminAuthApi = {
  requestOTP: async (email: string) => {
    return apiClient.post('/admin/auth/request-otp', { email });
  },
  verifyOTP: async (email: string, otp: string) => {
    return apiClient.post('/admin/auth/verify-otp', { email, otp });
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Set authorization token
 */
export const setAuthToken = (token: string | null) => {
  if (token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }
};

/**
 * Get authorization token
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
  }
};

// ============================================================
// EXPORTS
// ============================================================

export type { ApiResponse, ErrorResponse };
export { ApiClient };
