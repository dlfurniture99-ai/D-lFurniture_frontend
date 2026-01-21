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
  const { isAuthenticated } = useAuth();
  const { addToCart, error } = useCart();
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

  return (
    <Link href={`/product/${productId}`}>
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      {/* Image Container */}
      <div className="relative bg-gray-100 h-64 overflow-hidden">
        <Image
           src={productImage}
           alt={product.name}
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
         />

        {/* Sale Badge */}
        {productBadge && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            {productBadge}
          </div>
        )}

        {/* Best Seller Badge */}
        {isBestSeller && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
            Best Seller
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
          className="absolute bottom-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 transition shadow-md"
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`w-5 h-5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
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
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition">
          {product.name}
        </h4>

        {/* Rating */}
        <div className="mb-3">
          <StarRating rating={productRating} reviews={productReviews} />
        </div>

        {/* Price Section */}
        <div className="mb-3 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500 line-through">
            ₹{product.mrp.toLocaleString()}
          </span>
          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
            {product.discount || 0}% OFF
          </span>
        </div>

        {/* EMI Text */}
        {emiText && (
          <p className="text-xs text-blue-600 font-medium mb-4">
            {emiText}
          </p>
        )}

        {/* Add to Cart Button */}
        <div className="relative">
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          
          {showAddedNotification && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-green-500 text-white py-2 rounded-lg font-semibold text-center text-sm animate-pulse">
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
