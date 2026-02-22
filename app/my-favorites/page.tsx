'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHeart, FaArrowLeft, FaStar, FaShoppingCart, FaTrash } from 'react-icons/fa';

interface FavoriteProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  category: string;
}

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Token is automatically sent via HTTP-only cookie
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
        credentials: 'include', // Include cookies
      });
      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      // Token is automatically sent via HTTP-only cookie
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/remove/${productId}`,
        {
          method: 'POST',
          credentials: 'include', // Include cookies
        }
      );
      const data = await response.json();
      if (data.success) {
        setFavorites(favorites.filter(f => f._id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading favorites...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-28 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="p-2 hover:bg-gray-200 rounded-lg transition">
            <FaArrowLeft className="w-5 h-5 text-yellow-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">My Favorites</h1>
            <p className="text-gray-600 text-sm mt-1">{favorites.length} items saved</p>
          </div>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <FaHeart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">No favorites yet</p>
            <p className="text-gray-500 text-sm mb-6">Start adding products to your favorites!</p>
            <Link href="/products" className="inline-block px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map(product => (
              <div key={product._id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition group">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-white/5 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500/10 to-purple-500/10 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                  
                  {/* Remove from Favorites */}
                  <button
                    onClick={() => removeFavorite(product._id)}
                    className="absolute top-3 right-3 p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition"
                    title="Remove from favorites"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-yellow-400 text-xs font-semibold mb-1">{product.category}</p>
                  <h3 className="text-white font-bold mb-2 line-clamp-2">{product.name}</h3>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray-300 text-sm">{product.rating.toFixed(1)}</span>
                  </div>

                  {/* Price & Stock */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-yellow-400 font-bold text-lg">₹{product.price}</span>
                    <span className={`text-xs font-semibold ${
                      product.stock > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/products/${product._id}`}
                      className="flex-1 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition text-center"
                    >
                      View
                    </Link>
                    <button
                      disabled={product.stock === 0}
                      className="flex-1 py-2 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
