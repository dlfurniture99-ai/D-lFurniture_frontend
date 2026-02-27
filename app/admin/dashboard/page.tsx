'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaShoppingCart, FaBox, FaChartLine, FaChartBar } from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { adminApi } from '@/app/apis/adminApi';

interface BookingStat {
  total: number;
  completed: number;
  pending: number;
  revenue: number;
}

interface Booking {
  _id: string;
  bookingId: string;
  status: string;
  totalAmount: number;
}

export default function AdminOverview() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<BookingStat>({ total: 0, completed: 0, pending: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin token
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await adminApi.bookings.getAll();
      
      if (response.success && response.data) {
        const bookings = response.data;
        
        const completed = bookings.filter((b: Booking) => b.status === 'completed').length;
        const pending = bookings.filter((b: Booking) => b.status === 'pending').length;
        const revenue = bookings.reduce((sum: number, b: Booking) => sum + (b.totalAmount || 0), 0);

        setStats({
          total: bookings.length,
          completed,
          pending,
          revenue
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}>
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Dashboard" />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Completed</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <FaBox className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Pending</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <FaChartLine className="w-8 h-8 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900">₹{(stats.revenue / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaChartBar className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats Box */}
            <div className="bg-white rounded-lg p-4 md:p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Completion Rate</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">{Math.round((stats.completed / stats.total) * 100)}%</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-2">Average Order Value</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">₹{Math.round(stats.revenue / stats.total)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-2">Pending Orders</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
