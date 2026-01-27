'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllCategories, Category } from '@/lib/api';

interface CategoryWithImage extends Category {
  unsplashImage?: string;
  productCount?: number;
}

export default function ShopByCategory() {
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Map category names to Unsplash image URLs
  const getCategoryImage = (categoryName: string): string => {
    const imageMap: Record<string, string> = {
      sofas: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80',
      beds: 'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&q=80',
      dining: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80',
      storage: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
      office: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800&q=80',
      study: 'https://images.unsplash.com/photo-1507842755769-643c0ad41c7e?w=800&q=80',
      outdoor: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      decor: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=80',
    };

    return imageMap[categoryName.toLowerCase()] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80';
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching categories...');
        const response = await getAllCategories();
        console.log('Categories response:', response);
        
        if (response.success && response.data?.categories) {
          // Add Unsplash images to each category
          const categoriesWithImages: CategoryWithImage[] = response.data.categories.map((cat: any) => ({
            ...cat,
            unsplashImage: getCategoryImage(cat.name),
          }));
          console.log('Categories with images and counts:', categoriesWithImages);
          categoriesWithImages.forEach((cat) => {
            console.log(`${cat.name}: ${cat.productCount} products`);
          });
          setCategories(categoriesWithImages);
        } else {
          console.error('No categories in response:', response);
          setError('Failed to load categories - no data returned');
          setCategories([]);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError(`Unable to load categories: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Browse our curated collections
            </p>
          </div>
          <Link
            href="/all-categories"
            className="hidden md:flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
          >
            View All <span>→</span>
          </Link>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 font-semibold mb-2">{error}</p>
              <p className="text-gray-500 text-sm">Please try again later</p>
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600">No categories available</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const categoryId = category._id || category.id;
              // Use unsplash image if available, otherwise use category image, fallback to unsplash random
              const imageUrl = category.unsplashImage || category.image || `https://source.unsplash.com/random/400x300/?furniture`;
              
              return (
                <Link
                  key={categoryId}
                  href={`/category/${category.slug}`}
                  className="group relative overflow-hidden rounded-lg h-64 cursor-pointer shadow-lg hover:shadow-xl transition-shadow"
                >
                  {/* Category Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-center text-white z-10">
                    <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 group-hover:text-orange-400 transition">
                      {category.name}
                    </h3>
                    {category.productCount !== undefined && category.productCount > 0 && (
                      <div className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold text-lg">
                        {category.productCount} {category.productCount === 1 ? 'Product' : 'Products'}
                      </div>
                    )}
                    {category.productCount === 0 && (
                      <div className="bg-gray-500/50 text-white px-6 py-3 rounded-full font-semibold text-sm">
                        No Products Yet
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* View All Button - Mobile */}
        <div className="md:hidden mt-8 text-center">
          <Link
            href="/all-categories"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold transition"
          >
            View All <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
