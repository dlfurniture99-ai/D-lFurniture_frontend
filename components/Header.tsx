'use client';

import { FiEdit2 as BiPencil, FiUser as BiUser, FiShoppingCart, FiHeart } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cartStore } from '@/lib/cartStore';
import { wishlistStore } from '@/lib/wishlistStore';


export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const categories = [
    { name: 'Sofas', slug: 'sofas' },
    { name: 'Beds', slug: 'beds' },
    { name: 'Dining', slug: 'dining' },
    { name: 'Storage', slug: 'storage' },
    { name: 'Office', slug: 'office' },
    { name: 'Outdoor', slug: 'outdoor' },
    { name: 'About', slug: 'about', link: '/about' },
    { name: 'Contact', slug: 'contact', link: '/contact' },
  ];

  useEffect(() => {
    const updateUserState = () => {
      const user = localStorage.getItem('user');
      console.log(user);
      if (user) {
        setIsLoggedIn(true);
        setUserData(JSON.parse(user));
      } else {
        setIsLoggedIn(false);
        setUserData(null);
      }
    };

    const updateCounts = () => {
      setCartCount(cartStore.getCount());
      setWishlistCount(wishlistStore.getCount());
    };

    // Initial load
    updateUserState();
    updateCounts();

    // Listen for storage changes and custom auth events
    const handleStorageChange = () => {
      updateUserState();
      updateCounts();
    };

    const handleAuthChange = () => {
      updateUserState();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange, true);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `/search?q=${encodeURIComponent(searchQuery)}`;
      console.log('Navigating to:', searchUrl);
      window.location.href = searchUrl;
    } else {
      console.log('Search query is empty');
    }
  };

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear server-side cookie
      const { userApi } = await import('@/app/apis/config');
      await userApi.post('auth/logout', {});
      
      // Clear user from localStorage
      localStorage.removeItem('user');
      
      setIsLoggedIn(false);
      setUserData(null);
      setUserMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/';
    }
  };

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setMobileSearchOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside user menu
      if (!target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <header className="relative top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      {/* Top Section: Logo, Search, Icons */}
      <div className="px-0 md:px-12 py-2">
        <div className="flex items-center justify-between gap-2 md:gap-8">
          {/* Logo Section */}
          <Link href="/" onClick={closeMenus} className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition">
            <div className="relative w-28 h-14">
              <Image
                src="/woodenspace.png"
                alt="Wooden Space Logo"
                width={200}
                height={200}
                priority
                className="w-full h-full object-contain"
              />
            </div>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg items-center bg-gray-800 rounded-lg px-4 py-2.5 border border-gray-700 hover:border-gray-600 transition"
          >
            <input
              type="text"
              placeholder="Search for furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-400 font-light"
            />
            <button type="submit" className="ml-2 text-gray-400 hover:text-white transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 md:gap-3">
            {/* Search Mobile */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2.5 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2.5 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
              title="Wishlist"
            >
              <FiHeart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium text-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2.5 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
              title="Shopping Cart"
            >
              <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-gray-900 text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium text-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2.5 hover:bg-gray-800 rounded-lg transition text-gray-400 hover:text-white"
                title="Account"
              >
                <BiUser className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 md:right-0 mt-2 w-56 md:w-60 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-50 max-h-96 overflow-y-auto" data-user-menu>
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-4 border-b border-gray-700 bg-gray-900">
                        <p className="text-xs text-gray-400 font-medium">Welcome</p>
                        <p className="text-sm font-semibold text-white mt-1">{userData?.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{userData?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition font-light"
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition font-light"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/my-favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition font-light"
                      >
                        Favorites
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition font-light"
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/delivery-status"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition font-light"
                      >
                        Track Delivery
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-gray-700 transition border-t border-gray-700"
                      >
                        🚪 Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-x-2 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition border-b border-gray-700"
                      >
                        <BiUser /> Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-x-2 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-700 transition"
                      >
                        <BiPencil /> Register
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 hover:bg-gray-800 rounded-lg transition text-gray-400"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search for furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-gray-500 transition font-light"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-yellow-500 text-gray-900 font-medium rounded-lg hover:bg-yellow-600 transition text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="bg-gray-800 border-t border-gray-700">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center px-12 py-0 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.link || `/category/${cat.slug}`}
              onClick={closeMenus}
              className="px-5 py-4 text-sm font-light text-gray-300 hover:text-white border-b-2 border-transparent hover:border-yellow-500 transition whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-700 p-4 space-y-2 max-h-96 overflow-y-auto">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.link || `/category/${cat.slug}`}
                onClick={closeMenus}
                className="block px-4 py-2.5 text-sm font-light text-gray-300 hover:text-white hover:bg-gray-800 rounded transition"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
