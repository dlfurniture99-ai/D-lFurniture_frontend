'use client';

import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlist } from '@/lib/useWishlist';
import { useCart } from '@/lib/useCart';

export default function WishlistPage() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <span className="text-gray-500">{wishlist.length} items</span>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.filter((p: any) => p).map((product: any) => {
              const image = product.images?.[0] || product.image;
              return (
              <div key={product._id || product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group relative">
                <Link href={`/product/${product._id || product.id}`}>
                  <div className="h-64 bg-gray-100 relative">
                    {image ? (
                      <Image 
                        src={image} 
                        alt={product.name} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <span className="text-sm">No Image</span>
                        </div>
                    )}
                  </div>
                </Link>
                
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(product._id || product.id);
                    }}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition z-10 opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>

                <div className="p-4">
                  <Link href={`/product/${product._id || product.id}`}>
                    <h3 className="font-medium text-gray-900 line-clamp-1 mb-2 hover:text-yellow-600 transition">{product.name}</h3>
                  </Link>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-yellow-600 font-bold text-lg">₹{product.price?.toLocaleString()}</p>
                    <button 
                        onClick={() => addToCart(product)}
                        className="px-4 py-2 bg-yellow-600 text-white text-sm font-semibold rounded-lg hover:bg-yellow-700 transition"
                    >
                        Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )})}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any items to your wishlist yet. Explore our collection and save your favorites!</p>
            <Link href="/" className="inline-block px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold shadow-lg shadow-yellow-600/20">
              Start Shopping
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}