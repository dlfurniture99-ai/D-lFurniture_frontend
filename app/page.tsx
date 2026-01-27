'use client';

import { useState, useEffect } from 'react';
import OfferBar from '@/components/OfferBar';
import HeaderNew from '@/components/HeaderNew';
import HeroBanner from '@/components/HeroBanner';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import ShopByCategory from '@/components/ShopByCategory';
import TrustBadges from '@/components/TrustBadges';
import Footer from '@/components/Footer';
import FeaturedCategories from '@/components/FeaturedCategories';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import SEOFooterContent from '@/components/SEOFooterContent';
import { getAllFurniture, Furniture } from '@/lib/api';

export default function Home() {
  const [allFurniture, setAllFurniture] = useState<Furniture[]>([]);
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

  // Fetch furniture from backend
  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        setLoading(true);
        const response = await getAllFurniture(1, 100); // Fetch first 100 items
        if (response.success && response.data?.furniture) {
          setAllFurniture(response.data.furniture);
        }
      } catch (error) {
        console.error('Failed to fetch furniture:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  const filteredProducts = allFurniture.filter((product) => {
    // Price filter
    if (product.price > filters.priceRange) return false;

    // Category filter (using materials field for categories)
    if (filters.materials.length > 0) {
      const hasMatch = filters.materials.some(
        (material) => {
          // Check if it's a category match
          if (material === 'sofas' && product.category === 'Sofas') return true;
          if (material === 'beds' && product.category === 'Beds') return true;
          if (material === 'dining' && product.category === 'Dining') return true;
          if (material === 'storage' && product.category === 'Storage') return true;
          if (material === 'office' && product.category === 'Office') return true;
          if (material === 'decor' && product.category === 'Decor') return true;
          return false;
        }
      );
      if (!hasMatch) return false;
    }

    // Availability filter
    if (filters.availability.length > 0) {
      const inStock = product.stock !== undefined ? product.stock > 0 : true;
      if (
        filters.availability.includes('instock') &&
        !inStock
      ) {
        return false;
      }
      if (
        !filters.availability.includes('instock') &&
        inStock
      ) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="w-full bg-white">
      {/* Sticky Offer Bar */}
      <OfferBar />

      {/* Header with Navigation */}
      <HeaderNew />

      {/* Hero Banner Section - Add top padding for fixed header */}
      <div className="pt-20">
        <HeroBanner />
      </div>

      {/* Main Content - Filters & Product Grid */}
      <section id="products-section" className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading furniture...</p>
              </div>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </section>

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials Section */}
      <Testimonials />

      {/* SEO Footer Content */}
      <SEOFooterContent />

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Footer */}
      <Footer />
    </div>
  );
}
