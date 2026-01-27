import axios, { AxiosInstance, AxiosError } from 'axios';

// API configuration
const API_BASE_URL = 
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/api'
    : process.env.NEXT_PUBLIC_API_URL || 'https://d-l-furniture-backend.vercel.app/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and handle FormData
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Let browser set Content-Type for FormData (with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token
      removeAuthToken();
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user?: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Login endpoint
export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw error;
  }
}

// Signup endpoint
export async function signupUser(payload: SignupPayload): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
    throw error;
  }
}

// Store token in localStorage with role-based keys + sessionStorage for per-tab tracking
export function setAuthToken(token: string, role?: string): void {
  if (typeof window !== 'undefined') {
    // Decode token to get role if not provided
    let userRole = role;
    if (!userRole && token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userRole = payload.role;
      } catch (err) {
        console.error('Failed to decode token for role:', err);
      }
    }

    // Store in role-specific key
    if (userRole === 'admin') {
      localStorage.setItem('adminToken', token);
      localStorage.removeItem('authToken'); // Clear customer token
      localStorage.setItem('userRole', 'admin');
      // Set session storage to indicate this tab is in admin mode
      sessionStorage.setItem('activeMode', 'admin');
    } else {
      localStorage.setItem('authToken', token);
      localStorage.removeItem('adminToken'); // Clear admin token
      localStorage.setItem('userRole', 'customer');
      // Set session storage to indicate this tab is in customer mode
      sessionStorage.setItem('activeMode', 'customer');
    }
  }
}

// Get token from localStorage - check per-tab mode (sessionStorage)
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    // Check which mode this tab is in (per-tab tracking)
    const activeMode = sessionStorage.getItem('activeMode');
    
    if (activeMode === 'admin') {
      return localStorage.getItem('adminToken');
    } else if (activeMode === 'customer') {
      return localStorage.getItem('authToken');
    }
    
    // If no activeMode is set, no token for this tab (fresh tab)
    return null;
  }
  return null;
}

// Remove token from localStorage - clear both keys
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userRole');
    sessionStorage.removeItem('activeMode');
  }
}

// Get authenticated headers
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============================================
// FURNITURE API FUNCTIONS
// ============================================

export interface Furniture {
  _id?: string;
  name: string;
  price: number;
  mrp: number;
  category: string;
  images: string[];
  discount?: number;
  rating?: number;
  reviews?: number;
  stock: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FurnitureListResponse {
  success: boolean;
  message: string;
  data?: {
    furniture: Furniture[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface CreateFurniturePayload {
  name: string;
  price: number;
  mrp: number;
  category: string;
  images: string[];
  discount?: number;
  stock: number;
  description?: string;
}

export interface UpdateFurniturePayload {
  id: string;
  data: Partial<CreateFurniturePayload>;
}

// Fetch all furniture with filters
export async function getAllFurniture(
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string,
  sortBy?: 'price' | 'rating' | 'bestsellers',
  minPrice?: number,
  maxPrice?: number
): Promise<FurnitureListResponse> {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (sortBy) params.append('sortBy', sortBy);
    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

    const response = await apiClient.get<FurnitureListResponse>(
      `/furniture/all-furniture?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch furniture');
    }
    throw error;
  }
}

// Fetch single furniture by ID
export async function getFurnitureById(id: string): Promise<{
  success: boolean;
  message: string;
  data?: Furniture;
}> {
  try {
    const response = await apiClient.get(
      `/furniture/single-furniture/${id}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch furniture');
    }
    throw error;
  }
}

// Create new furniture (Admin only)
export async function createFurniture(
  payload: CreateFurniturePayload | FormData
): Promise<{
  success: boolean;
  message: string;
  data?: Furniture;
}> {
  try {
    const response = await apiClient.post('/furniture/create-furniture', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to create furniture'
      );
    }
    throw error;
  }
}

// Update furniture (Admin only)
export async function updateFurniture(
  id: string,
  payload: Partial<CreateFurniturePayload> | FormData
): Promise<{
  success: boolean;
  message: string;
  data?: Furniture;
}> {
  try {
    const response = await apiClient.put(`/furniture/update-furniture?id=${id}`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to update furniture'
      );
    }
    throw error;
  }
}

// Delete furniture (Admin only)
export async function deleteFurniture(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await apiClient.delete(
      '/furniture/delete-furniture',
      { data: { id } }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete furniture'
      );
    }
    throw error;
  }
}

