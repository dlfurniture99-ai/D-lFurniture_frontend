'use client';

import { useEffect, useState } from 'react';
import { getAuthToken, removeAuthToken } from './api';
import { clearUserRole } from './auth-utils';

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
    if (typeof window === 'undefined') return;
    
    // Check which mode this tab is in (sessionStorage is per-tab)
    const activeMode = sessionStorage.getItem('activeMode');
    
    let storedToken: string | null = null;
    
    if (activeMode === 'admin') {
      // This tab is in admin mode - get admin token
      storedToken = localStorage.getItem('adminToken');
    } else if (activeMode === 'customer') {
      // This tab is in customer mode - get customer token
      storedToken = localStorage.getItem('authToken');
    } else {
      // New tab with no activeMode set - ensure no token is used
      storedToken = null;
      // Clear any stale tokens for this tab to be safe
      setUser(null);
      setToken(null);
      setIsLoading(false);
      return;
    }
    
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
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  const logout = () => {
    removeAuthToken();
    clearUserRole();
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
