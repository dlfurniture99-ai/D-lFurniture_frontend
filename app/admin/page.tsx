'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/useAuth';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import AdminSignupForm from '@/components/auth/AdminSignupForm';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, user } = useAuth();

  // If already authenticated as admin, show dashboard
  if (isAuthenticated && user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-4 pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-white mb-2">D&L Admin Panel</h1>
            <p className="text-gray-400">Welcome back, {user?.email}!</p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Orders Card */}
            <Link href="/admin/orders">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 h-full">
                <div className="text-white">
                  <div className="mb-4">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Orders</h2>
                  <p className="text-blue-100">
                    Manage and track all customer orders
                  </p>
                </div>
              </div>
            </Link>

            {/* Products Card */}
            <Link href="/admin/dashboard">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 h-full">
                <div className="text-white">
                  <div className="mb-4">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Products</h2>
                  <p className="text-purple-100">
                    Manage furniture inventory and pricing
                  </p>
                </div>
              </div>
            </Link>

            {/* Customers Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 h-full opacity-50">
              <div className="text-white">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a9 9 0 0118 0v2H0v-2a9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Customers</h2>
                <p className="text-green-100">
                  Coming Soon
                </p>
              </div>
            </div>

            {/* Analytics Card */}
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 h-full opacity-50">
              <div className="text-white">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Analytics</h2>
                <p className="text-red-100">
                  Coming Soon
                </p>
              </div>
            </div>

            {/* Settings Card */}
            <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl p-8 cursor-pointer hover:shadow-2xl transition transform hover:scale-105 h-full opacity-50">
              <div className="text-white">
                <div className="mb-4">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Settings</h2>
                <p className="text-yellow-100">
                  Coming Soon
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => {
                localStorage.removeItem('authToken');
                window.location.reload();
              }}
              className="px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-black flex items-center justify-center p-4 pt-32">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">D&L Admin Panel</h1>
          <p className="text-gray-400">Manage your furniture store</p>
        </div>

        {/* Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-neutral-800">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 font-semibold transition ${
                activeTab === 'login'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-neutral-800 text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-4 font-semibold transition ${
                activeTab === 'signup'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-neutral-800 text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {activeTab === 'login' ? (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Admin Login</h2>
                <AdminLoginForm />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Create Admin Account</h2>
                <AdminSignupForm />
              </>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg text-yellow-200 text-sm">
          <p className="font-semibold mb-2">ℹ️ Admin Access</p>
          <p>To create an admin account, you need the admin secret key provided by the system administrator.</p>
        </div>
      </div>
    </div>
  );
}
