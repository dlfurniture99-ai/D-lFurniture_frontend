'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Product } from '@/lib/mockData';
import { cartStore } from '@/lib/cartStore';
import { wishlistStore } from '@/lib/wishlistStore';
import StarRating from './StarRating';
import './animations.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
   const [showAddedNotification, setShowAddedNotification] = useState(false);
   const [isInWishlist, setIsInWishlist] = useState(false);
   
  // Handle both old and new data formats
  const productId = product.id || parseInt(product._id?.slice(-6) || '0');
  const name = product.name || product.productName || '';
  const brand = product.brand || '';
  const price = product.price || (typeof product.productPrice === 'string' ? parseInt(product.productPrice) : product.productPrice) || 0;
  const slug = product?.slug || product.productSlug || '';
  const imageArray = product?.images || product.productImage || [];
  const imageUrl = Array.isArray(imageArray) ? imageArray[0] : imageArray || '';
  
  const [productImage, setProductImage] = useState(imageUrl);
  const rating = product.rating || product.productReview || 0;
  const discount = product.discountPercentage || product.discount || product.productDiscount || 0;

  useEffect(() => {
    setIsInWishlist(wishlistStore.isInWishlist(slug));
  }, [slug]);

  useEffect(() => {
    const newImageUrl = Array.isArray(imageArray) ? imageArray[0] : imageArray || '';
    if (newImageUrl) {
      setProductImage(newImageUrl);
    }
  }, [imageArray]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    cartStore.addItem({...product, id: productId, name, price, rating, discount });
    // Trigger storage event so header updates cart count
    window.dispatchEvent(new Event('storage'));
    setShowAddedNotification(true);
    setTimeout(() => setShowAddedNotification(false), 2000);
  };
  const productLink = `/product?product=${slug}`;

  return (
    <Link href={productLink}>
      <div className="group h-full">
        <div className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col">
          
          {/* Image Container */}
          <div className="relative bg-gray-100 h-32 md:h-64 overflow-hidden flex-shrink-0">
            {productImage ? (
              <Image
                 src={productImage}
                 alt={name}
                 fill
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
               />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <span className="text-gray-500 font-medium text-sm">No Image</span>
              </div>
            )}

            {/* Sale Badge */}
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg">
                {discount}% OFF
              </div>
            )}

            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                wishlistStore.toggleWishlist({ ...product, productSlug: slug, id: productId, name, price, rating, discount });
                setIsInWishlist(!isInWishlist);
                window.dispatchEvent(new Event('storage'));
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-2 hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart
                className={`w-5 h-5 transition-all ${
                  isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                }`}
                strokeWidth={2}
              />
            </button>

            {/* Add to Cart Button - On Image */}
            <button
              onClick={handleAddToCart}
              className="absolute top-12 right-2 w-9 h-9 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 hover:from-amber-600 hover:to-amber-700 transition-all duration-300"
              title="Add to Cart"
            >
              <FiShoppingCart className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-3 md:p-4 flex-grow flex flex-col">
            {/* Brand Name */}
            {brand && (
              <p className="text-xs text-gray-500 font-semibold tracking-wide mb-1 uppercase">
                {brand}
              </p>
            )}

            {/* Product Name */}
            <h4 className="text-xs md:text-sm font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition">
              {name}
            </h4>

            {/* Rating */}
            <div className="mb-2 md:mb-3">
              <StarRating rating={rating} reviews={0} />
            </div>

            {/* Price Section */}
            <div className="mb-3 md:mb-4">
              <div className="flex items-baseline gap-2">
                <span className="text-base md:text-lg font-bold text-gray-900">
                  ₹{price.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-xs text-gray-500 line-through">
                    ₹{Math.round(price / (1 - discount/100)).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* EMI Text */}
            {product.emiText && (
              <p className="text-xs text-blue-600 font-semibold mb-3 md:mb-4">
                {product.emiText}
              </p>
            )}

            {/* Notification */}
            {showAddedNotification && (
              <div className="mt-3 bg-green-500 text-white py-1.5 rounded-lg font-semibold text-center text-xs animate-pulse">
                ✓ Added to Cart
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
