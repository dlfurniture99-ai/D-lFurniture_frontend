'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/mockData';
import { Furniture } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { useCart } from '@/lib/useCart';
import { useWishlist } from '@/lib/useWishlist';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product | Furniture;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);
  
  const { user, isAuthenticated: isAuth } = useAuth();
  // Fix: Treat Admin as Guest for product interactions
  const isAuthenticated = isAuth && user?.role !== 'admin';

  const { cart, addToCart, updateQuantity, error } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Get product ID - handle both Product and Furniture types
  const productId = ('id' in product ? product.id : product._id || '') as any;
  const productIdString = String(productId);
  const productImage = 'image' in product ? product.image : (product.images && product.images[0]) || '/placeholder.jpg';
  const productRating: number = ('rating' in product && product.rating) ? product.rating : 0;
  const productReviews: number = 'reviews' in product && typeof product.reviews === 'number' ? product.reviews : 0;
  const productBadge = 'badge' in product ? product.badge : undefined;
  const isBestSeller = 'isBestSeller' in product ? product.isBestSeller : undefined;
  const emiText = 'emiText' in product ? product.emiText : undefined;

  const isWishlisted = isInWishlist(productIdString);

  // Find product in cart
  const cartItem = cart.find(item => String(item.productId) === productIdString);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      setIsAddingToCart(true);
      
      // useCart handles both authenticated (API) and guest (localStorage) logic
      await addToCart(product, 1);
      
      setShowAddedNotification(true);
      // Trigger storage event so header updates cart count
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => setShowAddedNotification(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setShowAddedNotification(false);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleIncreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingQuantity(true);
      await updateQuantity(productIdString, quantityInCart + 1);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error updating quantity:', err);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  const handleDecreaseQuantity = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantityInCart <= 1) {
      // If quantity is 1, remove from cart
      handleRemoveFromCart(e);
    } else {
      try {
        setIsUpdatingQuantity(true);
        await updateQuantity(productIdString, quantityInCart - 1);
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error('Error updating quantity:', err);
      } finally {
        setIsUpdatingQuantity(false);
      }
    }
  };

  const handleRemoveFromCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsUpdatingQuantity(true);
      await updateQuantity(productIdString, 0);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error removing from cart:', err);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  return (
    <Link href={`/product/${productId}`}>
      <div className="bg-white rounded-xl overflow-visible border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group relative">
        {/* Image Container */}
        <div className="relative bg-gray-100 h-72 overflow-hidden rounded-t-xl">
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {(product.discount || 0) > 0 && (
            <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
              {product.discount || 0}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={async (e) => {
              e.preventDefault();
              const wishlistItem: Product = {
                id: productId,
                name: product.name,
                price: product.price,
                mrp: product.mrp,
                category: product.category,
                image: productImage,
                rating: productRating,
                reviews: productReviews as any,
                discount: product.discount || 0,
                badge: productBadge,
                isBestSeller,
                emiText,
                stock: product.stock,
                description: product.description,
              };
              await toggleWishlist(wishlistItem);
            }}
            className="absolute top-4 right-4 bg-white rounded-full p-3 hover:bg-orange-50 transition shadow-lg group/heart"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-6 h-6 transition-all ${
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover/heart:text-red-500'
              }`}
              stroke={isWishlisted ? 'none' : 'currentColor'}
              strokeWidth={isWishlisted ? 0 : 2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Out of Stock Overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          {/* Product Name */}
          <h4 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition h-14">
            {product.name}
          </h4>

          {/* Rating */}
          <div className="mb-3">
            <StarRating rating={productRating} reviews={productReviews} />
          </div>

          {/* Price Section */}
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
          </div>

          {/* EMI Text */}
          {emiText && (
            <p className="text-xs text-green-600 font-medium mb-3 bg-green-50 px-2 py-1 rounded w-fit">
              {emiText}
            </p>
          )}

          {/* Add to Cart Button or Quantity Controls */}
          <div className="relative">
            {quantityInCart > 0 ? (
              // Quantity Controls
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={handleDecreaseQuantity}
                  disabled={isUpdatingQuantity}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  −
                </button>
                <div className="flex-1 bg-orange-100 text-orange-700 py-3 rounded-lg font-bold text-center text-lg">
                  {quantityInCart}
                </div>
                <button
                  onClick={handleIncreaseQuantity}
                  disabled={isUpdatingQuantity || product.stock === 0}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  +
                </button>
              </div>
            ) : (
              // Add to Cart Button
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </button>
            )}

            {showAddedNotification && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-green-500 text-white py-2 px-4 rounded-lg font-semibold text-center text-sm animate-pulse whitespace-nowrap z-50">
                ✓ Added to Cart
              </div>
            )}

            {error && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-red-500 text-white py-2 rounded-lg font-semibold text-center text-sm">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
