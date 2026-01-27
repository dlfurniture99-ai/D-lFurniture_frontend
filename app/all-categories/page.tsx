'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllCategories, Category } from '@/lib/api';

export default function AllCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getAllCategories();
        if (response.success && response.data?.categories) {
          setCategories(response.data.categories);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">All Categories</h1>
          <p className="text-gray-600 mt-2">Browse our complete collection of furniture</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category._id || category.id}
                href={`/category/${category.slug}`}
                className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-6xl">
                      {category.emoji || '🪑'}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
