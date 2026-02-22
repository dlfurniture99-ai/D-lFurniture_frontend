'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaShoppingCart, FaFilter } from 'react-icons/fa';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  stock: number;
  category: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const categories = ['Chairs', 'Tables', 'Shelves', 'Beds', 'Sofas', 'Desks', 'Storage'];

  useEffect(() => {
    fetchProducts();
  }, [category, search, page]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&limit=12`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${search}`;

      const response = await fetch(url);
       const data = await response.json();
       setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 to-slate-900 pt-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Our Products</h1>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 bg-white/60 border border-white/20 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-yellow-500"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-white/60 border border-white/20 rounded-lg text-gray-800 focus:outline-none focus:border-yellow-500"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-white text-xl">Loading...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <Link key={product._id} href={`/products/${product._id}`}>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden hover:border-yellow-500/50 transition cursor-pointer group">
                  <div className="relative h-48 overflow-hidden bg-white/5">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-yellow-500/10 to-purple-500/10 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-bold mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-yellow-400 font-bold text-lg">₹{product.price}</span>
                      <div className="flex items-center gap-1">
                        <FaStar className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300 text-sm">{product.rating.toFixed(1)}</span>
                      </div>
                    </div>

                    {product.stock > 0 ? (
                      <button className="w-full py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg text-sm font-semibold hover:from-yellow-600 hover:to-yellow-700 transition flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-yellow-500/30">
                        <FaShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </button>
                    ) : (
                      <button disabled className="w-full py-2 bg-gray-600/50 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">
                        Out of Stock
                      </button>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
