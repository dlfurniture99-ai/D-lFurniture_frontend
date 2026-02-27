'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cartStore } from '@/lib/cartStore';
import { wishlistStore } from '@/lib/wishlistStore';
import { BiPencil, BiUser } from 'react-icons/bi';

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
    <header className="relative top-0 left-0 right-0 z-50 bg-black border-b border-neutral-800">
      {/* Top Section: Logo, Search, Icons */}
      <div className="px-4 md:px-8 py-2">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          {/* Logo Section */}
          <Link href="/" onClick={closeMenus} className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition">
            <div className="relative w-20 h-20">
              <Image
                src="/woodenspace.png"
                alt="D&L Logo"
                width={200}
                height={200}
                className="w-full h-full"
              />
            </div>
          </Link>

          {/* Search Bar - Hidden on Mobile */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md items-center bg-neutral-900 rounded-full px-4 py-2.5 border border-neutral-700 hover:border-neutral-600 transition"
          >
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-500"
            />
            <button type="submit" className="ml-2 text-gray-400 hover:text-yellow-500 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Mobile */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden p-2 hover:bg-neutral-900 rounded-lg transition text-gray-300 hover:text-yellow-500"
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 hover:bg-neutral-900 rounded-lg transition text-red-500 hover:text-red-400"
              title="Wishlist"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold text-center leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-neutral-900 rounded-lg transition text-yellow-500 hover:text-yellow-400"
              title="Cart"
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold text-center leading-none">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Profile */}
            <div className="relative" data-user-menu>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 hover:bg-neutral-900 rounded-lg transition text-blue-400 hover:text-blue-300"
                title="Account"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" />
                  <path d="M12 14c-6 0-8 3-8 3v6h16v-6s-2-3-8-3z" />
                </svg>
              </button>

              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl py-2 z-50" data-user-menu>
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-3 border-b border-neutral-700 bg-neutral-800">
                        <p className="text-xs text-gray-400">Welcome back!</p>
                        <p className="text-sm font-bold text-yellow-500">{userData?.name}</p>
                        <p className="text-xs text-gray-500">{userData?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-500 hover:bg-neutral-800 transition"
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-yellow-500 hover:bg-neutral-800 transition"
                      >
                        📦 My Orders
                      </Link>
                      <Link
                        href="/my-favorites"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-red-500 hover:bg-neutral-800 transition"
                      >
                        ❤️ Wishlist
                      </Link>
                      <Link
                        href="/bookings"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-blue-500 hover:bg-neutral-800 transition"
                      >
                        📋 My Bookings
                      </Link>
                      <Link
                        href="/delivery-status"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-green-500 hover:bg-neutral-800 transition"
                      >
                        🚚 Track Delivery
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-neutral-800 transition border-t border-neutral-700"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-x-2 px-4 py-2.5 text-sm font-bold text-yellow-500 hover:bg-neutral-800 transition border-b border-neutral-700"
                      >
                        <BiUser /> Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-x-2 px-4 py-2.5 text-sm font-bold text-blue-400 hover:bg-neutral-800 transition"
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
              className="md:hidden p-2 hover:bg-neutral-900 rounded-lg transition text-gray-300"
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
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800 px-4 py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-yellow-500 transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-yellow-600 text-black font-semibold rounded-lg hover:bg-yellow-700 transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="border-t border-neutral-800">
        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center px-8 py-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={cat.link || `/category/${cat.slug}`}
              onClick={closeMenus}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-yellow-500 border-b-2 border-transparent hover:border-yellow-500 transition whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-900 border-t border-neutral-800 p-4 space-y-2 max-h-96 overflow-y-auto">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={cat.link || `/category/${cat.slug}`}
                onClick={closeMenus}
                className="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-yellow-500 hover:bg-neutral-800 rounded transition"
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
