'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import OfferBar from '@/components/OfferBar';
import Footer from '@/components/Footer';
import { cartStore, CartItem } from '@/lib/cartStore';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // Load cart data from localStorage on mount
    const items = cartStore.getCart();
    setCartItems(items);
    setTotal(cartStore.getTotal());
    
    // Check if user is logged in
    const user = localStorage.getItem('user');
    setIsUserLoggedIn(!!user);
    
    setIsLoading(false);

    // Update when storage changes
    const handleStorageChange = () => {
      const updatedItems = cartStore.getCart();
      setCartItems(updatedItems);
      setTotal(cartStore.getTotal());
      
      // Also check login status
      const user = localStorage.getItem('user');
      setIsUserLoggedIn(!!user);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRemoveItem = (productId: number) => {
    cartStore.removeItem(productId);
    const items = cartStore.getCart();
    setCartItems(items);
    setTotal(cartStore.getTotal());
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    cartStore.updateQuantity(productId, quantity);
    const items = cartStore.getCart();
    setCartItems(items);
    setTotal(cartStore.getTotal());
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <OfferBar />
        <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <div className="text-gray-500">Loading cart...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-yellow-500">
            Home
          </Link>
          <span>/</span>
          <span>Shopping Cart</span>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="bg-white rounded-lg p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Shopping Cart Is Empty!
            </h1>
            <p className="text-gray-600 mb-8">
              Let us help you explore your favourite furniture category!
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Shopping Cart ({cartItems.length} items)
              </h1>

              <div className="bg-white rounded-lg overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-gray-200 p-6 flex gap-6 hover:bg-gray-50 transition"
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      {item.productImage?.[0] && (
                        <Image
                          src={item.productImage[0]}
                          alt={item.name || item.productName || ''}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2">
                        {item.name || item.productName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Product ID: {item.id}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900">
                          ₹{(item.price || 0).toLocaleString()}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id || 0)}
                          className="text-red-500 text-sm hover:text-red-700 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex flex-col items-end justify-center gap-2">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id || 0, item.quantity - 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="px-4 py-1 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(item.id || 0, item.quantity + 1)
                          }
                          className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right font-bold text-gray-900">
                        ₹{((item.price || 0) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <Link
                href="/"
                className="inline-block mt-6 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Discount</span>
                    <span className="font-semibold text-green-600">-₹0</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-yellow-500">
                    ₹{total.toLocaleString()}
                  </span>
                </div>

                {isUserLoggedIn ? (
                  <Link
                    href="/checkout"
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition mb-3 inline-block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <Link
                    href="/login?redirect=/checkout"
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg font-bold hover:bg-yellow-700 transition mb-3 inline-block text-center"
                  >
                    Login to Checkout
                  </Link>
                )}

                <div className="text-center">
                  <p className="text-xs text-gray-600 mb-3">
                    ✓ 100% Original | ✓ Free Delivery | ✓ Easy Returns
                  </p>
                  <Link
                    href="/"
                    className="text-sm text-yellow-500 hover:underline font-semibold"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Exploration Section */}
        <section className="mt-16 py-12 bg-white rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Let us Help you Explore your Favourite Furniture Category!
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {/* Sofas */}
             <Link href="/category/sofas" className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition">
                 <Image
                   src="/sofa.png"
                   alt="Sofas"
                   fill
                   sizes="128px"
                   className="object-cover group-hover:scale-110 transition-transform"
                 />
               </div>
               <p className="font-semibold text-gray-900 group-hover:text-yellow-500 transition">
                 Sofa Sets
               </p>
             </Link>

             {/* Beds */}
             <Link href="/category/beds" className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition">
                 <Image
                   src="/bed.png"
                   alt="Beds"
                   fill
                   sizes="128px"
                   className="object-cover group-hover:scale-110 transition-transform"
                 />
               </div>
               <p className="font-semibold text-gray-900 group-hover:text-yellow-500 transition">
                 Beds
               </p>
             </Link>

             {/* Dining */}
             <Link href="/category/dining-sets" className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition">
                 <Image
                   src="/dinning.png"
                   alt="Dining"
                   fill
                   sizes="128px"
                   className="object-cover group-hover:scale-110 transition-transform"
                 />
               </div>
               <p className="font-semibold text-gray-900 group-hover:text-yellow-500 transition">
                 Dining Table Sets
               </p>
             </Link>

             {/* Storage */}
             <Link href="/category/storage" className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition">
                 <Image
                   src="/storage.jpg"
                   alt="Storage"
                   fill
                   sizes="128px"
                   className="object-cover group-hover:scale-110 transition-transform"
                 />
               </div>
               <p className="font-semibold text-gray-900 group-hover:text-yellow-500 transition">
                 Storage & Cabinets
               </p>
             </Link>

             {/* Office */}
             <Link href="/category/office" className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition">
                 <Image
                   src="/office.webp"
                   alt="Office"
                   fill
                   sizes="128px"
                   className="object-cover group-hover:scale-110 transition-transform"
                 />
               </div>
               <p className="font-semibold text-gray-900 group-hover:text-yellow-500 transition">
                 Office Furniture
               </p>
             </Link>

             {/* Decor */}
             <Link href="/category/decor" className="text-center group">
               <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition">
                 <Image
                   src="/decor.jpg"
                   alt="Decor"
                   fill
                   sizes="128px"
                   className="object-cover group-hover:scale-110 transition-transform"
                 />
               </div>
               <p className="font-semibold text-gray-900 group-hover:text-yellow-500 transition">
                 Decor & Furnishing
               </p>
             </Link>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