// ============================================
// CART API FUNCTIONS
// ============================================

export interface CartItem {
  _id?: string;
  productId: string | { _id: string; name: string; price: number; images: string[] };
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  userId: string;
  items: CartItem[];
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  data?: Cart;
}

// Get cart
export async function getCart(): Promise<CartResponse> {
  try {
    const response = await apiClient.get<CartResponse>('/cart/getcart');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
    throw error;
  }
}

// Add item to cart
export async function addToCart(productId: string, quantity: number = 1): Promise<CartResponse> {
  try {
    const response = await apiClient.post<CartResponse>('/cart/add-cart', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) { 
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
    throw error;
  }
}

// Update cart item quantity
export async function updateCartItem(productId: string, quantity: number): Promise<CartResponse> {
  try {
    const response = await apiClient.put<CartResponse>('/cart/update-cart', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
    throw error;
  }
}

// Remove item from cart
export async function removeFromCart(productId: string): Promise<CartResponse> {
  try {
    const response = await apiClient.delete<CartResponse>('/cart/remove-cart', {
      data: { productId },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
    throw error;
  }
}

// Clear entire cart
export async function clearCart(): Promise<CartResponse> {
  try {
    const response = await apiClient.post<CartResponse>('/cart/clear-cart');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
    throw error;
  }
}

// ============================================
// ORDER API FUNCTIONS
// ============================================

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id?: string;
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data?: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Get all orders (Admin only)
export async function getAllOrders(page: number = 1, limit: number = 20): Promise<OrdersResponse> {
  try {
    const response = await apiClient.get<OrdersResponse>(
      `/orders/admin/all?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
    throw error;
  }
}

// Get user's orders
export async function getUserOrders(): Promise<{
  success: boolean;
  message: string;
  data?: Order[];
}> {
  try {
    const response = await apiClient.get(`/orders`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
    throw error;
  }
}

// Get order by ID
export async function getOrderById(id: string): Promise<{
  success: boolean;
  message: string;
  data?: Order;
}> {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
    throw error;
  }
}

// Update order status (Admin only)
export async function updateOrderStatus(id: string, status: string): Promise<{
  success: boolean;
  message: string;
  data?: Order;
}> {
  try {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
    throw error;
  }
}


export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
    }
    throw error;
  }
};

export const getUserWishlist = async () => {
  try {
    const response = await apiClient.get('/wishlist/get-wishlist');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user wishlist');
    }
    throw error;
  }
};

export const getUserDashboard = async () => {
  try {
    const response = await apiClient.get('/user/dashboard');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user dashboard');
    }
    throw error;
  }
};


export const addToWishlist = async (productId: string) => { 
  try {
    const response = await apiClient.post('/wishlist/add-wishlist', { productId });
    return response.data;
  } catch (error) {
    if (axios .isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }   
    throw error;
  }
};

export const removeFromWishlist = async (productId: string) => {
  try {
    const response = await apiClient.delete('/wishlist/remove-wishlist', { data: { productId } });  
    return response.data;
  }
  catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to remove from wishlist');
    } 
    throw error;
  }
};

// ============================================
// CATEGORY API FUNCTIONS
// ============================================

export interface Category {
  _id?: string;
  id?: string;
  name: string;
  slug: string;
  image?: string;
  emoji?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: Category[];
    total?: number;
  };
}

// Fetch all categories (public endpoint)
export async function getAllCategories(): Promise<CategoriesResponse> {
  try {
    const response = await apiClient.get<CategoriesResponse>('/categories/public-category');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
    throw error;
  }
}

// Create category (Admin only)
export async function createCategory(data: {
  name: string;
  slug: string;
  image?: string;
  emoji?: string;
  description?: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: Category;
}> {
  try {
    const response = await apiClient.post('/categories/create-category', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create category');
    }
    throw error;
  }
}

// Update category (Admin only)
export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    image?: string;
    emoji?: string;
    description?: string;
  }
): Promise<{
  success: boolean;
  message: string;
  data?: Category;
}> {
  try {
    const response = await apiClient.put(`/categories/edit-category/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to update category');
    }
    throw error;
  }
}

// Delete category (Admin only)
export async function deleteCategory(id: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await apiClient.delete(`/categories/delete-category/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete category');
    }
    throw error;
  }
}