'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head';
import { toast } from 'sonner';
import StarRating from '@/components/StarRating';
import { Product } from '@/lib/mockData';
import { cartStore } from '@/lib/cartStore';
import { wishlistStore } from '@/lib/wishlistStore';
import { getAllProducts } from '@/app/apis/products';
import { userApi } from '@/app/apis/config';
import { FaShare, FaWhatsapp, FaFacebook, FaTwitter, FaLink } from 'react-icons/fa';

function ProductPageContent() {
  const searchParams = useSearchParams();
  const productSlug = searchParams.get('product');
  const productId = searchParams.get('id');
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getAllProducts();
        if (res?.success && res?.data) {
          let foundProduct = null;
          
          if (productSlug) {
            foundProduct = res.data.find((p: any) => 
              (p.productSlug || p.slug) === productSlug
            );
          } else if (productId) {
            foundProduct = res.data.find((p: any) => 
              p.id?.toString() === productId || p._id === productId || p.productId === productId
            );
          }
          
          if (foundProduct) {
            setProduct(foundProduct);
            setSelectedImage(0);
            setIsInWishlist(wishlistStore.isInWishlist(foundProduct.productSlug || foundProduct.slug));

            // Get related products (same type/category)
            const foundCategory = foundProduct.productType || foundProduct.category;
            const foundSlug = foundProduct.productSlug || foundProduct.slug;
            const related = res.data
              .filter((p: any) => {
                const pCategory = p.productType || p.category;
                const pSlug = p.productSlug || p.slug;
                return pCategory === foundCategory && pSlug !== foundSlug;
              })
              .slice(0, 4); // Show 4 related products
            
            setRelatedProducts(related);
          } else {
            setProduct(null);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug, productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
          <a href="/" className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700">
            Back to Home
          </a>
        </div>
      </div>
    );
  }
  console.log(product);

  const productName = product.name || product.productName || '';
  const brand = product.brand || '';
  const productPrice = product.price || (typeof product.productPrice === 'string' 
    ? parseInt(product.productPrice) 
    : product.productPrice) || 0;
  const productRating = product.rating || product.productReview || 0;
  const discount = product.discountPercentage || product.discount || product.productDiscount || 0;
  const description = product.description || product.fullDescription || product.shortDescription || product.productDescription || '';
  const images = (product.images || product.productImage || []) as string[];
  const productId_final = typeof product.id === 'number' 
    ? product.id 
    : parseInt(String(product.id || product._id || '0'), 10);


  const discountedPrice = discount > 0 
    ? Math.round(productPrice * (1 - discount / 100))
    : productPrice;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      cartStore.addItem({
        ...product,
        id: productId_final,
        name: productName,
        price: discountedPrice,
        rating: productRating,
        discount,
      });
    }
    setShowAddedNotification(true);
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const handleToggleWishlist = () => {
    wishlistStore.toggleWishlist({
      ...product,
      productSlug: product?.productSlug || '',
      id: productId_final,
      name: productName,
      price: discountedPrice,
      rating: productRating,
      discount,
    });
    setIsInWishlist(!isInWishlist);
    window.dispatchEvent(new Event('storage'));
  };

  const handleSubmitReview = async () => {
    console.log('=== REVIEW SUBMIT START ===');
    console.log('1. Comment:', reviewComment);
    console.log('2. Comment length:', reviewComment.length);
    console.log('3. Comment trimmed:', reviewComment.trim());
    console.log('4. Rating:', rating);
    
    if (!reviewComment.trim()) {
      console.log('ERROR: Comment is empty, returning');
      toast.error('Please write a review comment');
      return;
    }
    console.log('5. Comment validation passed');

    const token = localStorage.getItem('token');
    console.log('6. Token present:', !!token);
    if (!token) {
      console.log('ERROR: No token, returning');
      toast.error('Please login to add a review');
      return;
    }
    console.log('7. Token validation passed');

    console.log('8. Setting submittingReview to true');
    setSubmittingReview(true);
    try {
      const reviewData = {
        rating,
        comment: reviewComment.trim()
      };
      console.log('9. Review data:', reviewData);
      console.log('10. Product ID:', product?._id);
      
      if (!product?._id) {
        console.log('ERROR: No product ID');
        throw new Error('Product ID is missing');
      }

      const endpoint = `products/${product._id}/reviews`;
      console.log('11. API Endpoint:', endpoint);
      
      const response = await userApi.post(endpoint, reviewData);
      console.log('12. Review response:', response);

      if (response?.success) {
        toast.success('Review added successfully!');
        setReviewComment('');
        setRating(5);
        // Refresh product data
        const res = await getAllProducts();
        if (res?.success && res?.data) {
          const updated = res.data.find((p: any) => 
            (p.productSlug || p.slug) === productSlug
          );
          if (updated) {
            setProduct(updated);
          }
        }
      } else {
        console.error('Review failed:', response);
        toast.error(response?.message || 'Failed to add review');
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      console.error('Error response:', error?.response?.data);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Meta tags for social sharing
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/product?product=${productSlug}` : '';
  const imageUrl = images?.[0] || '';

  const handleShare = (platform: string) => {
    const text = `Check out this amazing ${productName}! ${discount > 0 ? `Now ${discount}% OFF!` : ''}`;
    const shareUrl = productUrl;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        break;
    }
  };

  return (
    <div className="w-full bg-gray-50">
      <Head>
        {product && (
          <>
            <meta property="og:type" content="product" />
            <meta property="og:title" content={productName} />
            <meta property="og:description" content={description.substring(0, 160)} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:url" content={productUrl} />
            <meta property="og:site_name" content="D&L Furnitech" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={productName} />
            <meta name="twitter:description" content={description.substring(0, 160)} />
            <meta name="twitter:image" content={imageUrl} />
            <meta property="product:price:amount" content={discountedPrice.toString()} />
            <meta property="product:price:currency" content="INR" />
            <meta property="product:availability" content={productRating > 0 ? 'in stock' : 'out of stock'} />
          </>
        )}
      </Head>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="relative bg-white rounded-lg overflow-hidden mb-4 h-96 md:h-[500px]">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImage]}
                  alt={productName}
                  fill
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
              
              {discount > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold">
                  {discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index 
                        ? 'border-yellow-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${productName} ${index + 1}`}
                      fill
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            {/* Brand */}
            {brand && (
              <p className="text-sm text-gray-500 font-medium mb-2">
                {brand}
              </p>
            )}
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{productName}</h1>
            
            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <StarRating rating={productRating} reviews={0} />
              <span className="text-sm text-gray-600">({productRating} out of 5)</span>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{productPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {discount > 0 && (
                <p className="text-green-600 font-semibold">
                  You save ₹{(productPrice - discountedPrice).toLocaleString()} ({discount}%)
                </p>
              )}
            </div>

            {/* Share Buttons */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3">Share This Product</p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm"
                  title="Share on WhatsApp"
                >
                  <FaWhatsapp size={16} />
                  WhatsApp
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                  title="Share on Facebook"
                >
                  <FaFacebook size={16} />
                  Facebook
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium text-sm"
                  title="Share on Twitter"
                >
                  <FaTwitter size={16} />
                  Tweet
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium text-sm"
                  title="Copy Link"
                >
                  <FaLink size={16} />
                  Copy
                </button>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About this product</h3>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Product Details */}
            <div className="mb-8 border-t border-b border-gray-200 py-4">
              {brand && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Brand:</span>
                  <span className="text-gray-900 font-semibold">{brand}</span>
                </div>
              )}
              {(product.sku) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">SKU:</span>
                  <span className="text-gray-900 font-semibold">{product.sku}</span>
                </div>
              )}
              {(product.productType || product.category) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Category:</span>
                  <span className="text-gray-900 font-semibold capitalize">{product.productType || product.category}</span>
                </div>
              )}
              {(product.material) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Material:</span>
                  <span className="text-gray-900 font-semibold">{product.material}</span>
                </div>
              )}
              {(product.dimensions) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="text-gray-900 font-semibold">{product.dimensions}</span>
                </div>
              )}
              {(product.weight) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Weight:</span>
                  <span className="text-gray-900 font-semibold">{product.weight}</span>
                </div>
              )}
              {(product.warranty) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Warranty:</span>
                  <span className="text-gray-900 font-semibold">{product.warranty}</span>
                </div>
              )}
              {(product.returnPolicy) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Return Policy:</span>
                  <span className="text-gray-900 font-semibold">{product.returnPolicy}</span>
                </div>
              )}
              {(product.colors && product.colors.length > 0) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Available Colors:</span>
                  <span className="text-gray-900 font-semibold">{product.colors.join(', ')}</span>
                </div>
              )}
              {(product.finishes && product.finishes.length > 0) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Available Finishes:</span>
                  <span className="text-gray-900 font-semibold">{product.finishes.join(', ')}</span>
                </div>
              )}
              {(product.stock !== undefined) && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Availability:</span>
                  <span className={`font-semibold ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              )}
            </div>

            {/* Specifications Section */}
            {(product.specifications && product.specifications.length > 0) && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="space-y-2">
                  {product.specifications.map((spec: any, index: number) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">{spec.key}:</span>
                      <span className="text-gray-900 font-semibold">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Quantity:</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  −
                </button>
                <span className="text-2xl font-bold text-gray-900 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="col-span-2 bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition relative"
              >
                Add to Cart
                {showAddedNotification && (
                  <div className="absolute inset-0 bg-green-500 rounded-lg flex items-center justify-center font-bold">
                    ✓ Added!
                  </div>
                )}
              </button>
              <button
                onClick={handleToggleWishlist}
                className="border-2 border-gray-300 rounded-lg hover:border-red-500 transition"
              >
                <svg
                  className={`w-6 h-6 mx-auto transition-colors ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-700'
                  }`}
                  stroke={isInWishlist ? 'none' : 'currentColor'}
                  strokeWidth={isInWishlist ? 0 : 2}
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

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Free Shipping:</span> On orders over ₹499
              </p>
              <p className="text-sm text-blue-900 mt-2">
                <span className="font-semibold">Easy Returns:</span> 30-day return policy
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
          <div className="text-sm text-gray-600 mb-4">Debug: {product?.reviews?.length || 0} reviews</div>
          
          {/* Existing Reviews */}
          {product?.reviews && product.reviews.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({product.reviews.length})</h3>
              <div className="space-y-4">
                {product.reviews.map((review: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{review.userName || 'Anonymous'}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Review Form */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Your Review</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="text-4xl transition-colors"
                  >
                    <span className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Your Review</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-600 resize-none"
                rows={5}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                console.log('BUTTON CLICKED - calling handleSubmitReview');
                console.log('handleSubmitReview function:', typeof handleSubmitReview);
                console.log('reviewComment state:', reviewComment);
                console.log('rating state:', rating);
                handleSubmitReview();
              }}
              disabled={submittingReview}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </section>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-gray-200 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => {
                const relName = relProduct.name || relProduct.productName || '';
                const relPrice = typeof relProduct.productPrice === 'string' 
                  ? parseInt(relProduct.productPrice) 
                  : relProduct.productPrice || 0;
                const relRating = relProduct.rating || relProduct.productReview || 0;
                const relDiscount = relProduct.discount || relProduct.productDiscount || 0;
                const relImage = relProduct.productImage?.[0] || '';
                const relSlug = relProduct.productSlug;

                return (
                  <a
                    key={relProduct._id}
                    href={`/product?product=${relSlug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                      {/* Product Image */}
                      <div className="relative bg-gray-100 h-64 overflow-hidden">
                        {relImage ? (
                          <Image
                            src={relImage}
                            alt={relName}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}

                        {relDiscount > 0 && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold">
                            {relDiscount}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition">
                          {relName}
                        </h4>

                        {/* Rating */}
                        <div className="mb-3">
                          <StarRating rating={relRating} reviews={0} />
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ₹{Math.round(relPrice * (1 - relDiscount / 100)).toLocaleString()}
                          </span>
                          {relDiscount > 0 && (
                            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">
                              {relDiscount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
            </section>
            )}
            </main>
            </div>
            );
            }

            export default function ProductPage() {
            return (
            <Suspense fallback={<main className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-500">Loading product...</div></main>}>
            <ProductPageContent />
            </Suspense>
            );
            }
