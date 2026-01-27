'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { removeAuthToken } from '@/lib/api';
import { clearUserRole } from '@/lib/auth-utils';

interface AdminLayoutProps {
  children: React.ReactNode;
  adminEmail?: string;
}

export default function AdminLayout({ children, adminEmail = '' }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: '📊',
      description: 'Overview and statistics',
    },
    {
      label: 'Products',
      href: '/admin/products',
      icon: '📦',
      description: 'Add, edit, delete products',
    },
    {
      label: 'Orders',
      href: '/admin/orders',
      icon: '📋',
      description: 'Manage customer orders',
    },
    {
      label: 'Customers',
      href: '/admin/customers',
      icon: '👥',
      description: 'View customer information',
    },
    {
      label: 'Analytics',
      href: '/admin/analytics',
      icon: '📈',
      description: 'Sales and traffic analytics',
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: '🏷️',
      description: 'Manage product categories',
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: '⚙️',
      description: 'System settings',
    },
  ];

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      removeAuthToken();
      clearUserRole();
      router.push('/admin');
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-600 to-yellow-700 text-white sticky top-0 z-50 shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-yellow-500 rounded-lg transition"
              title="Toggle sidebar"
            >
              {sidebarOpen ? '☰' : '›'}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="text-2xl font-bold">D&L Admin</div>
              <span className="text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">
                Panel
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            <div className="text-sm">
              <p className="text-yellow-100">Welcome</p>
              <p className="font-semibold">{adminEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 transition-all duration-300 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto`}
        >
          <nav className="p-4 space-y-2">
            <div className="mb-8">
              <h2
                className={`text-xs font-bold text-gray-500 uppercase tracking-wider ${
                  !sidebarOpen && 'text-center'
                }`}
              >
                {sidebarOpen ? 'Main Menu' : ''}
              </h2>
            </div>

            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-yellow-50 text-yellow-700 border-l-4 border-yellow-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  title={item.label}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {sidebarOpen && (
                    <div className="text-left">
                      <p className="font-semibold text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  )}
                </button>
              </Link>
            ))}

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Quick Links */}
            <h2
              className={`text-xs font-bold text-gray-500 uppercase tracking-wider mt-8 ${
                !sidebarOpen && 'text-center'
              }`}
            >
              {sidebarOpen ? 'Quick Links' : ''}
            </h2>

            <Link href="/">
              <button
                className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                title="Visit Store"
              >
                <span className="text-2xl">🏪</span>
                {sidebarOpen && (
                  <div className="text-left">
                    <p className="font-semibold text-sm">Visit Store</p>
                    <p className="text-xs text-gray-500">Go to main website</p>
                  </div>
                )}
              </button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
