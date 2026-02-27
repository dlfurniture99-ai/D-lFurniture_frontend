// Admin API - uses cookies for authentication
// JWT token is stored in httpOnly cookie by backend

const API_BASE_URL = 
  process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000'
    : process.env.NEXT_PUBLIC_API_URL || 'https://dandlfurnitech-services.vercel.app';

/**
 * Fetch with cookies and error handling
 */
const fetchWithCookies = async (url: string, options: RequestInit = {}) => {
  console.log(`[Admin API] ${options.method || 'GET'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Send cookies automatically
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error(`[Admin API Error] ${response.status}: ${error.message || 'Unknown error'}`);
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return await response.json();
};

export const adminApi = {
  // Bookings API
  bookings: {
    getAll: async () => {
      try {
        const url = `${API_BASE_URL}/bookings/admin/all`;
        console.log('Fetching from:', url);
        return await fetchWithCookies(url, { method: 'GET' });
      } catch (error: any) {
        console.error('Failed to fetch bookings:', error);
        throw error;
      }
    },
    updateStatus: async (bookingId: string, status: string) => {
      try {
        const url = `${API_BASE_URL}/bookings/${bookingId}/status`;
        return await fetchWithCookies(url, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
      } catch (error: any) {
        console.error('Failed to update booking status:', error);
        throw error;
      }
    },
    cancel: async (bookingId: string) => {
      try {
        const url = `${API_BASE_URL}/bookings/${bookingId}/cancel`;
        return await fetchWithCookies(url, { method: 'PATCH' });
      } catch (error: any) {
        console.error('Failed to cancel booking:', error);
        throw error;
      }
    }
  },

  // Products API
  products: {
    getAll: async () => {
      try {
        const url = `${API_BASE_URL}/products/admin/all`;
        const response = await fetchWithCookies(url, { method: 'GET' });
        
        // Transform response to match expected format (products -> data)
        if (response.success && response.products) {
          return {
            success: true,
            data: response.products
          };
        }
        return response;
      } catch (error: any) {
        console.error('Failed to fetch products:', error);
        throw error;
      }
    },
    getById: async (productId: string) => {
      try {
        const url = `${API_BASE_URL}/products/${productId}`;
        const response = await fetchWithCookies(url, { method: 'GET' });
        
        // Transform response to match expected format (product -> data)
        if (response.success && response.product) {
          return {
            success: true,
            data: response.product
          };
        }
        if (response.success && response.data) {
          return response;
        }
        return response;
      } catch (error: any) {
        console.error('Failed to fetch product:', error);
        throw error;
      }
    },
    create: async (productData: any) => {
      try {
        const url = `${API_BASE_URL}/products`;
        return await fetchWithCookies(url, {
          method: 'POST',
          body: JSON.stringify(productData),
        });
      } catch (error: any) {
        console.error('Failed to create product:', error);
        throw error;
      }
    },
    update: async (productId: string, productData: any) => {
      try {
        const url = `${API_BASE_URL}/products/${productId}`;
        return await fetchWithCookies(url, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
      } catch (error: any) {
        console.error('Failed to update product:', error);
        throw error;
      }
    },
    delete: async (productId: string) => {
      try {
        const url = `${API_BASE_URL}/products/${productId}`;
        return await fetchWithCookies(url, { method: 'DELETE' });
      } catch (error: any) {
        console.error('Failed to delete product:', error);
        throw error;
      }
    },
    toggleVisibility: async (productId: string, isVisible: boolean) => {
      try {
        const url = `${API_BASE_URL}/products/${productId}/visibility`;
        return await fetchWithCookies(url, {
          method: 'PATCH',
          body: JSON.stringify({ isVisible }),
        });
      } catch (error: any) {
        console.error('Failed to toggle product visibility:', error);
        throw error;
      }
    }
  },

  // Users/Customers API
  customers: {
    getAll: async () => {
      try {
        const url = `${API_BASE_URL}/users`;
        return await fetchWithCookies(url, { method: 'GET' });
      } catch (error: any) {
        console.error('Failed to fetch customers:', error);
        throw error;
      }
    }
  }
};
