'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import HeaderNew from '@/components/HeaderNew';
import OfferBar from '@/components/OfferBar';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import TrustBadges from '@/components/TrustBadges';
import { getAllFurniture, Furniture } from '@/lib/api';

const categoryNames: Record<string, string> = {
  sofas: 'Sofas',
  beds: 'Beds',
  dining: 'Dining',
  storage: 'Storage',
  office: 'Office',
  decor: 'Decor',
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [categoryProducts, setCategoryProducts] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<{
    priceRange: number;
    materials: string[];
    finishes: string[];
    seatingCapacity: string[];
    availability: string[];
    deliveryTime: string[];
  }>({
    priceRange: 100000,
    materials: [],
    finishes: [],
    seatingCapacity: [],
    availability: ['instock'],
    deliveryTime: [],
  });

  // Get category name from slug
  const getCategoryName = (slug: string) => {
    return categoryNames[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
  };

  const categoryName = getCategoryName(slug);

  // Fetch all furniture (not just current category) to allow filtering by other categories
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        // Fetch all furniture to allow sidebar category filtering
        // If no category filter selected, start with current category
        const response = await getAllFurniture(1, 100, undefined);
        if (response.success && response.data?.furniture) {
          // Filter to current category by default
          const filtered = response.data.furniture.filter(
            (product) => product.category?.toUpperCase() === categoryName.toUpperCase()
          );
          setCategoryProducts(filtered.length > 0 ? filtered : response.data.furniture);
        }
      } catch (error) {
        console.error('Failed to fetch category products:', error);
        setCategoryProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  const filteredProducts = categoryProducts.filter((product) => {
    if (product.price > filters.priceRange) return false;
    
    if (filters.materials.length > 0) {
      const productCategory = product.category?.toLowerCase() || '';
      const matchesCategory = filters.materials.some(
        (material) => productCategory.includes(material.toLowerCase())
      );
      if (!matchesCategory) return false;
    }
    
    if (filters.availability.length > 0) {
      const inStock = product.stock !== undefined ? product.stock > 0 : true;
      if (filters.availability.includes('instock') && !inStock) return false;
      if (!filters.availability.includes('instock') && inStock) return false;
    }
    return true;
  });

  return (
    <div className="w-full bg-gray-50">
      <OfferBar />
      <HeaderNew />

      {/* Category Header */}
      <section className="w-full bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            {categoryName}
          </h1>
          <p className="text-lg text-gray-600">
            Browse our collection of premium {categoryName.toLowerCase()}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            {loading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
          </p>
        </div>
      </section>

      {/* Main Content - Filters & Product Grid */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} />
          ) : (
            <div className="flex-1 flex items-center justify-center min-h-96">
              <div className="text-center">
                <p className="text-xl text-gray-600">
                  No products found with the selected filters.
                </p>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </div>
  );
}
