'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import HeaderNew from '@/components/HeaderNew';
import Footer from '@/components/Footer';
import { getAllFurniture, Furniture } from '@/lib/api';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [filteredProducts, setFilteredProducts] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchFurniture = async () => {
      try {
        setLoading(true);
        if (q.trim()) {
          // Fetch furniture with search parameter
          const response = await getAllFurniture(1, 100, undefined, q);
          if (response.success && response.data?.furniture) {
            setFilteredProducts(response.data.furniture);
          } else {
            setFilteredProducts([]);
          }
        } else {
          // Fetch all furniture if no search query
          const response = await getAllFurniture(1, 100);
          if (response.success && response.data?.furniture) {
            setFilteredProducts(response.data.furniture);
          } else {
            setFilteredProducts([]);
          }
        }
      } catch (error) {
        console.error('Failed to search furniture:', error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    searchFurniture();
  }, [q]);

  return (
    <>
      <HeaderNew />
      <main className="min-h-screen bg-gray-50 pt-20">
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
            {q ? `Search Results for "${q}"` : 'All Products'}
          </h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mb-4"></div>
              <p className="text-gray-600">Searching furniture...</p>
            </div>
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
              We couldn't find any products matching "{q}"
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
            {filteredProducts.map((product) => {
              const productKey = ('id' in product ? product.id : product._id) || Math.random();
              return <ProductCard key={String(productKey)} product={product} />;
            })}
          </div>
        )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
