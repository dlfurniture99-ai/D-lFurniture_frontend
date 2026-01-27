'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/useAuth';
import * as api from '@/lib/api';

const CART_STORAGE_KEY = 'danl_cart';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  mrp?: number;
  category?: string;
  stock?: number;
}

export function useCart() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Treat admins as guests (use localStorage, not API)
  const isCustomer = isAuthenticated && user?.role !== 'admin';

  // Helper to get local cart
  const getLocalCart = (): CartItem[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  // Helper to set local cart
  const setLocalCart = (items: CartItem[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('storage')); // Notify other tabs/components
  };

  // Load cart data
  const loadCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isCustomer) {
        // Fetch from API
        const response = await api.getCart();
        if (response.success && response.data) {
          // Transform API response to CartItem format
          const apiItems = response.data.items.map((item: any) => ({
            id: item.productId._id || item.productId,
            productId: item.productId._id || item.productId,
            name: item.productId.name || 'Unknown Product',
            price: item.price,
            quantity: item.quantity,
            image: item.productId.images?.[0] || item.productId.image || '/placeholder.jpg',
            mrp: item.productId.mrp,
            category: item.productId.category,
            stock: item.productId.stock
          }));
          setCart(apiItems);
        } else {
            setCart([]);
        }
      } else {
        // Fetch from LocalStorage
        setCart(getLocalCart());
      }
    } catch (err: any) {
      console.error('Failed to load cart', err);
      // Don't show error for 404 (empty cart)
      if (!err.message?.includes('404')) {
          setError(err.message || 'Failed to load cart');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isCustomer]);

  // Sync local cart to backend on login
  useEffect(() => {
    const syncCart = async () => {
      if (!isAuthLoading) {
        if (isCustomer) {
          const localItems = getLocalCart();
          if (localItems.length > 0) {
            setIsLoading(true);
            try {
              // Add all local items to backend
              for (const item of localItems) {
                await api.addToCart(item.productId, item.quantity);
              }
              // Clear local cart after sync
              localStorage.removeItem(CART_STORAGE_KEY);
              // Reload cart from API
              await loadCart();
            } catch (err) {
              console.error('Sync failed', err);
            } finally {
              setIsLoading(false);
            }
          } else {
              loadCart();
          }
        } else {
          loadCart();
        }
      }
    };

    syncCart();
  }, [isCustomer, isAuthLoading, loadCart]);

  // Listen for storage events (for guest mode across tabs)
  useEffect(() => {
    if (!isCustomer) {
      const handleStorageChange = () => {
        setCart(getLocalCart());
      };
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [isCustomer]);

  const addToCart = async (productOrId: any, quantity: number = 1) => {
    setError(null);
    try {
      if (isCustomer) {
        const productId = typeof productOrId === 'string' ? productOrId : (productOrId._id || productOrId.id);
        await api.addToCart(productId, quantity);
        await loadCart();
      } else {
        // Guest mode
        const localItems = getLocalCart();
        const productId = typeof productOrId === 'string' ? productOrId : (productOrId._id || productOrId.id);
        const existingItemIndex = localItems.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
          localItems[existingItemIndex].quantity += quantity;
        } else {
          if (typeof productOrId === 'string') {
             throw new Error('Cannot add to guest cart without product details');
          }
          
          const newItem: CartItem = {
            id: productId,
            productId: productId,
            name: productOrId.name,
            price: productOrId.price,
            quantity: quantity,
            image: productOrId.images?.[0] || productOrId.image || '/placeholder.jpg',
            mrp: productOrId.mrp,
            category: productOrId.category,
            stock: productOrId.stock
          };
          localItems.push(newItem);
        }
        setLocalCart(localItems);
        setCart(localItems);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart');
      throw err;
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      if (isCustomer) {
        await api.removeFromCart(productId);
        await loadCart();
      } else {
        const localItems = getLocalCart().filter(item => item.productId !== productId);
        setLocalCart(localItems);
        setCart(localItems);
      }
    } catch (err: any) {
        setError(err.message || 'Failed to remove item');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (isCustomer) {
        await api.updateCartItem(productId, quantity);
        await loadCart();
      } else {
        const localItems = getLocalCart();
        const itemIndex = localItems.findIndex(item => item.productId === productId);
        if (itemIndex > -1) {
            if (quantity <= 0) {
                localItems.splice(itemIndex, 1);
            } else {
                localItems[itemIndex].quantity = quantity;
            }
            setLocalCart(localItems);
            setCart(localItems);
        }
      }
    } catch (err: any) {
        setError(err.message || 'Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      if (isCustomer) {
        await api.clearCart();
        await loadCart();
      } else {
        setLocalCart([]);
        setCart([]);
      }
    } catch (err: any) {
        setError(err.message || 'Failed to clear cart');
    }
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getCount
  };
}