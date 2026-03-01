'use client';

import { FiShoppingCart as FaShoppingCart, FiUser as FaUser, FiMenu as FaBars, FiX as FaTimes, FiHeart as FaHeart, FiBox as FaBox } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function Navigation() {
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-slate-900/95 to-purple-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.jpg" 
            alt="The Wooden Space" 
            width={40}
            height={40}
            className="h-10 w-auto object-contain"
            priority
          />
          <span className="text-lg font-bold text-yellow-400 hidden sm:inline">The Wooden Space</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-gray-300 hover:text-yellow-400 transition">
            Products
          </Link>
          
          {user && (
            <>
              <Link href="/my-orders" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">
                <FaBox className="w-4 h-4" />
                My Orders
              </Link>
              
              <Link href="/my-favorites" className="text-gray-300 hover:text-yellow-400 transition flex items-center gap-2">
                <FaHeart className="w-4 h-4" />
                Favorites
              </Link>
              
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link href="/admin/dashboard" className="text-gray-300 hover:text-yellow-400 transition">
                  Dashboard
                </Link>
              )}
            </>
          )}
        </div>

        {/* User Section */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                <FaUser className="w-4 h-4 text-yellow-400" />
                <span className="text-white text-sm">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-yellow-400 transition">
                Login
              </Link>
              <Link href="/register" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
        >
          {mobileOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-800/95 border-t border-white/10 p-4 space-y-4">
          <Link href="/products" className="block text-gray-300 hover:text-yellow-400 py-2">
            Products
          </Link>
          
          {user && (
            <>
              <Link href="/my-orders" className="block text-gray-300 hover:text-yellow-400 py-2 flex items-center gap-2">
                <FaBox className="w-4 h-4" />
                My Orders
              </Link>
              
              <Link href="/my-favorites" className="block text-gray-300 hover:text-yellow-400 py-2 flex items-center gap-2">
                <FaHeart className="w-4 h-4" />
                Favorites
              </Link>
              
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <Link href="/admin/dashboard" className="block text-gray-300 hover:text-yellow-400 py-2">
                  Dashboard
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link href="/login" className="block text-gray-300 hover:text-yellow-400 py-2">
                Login
              </Link>
              <Link href="/register" className="block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold text-center">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
