'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { getUserWishlist, addToWishlist as apiAddToWishlist, removeFromWishlist as apiRemoveFromWishlist } from './api';
import { wishlistStore } from './wishlistStore';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const syncWishlist = useCallback(async () => {
    if (isAuthenticated) {
      setLoading(true);
      try {
        const res = await getUserWishlist();
        if (res.success && res.data) {
            // Assuming backend returns the wishlist object with a productIds array
            setWishlist(res.data.productIds || []);
        }
      } catch (err) {
        console.error('Failed to sync wishlist:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setWishlist(wishlistStore.getWishlist());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    syncWishlist();
    
    const handleWishlistUpdate = () => syncWishlist();
    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    
    if (!isAuthenticated) {
        const handleStorage = () => setWishlist(wishlistStore.getWishlist());
        window.addEventListener('storage', handleStorage);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('wishlist-updated', handleWishlistUpdate);
        };
    }
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [isAuthenticated, syncWishlist]);

  const addToWishlist = async (product: any) => {
    if (isAuthenticated) {
        const productId = product.id || product._id;
        await apiAddToWishlist(productId);
        await syncWishlist();
        window.dispatchEvent(new Event('wishlist-updated'));
    } else {
        wishlistStore.addItem(product);
        setWishlist(wishlistStore.getWishlist());
        window.dispatchEvent(new Event('storage'));
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (isAuthenticated) {
        await apiRemoveFromWishlist(productId);
        await syncWishlist();
        window.dispatchEvent(new Event('wishlist-updated'));
    } else {
        wishlistStore.removeItem(Number(productId));
        setWishlist(wishlistStore.getWishlist());
        window.dispatchEvent(new Event('storage'));
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item: any) => {
        const itemId = item._id || item.id;
        return String(itemId) === String(productId);
    });
  };

  const toggleWishlist = async (product: any) => {
    const productId = String(product.id || product._id);
    if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
    } else {
        await addToWishlist(product);
    }
  };

  return { wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist };
}