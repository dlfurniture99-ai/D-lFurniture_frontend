'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MegaMenu from './MegaMenu';
import { useAuth } from '@/lib/useAuth';
import { useCart } from '@/lib/useCart';
import { useWishlist } from '@/lib/useWishlist';
import { IoLogOut, IoPerson } from 'react-icons/io5';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { getCount } = useCart();
  const { wishlist } = useWishlist();

  // Close menu when clicking outside and update counts
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Close menu and navigate to search page
      closeMegaMenu();
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const closeMegaMenu = () => {
    setActiveMenu(null);
    setMobileMenuOpen(false);
  };

  const categories = [
    {
      name: 'Sofas',
      slug: 'sofas',
      image: '/sofa.png',
      subCategories: [
        {
          name: 'Sofa',
          items: [
            'All Sofas',
            'Fabric Sofas',
            'Wooden Sofas',
            '3 Seater Sofas',
            '2 Seater Sofas',
            '1 Seater Sofas',
            '3+1+1 Sofa Sets',
            'Sofa Cum Beds',
            'L Shaped Sofas',
            'Chaise Loungers',
            'Outdoor Sofas',
            'Diwans',
          ],
        },
        {
          name: 'Sofa Cum Bed',
          items: [
            'All Sofa Cum Beds',
            'Wooden Sofa Cum Beds',
            'Fabric Sofa Cum Beds',
          ],
        },
        {
          name: 'Recliners',
          items: [
            'All Recliners',
            '1 Seater Recliners',
            '2 Seater Recliners',
            '3 Seater Recliners',
          ],
        },
      ],
    },
    {
      name: 'Beds',
      slug: 'beds',
      image: '/bed.png',
      subCategories: [
        {
          name: 'Beds',
          items: [
            'All Beds',
            'Single Beds',
            'Double Beds',
            'Queen Beds',
            'King Beds',
            'Poster Beds',
            'Storage Beds',
          ],
        },
        {
          name: 'Bed Frames',
          items: ['Wooden Frames', 'Metal Frames', 'Upholstered Frames'],
        },
        {
          name: 'Mattresses',
          items: ['Foam Mattresses', 'Spring Mattresses', 'Memory Foam'],
        },
      ],
    },
    {
      name: 'Dining',
      slug: 'dining',
      image: '/dinning.png',
      subCategories: [
        {
          name: 'Dining Sets',
          items: [
            'All Dining Sets',
            '4 Seater Sets',
            '6 Seater Sets',
            '8 Seater Sets',
          ],
        },
        {
          name: 'Dining Tables',
          items: [
            'Wooden Tables',
            'Glass Tables',
            'Expandable Tables',
          ],
        },
        {
          name: 'Dining Chairs',
          items: [
            'Wooden Chairs',
            'Upholstered Chairs',
            'Accent Chairs',
          ],
        },
      ],
    },
    {
      name: 'Storage',
      slug: 'storage',
      image: '/storage.jpg',
      subCategories: [
        {
          name: 'Cabinets',
          items: [
            'All Cabinets',
            'Kitchen Cabinets',
            'Bedroom Cabinets',
            'Living Room Cabinets',
          ],
        },
        {
          name: 'Shelves',
          items: ['Wall Shelves', 'Bookshelf', 'Floating Shelves'],
        },
        {
          name: 'Wardrobes',
          items: ['Wooden Wardrobes', 'Sliding Wardrobes', 'Corner Wardrobes'],
        },
      ],
    },
    {
      name: 'Office',
      slug: 'office',
      image: '/office.webp',
      subCategories: [
        {
          name: 'Desks',
          items: [
            'All Desks',
            'Computer Desks',
            'Study Desks',
            'Adjustable Desks',
          ],
        },
        {
          name: 'Office Chairs',
          items: ['Executive Chairs', 'Task Chairs', 'Gaming Chairs'],
        },
        {
          name: 'Storage',
          items: ['Filing Cabinets', 'Office Shelves', 'Pedestals'],
        },
      ],
    },
    {
      name: 'Decor',
      slug: 'decor',
      image: '/decor.jpg',
      subCategories: [
        {
          name: 'Wall Decor',
          items: ['Wall Hangings', 'Mirrors', 'Paintings'],
        },
        {
          name: 'Lighting',
          items: ['Table Lamps', 'Floor Lamps', 'Pendant Lights'],
        },
        {
          name: 'Accessories',
          items: ['Cushions', 'Rugs', 'Table Decor'],
        },
      ],
    },
  ];

  return (
    <header className="w-full bg-neutral-950 border-b border-neutral-800 fixed top-0 z-40 left-0 right-0" ref={menuRef}>
      <div className="max-w-full px-6 md:px-8 py-2 md:py-3">
        {/* Logo & Navigation Row */}
        <div className="flex items-center justify-between gap-8">
          {/* Logo & Branding */}
          <Link href="/" onClick={closeMegaMenu} className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="relative w-24 h-24 shrink-0">
              <Image
                  src="/logo.jpg"
                  alt="D&L Furnitech Logo"
                  fill
                  sizes="(max-width: 768px) 90px, 96px"
                  className="object-contain"
                />
             </div>
             <div className="hidden sm:block">
               <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-yellow-600 via-yellow-500 to-yellow-400 bg-clip-text text-transparent leading-none">
                 D&L
               </h1>
               <p className="text-xs md:text-sm font-semibold text-yellow-500 mt-1">
                 FURNITECH
               </p>
             </div>
           </Link>

          {/* Navigation Menu - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-6 text-gray-300 font-medium text-sm relative z-40 flex-1">
            {categories.map((cat) => (
              <div key={cat.slug} className="relative group">
                <button
                  onMouseEnter={() => setActiveMenu(cat.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                  className="hover:text-yellow-600 transition pb-3 pt-3 border-b-2 border-transparent hover:border-yellow-600 flex items-center gap-1"
                >
                  {cat.name}
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </button>

                {/* Megamenu */}
                <div
                  onMouseEnter={() => setActiveMenu(cat.slug)}
                  onMouseLeave={() => setActiveMenu(null)}
                  className="absolute top-full left-0 bg-neutral-900 border border-neutral-800 shadow-xl shadow-black/50 z-50 py-6 px-6 hidden group-hover:block w-screen max-w-5xl"
                >
                  <div className="grid grid-cols-4 gap-8">
                    {/* Category Image */}
                    <div className="h-64 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Menu Items */}
                    <div className="col-span-3">
                      <div className="grid grid-cols-3 gap-8">
                        {cat.subCategories.map((subCat, idx) => (
                          <div key={idx}>
                            <h4 className="font-bold text-white mb-3 text-sm border-b-2 border-yellow-600 pb-2">
                              {subCat.name}
                            </h4>
                            <ul className="space-y-2">
                              {subCat.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    href={item.startsWith('All ') ? `/category/${cat.slug}` : `/search?q=${encodeURIComponent(item)}`}
                                    onClick={closeMegaMenu}
                                    className="text-gray-300 text-sm hover:text-yellow-600 hover:font-semibold transition"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-neutral-800 rounded-lg"
            title="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Search & Icons */}
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-neutral-900 rounded-full px-4 py-2 w-48 lg:w-64 border border-neutral-800">
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none text-sm w-full text-white placeholder-gray-300 font-medium"
              />
              <button type="submit" className="hover:opacity-70">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Wishlist Icon - Show for all users except admin */}
            {!user || user.role !== 'admin' ? (
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-neutral-800 rounded-full transition"
                title="Wishlist"
              >
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>
            ) : null}

            {/* Cart Icon - Show for all users except admin */}
            {!user || user.role !== 'admin' ? (
              <Link
                href="/cart"
                className="relative p-2 hover:bg-neutral-800 rounded-full transition"
                title="Cart"
              >
                <svg
                  className="w-6 h-6 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {getCount() > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCount()}
                  </span>
                )}
              </Link>
            ) : null}

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="p-2 hover:bg-neutral-800 rounded-full transition flex items-center gap-2"
                    title="Account"
                  >
                    <IoPerson className="w-6 h-6 text-yellow-500" />
                    <span className="hidden sm:inline text-sm text-gray-300 max-w-25 truncate">
                      {user?.email || 'Account'}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-neutral-800">
                        <p className="text-sm text-gray-400">Signed in as</p>
                        <p className="text-white font-semibold">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-yellow-500 transition"
                      >
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-yellow-500 transition"
                      >
                        My Orders
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-neutral-800 hover:text-red-500 transition flex items-center gap-2"
                      >
                        <IoLogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-3 py-2 text-sm text-gray-300 hover:text-yellow-500 transition hidden sm:block"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-3 py-2 text-sm bg-yellow-500 text-black rounded hover:bg-yellow-600 transition font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-3 mt-4 p-4 bg-neutral-900 border-t border-neutral-800 text-gray-300 font-medium text-sm max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Categories */}
          {categories.map((cat) => (
            <div key={cat.slug} className="border-b border-neutral-800 pb-3">
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === cat.slug ? null : cat.slug)
                }
                className="w-full text-left hover:text-yellow-600 flex items-center justify-between gap-3 py-2"
              >
                <div className="flex items-center gap-3 flex-1">
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-12 h-12 object-cover rounded border border-neutral-700"
                  />
                  <span className="font-semibold">{cat.name}</span>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform shrink-0 ${
                    activeMenu === cat.slug ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {/* Mobile submenu */}
              {activeMenu === cat.slug && (
                <div className="bg-neutral-800 rounded-lg p-3 mt-2 mb-4">
                  {/* Category Image Preview */}
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="w-full h-40 object-cover rounded-lg mb-4 border border-neutral-700"
                  />
                  
                  {cat.subCategories.map((subCat, idx) => (
                    <div key={idx} className="mb-4 pb-3 border-b border-neutral-700 last:border-b-0">
                      <p className="font-semibold text-yellow-500 text-sm mb-2">
                        {subCat.name}
                      </p>
                      <ul className="space-y-1.5">
                        {subCat.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link
                              href={item.startsWith('All ') ? `/category/${cat.slug}` : `/search?q=${encodeURIComponent(item)}`}
                              onClick={closeMegaMenu}
                              className="text-gray-300 text-xs hover:text-yellow-400 block pl-3 py-1"
                            >
                              • {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        )}
      </div>
    </header>
  );
}
