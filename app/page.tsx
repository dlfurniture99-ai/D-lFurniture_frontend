'use client';

import { useEffect, useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import TrustBadges from '@/components/TrustBadges';
import FeaturedCategories from '@/components/FeaturedCategories';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import SEOFooterContent from '@/components/SEOFooterContent';
import { getAllProducts } from './apis/products';
import { Product } from '@/lib/mockData';

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        if (res?.success && res?.data) {
          setAllProducts(res.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    fetchProducts()
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // Clear other filters and set materials filter to selected category
    setFilters((prev) => ({
      ...prev,
      materials: [category],
    }));
  };

  const filteredProducts = allProducts.filter((product: any) => {
    // Parse price from productPrice string
    const productPrice = typeof product.productPrice === 'string' 
      ? parseInt(product.productPrice) 
      : product.productPrice || 0;
    const productCategory = product.category || product.productType || '';

    // Price filter
    if (productPrice > filters.priceRange) return false;

    // Category filter - if banner category selected, filter by it
    if (selectedCategory && selectedCategory !== '') {
      if (productCategory !== selectedCategory) return false;
    }
    // Otherwise use materials filter
    else if (filters.materials.length > 0) {
      if (!filters.materials.includes(productCategory)) return false;
    }

    // Availability filter - all products from API are in stock
    if (filters.availability.includes('instock')) {
      return true;
    }

    return true;
  });

  return (
    <div className="w-full bg-gray-50">

      {/* Hero Banner Section - Add top padding for fixed header */}
      <div>
        <HeroBanner onCategorySelect={handleCategorySelect} />
      </div>

      {/* Main Content - Filters & Product Grid */}
      <section id="products-section" className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </section>

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
    </div>
  );
}
