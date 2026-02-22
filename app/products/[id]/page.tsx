'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import { cartStore } from '@/lib/cartStore';
import { wishlistStore } from '@/lib/wishlistStore';
import { apiClient } from '@/app/apis/config';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  category: string;
  reviews?: Array<{
    _id?: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt?: string;
  }>;
  specifications?: Array<{
    key: string;
    value: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  // State Management
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch Product
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ success: boolean; product: Product }>(
        `/products/${productId}`
      );

      if (response.success && response.product) {
        setProduct(response.product);
        // Use _id as slug fallback for API-based products
        setIsInWishlist(wishlistStore.isInWishlist(response.product._id || productId));
      } else {
        setError('Product not found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load product');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add to Cart
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        cartStore.addItem({
          id: parseInt(productId),
          name: product.name,
          price: product.price,
          productImage: product.images,
          rating: product.rating,
          discount: 0,
        } as any);
      }

      setShowNotification(true);
      window.dispatchEvent(new Event('storage'));
      setTimeout(() => setShowNotification(false), 2000);
    }
  };

  // Toggle Wishlist
  const handleWishlist = () => {
    if (product) {
       wishlistStore.toggleWishlist({
         productSlug: product._id || productId,
         id: parseInt(productId),
         name: product.name,
         price: product.price,
         productImage: product.images,
         rating: product.rating,
         discount: 0,
       } as any);
       setIsInWishlist(!isInWishlist);
       window.dispatchEvent(new Event('storage'));
     }
    };

  // Add Review
  const handleAddReview = async () => {
    if (!userComment.trim()) {
      alert('Please write a comment');
      return;
    }

    try {
      setSubmittingReview(true);
      const response = await apiClient.post<{ success: boolean; product: Product }>(
        `/products/${productId}/reviews`,
        {
          rating: userRating,
          comment: userComment,
        }
      );

      if (response.success) {
        setProduct(response.product);
        setUserRating(5);
        setUserComment('');
        alert('Review posted successfully!');
      }
    } catch (err: any) {
      alert('Failed to post review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  // Get Product Images
  const images = product?.images && Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product?.image
    ? [product.image]
    : [];

  // Loading State
  if (loading) {
    return (
      <div className="w-full bg-gray-50 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <div className="h-12 w-12 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !product) {
    return (
      <div className="w-full bg-gray-50 min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center bg-white rounded-lg p-8 shadow">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <a href="/" className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-700 transition">
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="w-full bg-gray-50 min-h-screen flex flex-col">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-600">
          <a href="/" className="text-yellow-600 hover:text-yellow-700">Home</a>
          <span className="mx-2">/</span>
          <a href="/" className="text-yellow-600 hover:text-yellow-700 capitalize">{product.category}</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Product Info Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden w-full aspect-square">
                {images[selectedImage] && (
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                        selectedImage === idx
                          ? 'border-yellow-600 ring-2 ring-yellow-400'
                          : 'border-gray-300 hover:border-yellow-400'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`View ${idx + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6">
              {/* Product Name & Rating */}
              <div>
                <p className="text-yellow-600 text-sm font-semibold mb-2 capitalize">{product.category}</p>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <StarRating rating={product.rating} reviews={product.reviews?.length || 0} />
                  <span className="text-sm text-gray-600">
                    {product.rating}/5 rating
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Price Section */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <span className="text-3xl md:text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Free delivery on orders above ₹500</p>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">About this product</h2>
                <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-3 pt-2">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition font-semibold"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-bold text-gray-900 border-l border-r border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition font-semibold"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={handleWishlist}
                    className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition font-semibold ${
                      isInWishlist
                        ? 'bg-red-50 border-red-500 text-red-500'
                        : 'border-gray-300 text-gray-600 hover:border-red-500'
                    }`}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    ❤️
                  </button>
                </div>

                <div className="relative">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🛒 Add to Cart
                  </button>
                  {showNotification && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-green-500 text-white py-2 px-3 rounded-lg font-semibold text-center text-sm shadow-lg">
                      ✓ Added to Cart
                    </div>
                  )}
                </div>

                <button className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed" disabled={product.stock === 0}>
                  Buy Now
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex gap-2 items-start">
                  <span className="text-lg">🚚</span>
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Free delivery</span> on orders above ₹500
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-lg">↩️</span>
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">7 days return policy</span> - Easy returns
                  </p>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-lg">🔒</span>
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Secure checkout</span> - 100% safe payment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Reviews */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
              <div className="space-y-4">
                {product.specifications.map((spec, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-200 pb-4">
                    <span className="text-gray-600 font-medium">{spec.key}</span>
                    <span className="text-gray-900 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Reviews ({product.reviews?.length || 0})</h3>
            
            {/* Reviews List */}
            <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div key={review._id || idx} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-900">{review.userName}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                    {review.createdAt && (
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to review!</p>
              )}
            </div>

            {/* Add Review Form */}
            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-gray-900 font-semibold mb-3">Add Your Review</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-700 text-sm mb-1 block">Rating</label>
                  <select
                    value={userRating}
                    onChange={(e) => setUserRating(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    <option value="4">⭐⭐⭐⭐ Good</option>
                    <option value="3">⭐⭐⭐ Average</option>
                    <option value="2">⭐⭐ Poor</option>
                    <option value="1">⭐ Bad</option>
                  </select>
                </div>
                <textarea
                  placeholder="Write your review..."
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  rows={3}
                />
                <button
                  onClick={handleAddReview}
                  disabled={submittingReview}
                  className="w-full py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition disabled:opacity-50"
                >
                  {submittingReview ? 'Posting...' : 'Post Review'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
