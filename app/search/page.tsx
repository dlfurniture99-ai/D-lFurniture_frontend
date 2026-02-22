'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/lib/mockData';
import { getAllProducts } from '@/app/apis/products';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const query = q?.toLowerCase() || '';
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndFilter = async () => {
      try {
        const res = await getAllProducts();
        if (res?.success && res?.data) {
          const filtered = query
            ? res.data.filter((product: Product) => {
                const name = (product.name || product.productName || '').toLowerCase();
                const description = (product.description || product.productDescription || '').toLowerCase();
                const type = (product.productType || '').toLowerCase();
                
                return (
                  name.includes(query) ||
                  description.includes(query) ||
                  type.includes(query)
                );
              })
            : res.data;
          
          setFilteredProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilter();
  }, [query]);

  return (
    <div className="w-full bg-gray-50">
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-yellow-500">
              Home
            </Link>
            <span>/</span>
            <span>Search Results</span>
          </div>

          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {query ? `Search Results for "${q}"` : 'All Products'}
            </h1>
            {!loading && (
              <p className="text-gray-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
            )}
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Searching products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            /* No Results */
            <div className="bg-white rounded-lg p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h2>
              <p className="text-gray-600 mb-6">
                {query ? `We couldn't find any products matching "${q}"` : 'No products available'}
              </p>
              <Link
                href="/"
                className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            /* Product Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
  }
