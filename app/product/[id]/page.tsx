'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeaderNew from '@/components/HeaderNew';
import OfferBar from '@/components/OfferBar';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import { getFurnitureById, Furniture } from '@/lib/api';
import { cartStore } from '@/lib/cartStore';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Furniture | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getFurnitureById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const productImages = product?.images || [];

  // Handle keyboard navigation in modal
  useEffect(() => {
    if (!showImageModal) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev === 0 ? productImages.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) =>
          prev === productImages.length - 1 ? 0 : prev + 1
        );
      } else if (e.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, productImages.length]);

  if (loading) {
    return (
      <div className="w-full">
        <OfferBar />
        <HeaderNew />
        <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full">
        <OfferBar />
        <HeaderNew />
        <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <Link href="/" className="text-yellow-500 hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    // Convert Furniture to Product format for cart
    const cartItem: any = {
      id: product._id,
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      category: product.category,
      image: productImages[0] || '/placeholder.jpg',
      rating: product.rating,
      reviews: product.reviews,
      discount: product.discount || 0,
      stock: product.stock,
      description: product.description,
    };
    for (let i = 0; i < quantity; i++) {
      cartStore.addItem(cartItem);
    }
    setShowAddedNotification(true);
    window.dispatchEvent(new Event('storage'));
    setTimeout(() => setShowAddedNotification(false), 2000);
  };

  const inStock = product.stock > 0;

  return (
    <div className="w-full">
      <OfferBar />
      <HeaderNew />
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-yellow-500">
              Home
            </Link>
            <span>/</span>
            <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-yellow-500">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Thumbnail Images - Left Side */}
            <div className="md:col-span-1">
              {productImages.length > 0 && (
                <div className="flex md:flex-col gap-3">
                  {productImages.filter(img => img).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(productImages.indexOf(image))}
                      className={`relative w-20 h-20 md:w-full md:h-24 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                        productImages[selectedImageIndex] === image
                          ? 'border-yellow-500 shadow-lg'
                          : 'border-gray-300 hover:border-yellow-400'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        sizes="100px"
                        className="object-contain bg-gray-50"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Main Image - Center */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg p-8 flex items-center justify-center sticky top-24">
                <button
                  onClick={() => setShowImageModal(true)}
                  className="relative w-full h-96 cursor-zoom-in hover:opacity-90 transition"
                >
                  {productImages[selectedImageIndex] ? (
                    <>
                      <Image
                        src={productImages[selectedImageIndex]}
                        alt={`${product.name} - View ${selectedImageIndex + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-contain"
                      />
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                        Click to zoom
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Product Details - Right Side */}
            <div className="md:col-span-2 bg-white rounded-lg p-8">
              {/* Product Name */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="mb-6">
                <StarRating rating={product.rating || 0} reviews={product.reviews || 0} />
                {product.reviews && (
                  <p className="text-sm text-gray-600 mt-2">
                    {product.reviews} verified customer reviews
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-end gap-4 mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-red-600 bg-red-50 px-3 py-1 rounded">
                    {product.discount || 0}% OFF
                  </span>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {inStock ? (
                  <p className="text-green-600 font-semibold text-lg">
                    ✓ In Stock
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold text-lg">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-6 py-2 font-semibold text-gray-900 border-l border-r border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="relative mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-lg text-lg transition"
                >
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>

                {showAddedNotification && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-green-500 text-white py-2 rounded-lg font-semibold text-center text-sm animate-pulse">
                    ✓ Added {quantity} item{quantity > 1 ? 's' : ''} to Cart
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700 mb-2">✓ 100% Original | ✓ Free Delivery | ✓ Easy Returns</p>
                <p className="text-sm text-gray-600">30-day money-back guarantee</p>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {product.description && (
            <div className="mt-12 bg-white rounded-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                {product.description}
              </p>

              {/* Product Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Key Features</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ Premium quality solid wood construction</li>
                    <li>✓ Durable and long-lasting</li>
                    <li>✓ Contemporary design</li>
                    <li>✓ Easy to maintain</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Warranty & Support</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>✓ 2-year warranty on manufacturing defects</li>
                    <li>✓ Free installation assistance</li>
                    <li>✓ 24/7 customer support</li>
                    <li>✓ Free returns within 30 days</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Image Zoom Modal */}
        {showImageModal && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition text-2xl z-10"
              >
                ✕
              </button>

              {/* Main Image in Modal */}
              <div className="relative w-full h-full max-h-screen">
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={`${product.name} - Full View`}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              </div>

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? productImages.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-14 h-14 flex items-center justify-center hover:bg-gray-300 active:bg-gray-400 transition text-3xl z-10 shadow-lg font-bold"
                    title="Previous image (← or click)"
                  >
                    ‹
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImageIndex((prev) =>
                        prev === productImages.length - 1 ? 0 : prev + 1
                      );
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white text-black rounded-full w-14 h-14 flex items-center justify-center hover:bg-gray-300 active:bg-gray-400 transition text-3xl z-10 shadow-lg font-bold"
                    title="Next image (→ or click)"
                  >
                    ›
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-10 text-lg font-semibold">
                    {selectedImageIndex + 1} / {productImages.length}
                  </div>

                  {/* Help Text */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg z-10 text-sm">
                    Use ← → arrows or click buttons to navigate
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
