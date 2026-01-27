'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { useCart } from '@/lib/useCart';
import { useWishlist } from '@/lib/useWishlist';
import { getAllFurniture, Furniture } from '@/lib/api';
import { IoLogOut, IoPerson, IoSearch, IoMenu, IoClose, IoCart, IoHeart } from 'react-icons/io5';

export default function HeaderNew() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Furniture[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const { user: authUser, isAuthenticated: isAuth, logout } = useAuth();

  const isCustomer = isAuth && authUser?.role !== 'admin';
  const isAuthenticated = isCustomer;

  const { getCount } = useCart();
  const { wishlist } = useWishlist();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoadingSuggestions(true);
        const response = await getAllFurniture(1, 10, undefined, searchQuery);
        if (response.success && response.data?.furniture) {
          setSuggestions(response.data.furniture);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product: Furniture) => {
    const productId = 'id' in product ? product.id : product._id;
    setSearchQuery('');
    setShowSuggestions(false);
    router.push(`/product/${productId}`);
  };

  const categories = [
    {
      name: 'Sofas',
      subcategories: ['All Sofas', 'Fabric Sofas', 'Wooden Sofas', '3 Seater', '2 Seater', '1 Seater']
    },
    {
      name: 'Beds',
      subcategories: ['All Beds', 'Wooden Beds', 'Upholstered Beds', 'Storage Beds', 'Sofa Cum Beds']
    },
    {
      name: 'Dining',
      subcategories: ['Dining Sets', 'Dining Chairs', 'Dining Tables']
    },
    {
      name: 'Storage',
      subcategories: ['Cabinets', 'Wardrobes', 'Shelves', 'Drawers']
    },
    {
      name: 'Office',
      subcategories: ['Office Tables', 'Office Chairs', 'Desks', 'Shelving']
    },
    {
      name: 'Decor',
      subcategories: ['Decorative Items', 'Wall Art', 'Lighting', 'Rugs']
    }
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-100 py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs text-gray-600">
          <div className="flex gap-6">
            <span>📞 +91-9314444747</span>
            <span>🏪 Become a Franchisee</span>
          </div>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-orange-600">Track Order</Link>
            <Link href="#" className="hover:text-orange-600">Help Center</Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 border-b border-orange-100">
        <div className="flex items-center justify-between gap-6 mb-3">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <div className="text-2xl font-bold text-gray-900 leading-tight">
              D&L <span className="text-orange-600">Furniture</span>
            </div>
            <div className="text-xs text-gray-600 font-medium">Bonded with love</div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="flex-1 relative" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                placeholder="Search Products, Color & More..."
                className="w-full px-5 py-4 bg-gray-100 rounded-l-lg text-black focus:outline-none focus:ring-2 focus:ring-orange-500 text-base"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-full px-6 bg-orange-600 text-white rounded-r-lg hover:bg-orange-700 transition flex items-center justify-center"
              >
                <IoSearch size={22} />
              </button>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                  {loadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((product) => {
                      const productId = 'id' in product ? product.id : product._id;
                      return (
                        <button
                          key={String(productId)}
                          onClick={() => handleSuggestionClick(product)}
                          className="w-full text-left px-5 py-3 hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition group"
                        >
                          <p className="text-gray-800 text-sm font-medium group-hover:text-orange-600">
                            {(('title' in product && product.title) || product.name) as string}
                          </p>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No products found
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-8">
            {/* Stores */}
            <button className="hidden md:flex flex-col items-center text-gray-700 hover:text-orange-600 transition">
              <span className="text-2xl mb-1">🏪</span>
              <span className="text-sm font-medium">Stores</span>
            </button>

            {/* Wishlist */}
            <Link href="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition relative">
              <IoHeart size={28} />
              <span className="text-sm font-medium">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link href="/cart" className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition relative">
              <IoCart size={28} />
              <span className="text-sm font-medium">Cart</span>
              {getCount() > 0 && (
                <span className="absolute -top-3 -right-3 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {getCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex flex-col items-center text-gray-700 hover:text-orange-600 transition"
                >
                  <IoPerson size={28} />
                  <span className="text-sm font-medium">Profile</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-900">
                      {authUser?.email}
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      My Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      My Orders
                    </Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm">
                      My Wishlist
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm flex items-center gap-2"
                    >
                      <IoLogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/auth/login"
                  className="hidden md:block px-5 py-3 text-base text-gray-700 hover:text-orange-600 transition font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg text-base font-semibold hover:bg-orange-700 transition shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {mobileMenuOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1 px-3 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
            />
            <button type="submit" className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <IoSearch size={20} />
            </button>
          </div>
        </form>
      </div>

      {/* Category Navigation */}
      <div className="border-t border-gray-100 hidden md:block bg-white">
        <div className="max-w-7xl mx-auto px-4 py-0 flex gap-24 justify-center">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="relative group"
              onMouseEnter={() => setActiveCategory(cat.name)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <button
                className={`text-base font-semibold py-4 flex items-center gap-2 transition-colors ${
                  activeCategory === cat.name
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-700 hover:text-orange-600 border-b-2 border-transparent'
                }`}
              >
                {cat.name}
                <span className="text-xs">▼</span>
              </button>

              {/* Dropdown Menu - Multi-column */}
              {activeCategory === cat.name && (
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full bg-white border border-gray-200 rounded-lg shadow-2xl py-6 px-8 w-96 z-50 grid grid-cols-3 gap-6">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      href={`/?category=${cat.name.toLowerCase()}&subcategory=${sub.toLowerCase()}`}
                      className="text-gray-700 text-sm hover:text-orange-600 hover:font-semibold transition whitespace-nowrap"
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Category Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 py-4 px-4 bg-gray-50">
          <div className="space-y-3">
            {categories.map((cat) => (
              <div key={cat.name} className="border-b border-gray-200 pb-3">
                <Link
                  href={`/?category=${cat.name.toLowerCase()}`}
                  className="block text-gray-700 text-sm font-semibold hover:text-orange-600 transition py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
                <div className="ml-4 space-y-1">
                  {cat.subcategories.map((sub) => (
                    <Link
                      key={sub}
                      href={`/?category=${cat.name.toLowerCase()}&subcategory=${sub.toLowerCase()}`}
                      className="block text-gray-600 text-xs hover:text-orange-600 transition py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
