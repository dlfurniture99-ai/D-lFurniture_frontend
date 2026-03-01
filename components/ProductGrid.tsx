'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/mockData';
import ProductCard from './ProductCard';
import './animations.css';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('relevance');

  const sortedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => {
          const priceA = a.price || (typeof a.productPrice === 'string' ? parseInt(a.productPrice) : a.productPrice) || 0;
          const priceB = b.price || (typeof b.productPrice === 'string' ? parseInt(b.productPrice) : b.productPrice) || 0;
          return priceA - priceB;
        });
      case 'price-high-low':
        return sorted.sort((a, b) => {
          const priceA = a.price || (typeof a.productPrice === 'string' ? parseInt(a.productPrice) : a.productPrice) || 0;
          const priceB = b.price || (typeof b.productPrice === 'string' ? parseInt(b.productPrice) : b.productPrice) || 0;
          return priceB - priceA;
        });
      case 'newest':
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
      case 'best-sellers':
        return sorted.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
      default:
        return sorted;
    }
  }, [products, sortBy]);

  return (
    <div className="flex-1">
      {/* Grid Title & Sort */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          Products ({products.length})
        </h3>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 cursor-pointer"
        >
          <option value="relevance">Sort by: Relevance</option>
          <option value="price-low-high">Price: Low to High</option>
          <option value="price-high-low">Price: High to Low</option>
          <option value="newest">Newest</option>
          <option value="best-sellers">Best Sellers</option>
        </select>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.map((product, index) => (
          <div key={product._id || product.id} style={{ animationDelay: `${index * 0.1}s` }}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
