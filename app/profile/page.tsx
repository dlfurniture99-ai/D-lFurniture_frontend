'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import HeaderNew from '@/components/HeaderNew';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/useAuth';
import { getUserProfile } from '@/lib/api';
import { IoPerson, IoMail, IoLocation, IoArrowBack, IoPencil } from 'react-icons/io5';
import { FaPhone } from 'react-icons/fa';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Redirect if not authenticated (but wait for auth to load first)
  useEffect(() => {
    // Wait for auth to load
    if (authLoading) {
      return;
    }

    // Redirect if not authenticated after auth is loaded
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile();
        if (response.success) {
          setProfile(response.data);
        } else {
          setError(response.message || 'Failed to fetch profile');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuthenticated, authLoading, router]);

  if (loading) {
    return (
      <div className="w-full">
        <HeaderNew />
        <main className="min-h-screen bg-gray-50 pt-24 pb-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <HeaderNew />
        <main className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-600 font-semibold mb-4">{error}</p>
              <Link
                href="/"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Go back home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full">
        <HeaderNew />
        <main className="min-h-screen bg-gray-50 pt-24 pb-12">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">No profile data found</p>
              <Link
                href="/"
                className="text-orange-600 hover:text-orange-700 font-semibold"
              >
                Go back home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full">
      <HeaderNew />
      <main className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold mb-8 transition"
          >
            <IoArrowBack size={20} />
            Back to Home
          </Link>

          {/* Profile Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-t-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <IoPerson size={40} className="text-orange-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <p className="text-orange-100">Member since {memberSince}</p>
                </div>
              </div>
              <button className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-orange-50 transition flex items-center gap-2">
                <IoPencil size={18} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-b-xl shadow-lg">
            {/* Contact Information */}
            <div className="border-b border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <IoMail size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email Address</p>
                    <p className="text-lg text-gray-900 font-medium">{profile.email}</p>
                  </div>
                </div>

                {/* Phone */}
                {profile.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                      <FaPhone size={24} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-semibold">Phone Number</p>
                      <p className="text-lg text-gray-900 font-medium">{profile.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address Information */}
            {(profile.address || profile.city || profile.state || profile.country) && (
              <div className="border-b border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Address</h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                    <IoLocation size={24} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-700">
                      {profile.address && <span>{profile.address}<br /></span>}
                      {profile.city && <span>{profile.city}, </span>}
                      {profile.state && <span>{profile.state} </span>}
                      {profile.zipCode && <span>{profile.zipCode}</span>}
                      {profile.country && (
                        <>
                          <br />
                          <span>{profile.country}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Details */}
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Account Type</span>
                  <span className="text-gray-900 font-semibold capitalize">{profile.role}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">User ID</span>
                  <span className="text-gray-900 font-mono text-sm">{profile._id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Last Updated</span>
                  <span className="text-gray-900 font-semibold">
                    {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Link
              href="/orders"
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-3xl mb-2">📦</div>
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-600">View your orders</p>
            </Link>

            <Link
              href="/wishlist"
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-3xl mb-2">❤️</div>
              <h3 className="font-semibold text-gray-900">Wishlist</h3>
              <p className="text-sm text-gray-600">View your favorites</p>
            </Link>

            <Link
              href="/cart"
              className="bg-white border border-gray-200 rounded-lg p-6 text-center hover:shadow-lg transition"
            >
              <div className="text-3xl mb-2">🛒</div>
              <h3 className="font-semibold text-gray-900">Shopping Cart</h3>
              <p className="text-sm text-gray-600">View your cart</p>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
