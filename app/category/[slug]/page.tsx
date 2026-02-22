'use client';

import { useState, useEffect, use } from 'react';
import FilterSidebar from '@/components/FilterSidebar';
import ProductGrid from '@/components/ProductGrid';
import TrustBadges from '@/components/TrustBadges';
import { Product } from '@/lib/mockData';
import { getAllProducts } from '@/app/apis/products';

const categoryNames: Record<string, string> = {
  sofas: 'Sofas',
  beds: 'Beds',
  'dining-sets': 'Dining Sets',
  storage: 'Storage',
  office: 'Office Furniture',
  decor: 'Decor & Furnishing',
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        if (res?.success && res?.data) {
          setAllProducts(res.data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categoryProducts = allProducts.filter(
    (product: Product) => product.productType === slug
  );

  const filteredProducts = categoryProducts.filter((product: Product) => {
    const productPrice = typeof product.productPrice === 'string' 
      ? parseInt(product.productPrice) 
      : product.productPrice || 0;

    if (productPrice > filters.priceRange) return false;
    if (filters.materials.length > 0) {
      const hasMatch = filters.materials.some(
        (material) => {
          const name = (product.name || product.productName || '').toLowerCase();
          return name.includes(material.toLowerCase());
        }
      );
      if (!hasMatch) return false;
    }
    if (filters.availability.length > 0) {
      const inStock = product.stock !== undefined ? product.stock > 0 : true;
      if (filters.availability.includes('instock') && !inStock) return false;
      if (!filters.availability.includes('instock') && inStock) return false;
    }
    return true;
  });

  const categoryName = categoryNames[slug] || 'Products';

  if (loading) {
    return (
      <div className="w-full bg-gray-50">
        <div className="min-h-screen flex items-center justify-center pt-20">
          <div className="text-lg text-gray-600">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
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
            Showing {filteredProducts.length} products
          </p>
        </div>
      </section>

      {/* Main Content - Filters & Product Grid */}
      <section className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar filters={filters} setFilters={setFilters} />

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
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
    </div>
  );
}
