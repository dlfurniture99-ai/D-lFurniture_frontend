'use client';

import { useState, useEffect } from 'react';
import './animations.css';

interface HeroBannerProps {
  onCategorySelect?: (category: string) => void;
}

const CATEGORIES = [
  'Sofas & Couches',
  'Chairs & Stools',
  'Beds & Mattresses',
  'Desks & Tables',
  'Storage & Cabinets',
  'Shelving & Units',
  'Outdoor Furniture',
  'Bedroom Furniture',
  'Dining Furniture',
  'Office Furniture'
];

export default function HeroBanner({ onCategorySelect }: HeroBannerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories from backend or use default categories
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://dandlfurnitech-services.vercel.app/api'}/products`);
        const data = await response.json();
        
        // Extract unique categories from products
        if (data.products && Array.isArray(data.products)) {
          const uniqueCategories = [...new Set(data.products.map((p: any) => p.category))];
          setCategories(uniqueCategories.filter(Boolean) as string[]);
        } else {
          setCategories(CATEGORIES);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    if (onCategorySelect) {
      onCategorySelect(category);
    }
    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExploreClick = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="w-full h-screen relative flex flex-col items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('/hero.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full h-full px-4 flex flex-col items-center justify-center">
        <div className="max-w-6xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg animate-slideInDown">
              Welcome to The Wooden Space
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-50 mb-6 font-semibold drop-shadow-md animate-slideInUp" style={{ animationDelay: '0.2s' }}>
              Premium Solid Wood Furniture for Your Lifestyle
            </p>
          </div>

          {/* Categories Slider */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap">
              {loading ? (
                <p className="text-white text-xs">Loading categories...</p>
              ) : categories.length > 0 ? (
                categories.map((category, index) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium transition duration-300 whitespace-nowrap animate-fadeInScale shadow-md ${
                      selectedCategory === category
                        ? 'bg-yellow-600 text-white scale-105'
                        : 'bg-white/90 text-gray-900 hover:bg-white hover:shadow-lg'
                    }`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {category}
                  </button>
                ))
              ) : null}
            </div>
          </div>

          {/* Explore Button */}
          <div className="flex justify-center">
            <button
              onClick={handleExploreClick}
              className="px-6 py-2 md:py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold text-sm md:text-base rounded-lg shadow-lg transition duration-300 transform hover:scale-105 animate-bounce"
              style={{ animationDelay: '0.6s' }}
            >
              Explore Now
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
