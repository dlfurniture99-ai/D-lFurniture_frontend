'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HeaderNew from '@/components/HeaderNew';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/useAuth';
import { getUserDashboard, getUserProfile, getUserOrders, getUserWishlist } from '@/lib/api';
import { 
  IoPerson, 
  IoLocation, 
  IoBagHandle, 
  IoHeart, 
  IoLogOut, 
  IoMenu,
  IoClose
} from 'react-icons/io5';

interface DashboardData {
  profile: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email: string;
    phone?: string;
    role: string;
  };
  orders: any[];
  wishlist: {
    productIds: any[];
  };
  stats: {
    totalOrders: number;
    wishlistCount: number;
  };
}

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      // router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getUserDashboard();
        
        if (response.success) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {data?.profile.firstName} {data?.profile.lastName || ''}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {data?.profile.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {data?.profile.phone || 'Not provided'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900 capitalize">
                  {data?.profile.role}
                </div>
              </div>
            </div>
            <button className="mt-6 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition">
              Edit Profile
            </button>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            {data?.orders && data.orders.length > 0 ? (
              <div className="space-y-4">
                {data.orders.map((order: any) => (
                  <div key={order._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-mono font-medium text-gray-900">#{order._id.slice(-6)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-yellow-600">₹{order.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                            'bg-blue-100 text-blue-700'}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                        {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-gray-100 rounded overflow-hidden relative">
                                    {/* Placeholder for image if not available in order item */}
                                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">IMG</div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{item.quantity}x Item</p>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                <p className="text-gray-500">No orders found.</p>
                <Link href="/" className="text-yellow-600 hover:underline mt-2 inline-block">Start Shopping</Link>
              </div>
            )}
          </div>
        );
      case 'wishlist':
        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
                {data?.wishlist && data.wishlist.productIds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.wishlist.productIds.filter((p: any) => p).map((product: any) => (
                            <Link href={`/product/${product._id}`} key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                <div className="h-48 bg-gray-100 relative">
                                    {product.images && product.images[0] && (
                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                                    <p className="text-yellow-600 font-bold mt-2">₹{product.price?.toLocaleString()}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
                        <p className="text-gray-500">Your wishlist is empty.</p>
                        <Link href="/" className="text-yellow-600 hover:underline mt-2 inline-block">Explore Products</Link>
                    </div>
                )}
            </div>
        );
      case 'address':
        return (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                    <button className="text-sm text-yellow-600 font-semibold hover:underline">+ Add New</button>
                </div>
                {/* Mock Address Data since it's not in the dashboard response explicitly yet */}
                <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 relative">
                        <span className="absolute top-4 right-4 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">Default</span>
                        <p className="font-bold text-gray-900">{data?.profile.firstName} {data?.profile.lastName}</p>
                        <p className="text-gray-600 text-sm mt-1">123 Furniture Street, Woodwork City</p>
                        <p className="text-gray-600 text-sm">Mumbai, Maharashtra - 400001</p>
                        <p className="text-gray-600 text-sm mt-2">Phone: {data?.profile.phone}</p>
                        <div className="flex gap-4 mt-4 text-sm">
                            <button className="text-blue-600 hover:underline">Edit</button>
                            <button className="text-red-600 hover:underline">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderNew />
      
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:bg-transparent
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="h-full flex flex-col bg-white lg:rounded-xl lg:shadow-sm lg:border lg:border-gray-100 overflow-hidden">
                    {/* User Info */}
                    <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-neutral-900 to-neutral-800 text-white">
                        <div className="flex items-center justify-between lg:hidden mb-4">
                            <span className="font-bold text-lg">Menu</span>
                            <button onClick={() => setSidebarOpen(false)}><IoClose size={24} /></button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-xl font-bold text-white">
                                {data?.profile.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold truncate">{data?.profile.firstName || 'User'}</p>
                                <p className="text-xs text-gray-400 truncate">{data?.profile.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <button
                            onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                                ${activeTab === 'profile' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                        >
                            <IoPerson size={18} />
                            Profile Information
                        </button>
                        <button
                            onClick={() => { setActiveTab('orders'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                                ${activeTab === 'orders' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                        >
                            <IoBagHandle size={18} />
                            My Orders
                            <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                {data?.stats.totalOrders || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('wishlist'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                                ${activeTab === 'wishlist' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                        >
                            <IoHeart size={18} />
                            My Wishlist
                            <span className="ml-auto bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                {data?.stats.wishlistCount || 0}
                            </span>
                        </button>
                        <button
                            onClick={() => { setActiveTab('address'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                                ${activeTab === 'address' ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}
                            `}
                        >
                            <IoLocation size={18} />
                            Shipping Addresses
                        </button>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-gray-100">
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition"
                        >
                            <IoLogOut size={18} />
                            Log Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden mb-6 flex items-center gap-4">
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 bg-white rounded-lg shadow-sm border border-gray-200 text-gray-700"
                    >
                        <IoMenu size={24} />
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">My Account</h1>
                </div>

                {renderContent()}
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
