'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, removeAuthToken } from './api';

export interface User {
  userId: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get token from localStorage
    const storedToken = getAuthToken();
    setToken(storedToken);
    
    // Decode JWT to get user info
    if (storedToken) {
      // Decode JWT payload (without validation, just parsing)
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        // Token payload has userId, email, role directly
        if (payload.userId && payload.email && payload.role) {
          setUser({
            userId: payload.userId,
            email: payload.email,
            role: payload.role,
          });
        }
      } catch (err) {
        console.error('Failed to decode token:', err);
        removeAuthToken();
        setToken(null);
      }
    }
    
    setIsLoading(false);
  }, []);

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    logout,
  };
}
