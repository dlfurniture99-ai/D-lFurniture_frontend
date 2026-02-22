'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';

export default function AnalyticsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}>
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Analytics" />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Revenue Chart Placeholder */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
                <div className="flex items-end justify-around h-64 gap-2">
                  {[40, 60, 45, 80, 65, 90, 75].map((height, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-yellow-400 to-yellow-500 rounded-t-lg hover:from-yellow-500 hover:to-yellow-600 transition"
                      style={{ height: `${height}%` }}
                      title={`Day ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 text-center mt-4">Last 7 days</p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Completed</span>
                      <span className="text-sm font-bold text-gray-900">120 (77%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '77%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Pending</span>
                      <span className="text-sm font-bold text-gray-900">36 (23%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Key Metrics</h3>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">₹2,692</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Customer Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">4.6/5</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Return Rate</p>
                  <p className="text-2xl font-bold text-gray-900">2.3%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Repeat Customers</p>
                  <p className="text-2xl font-bold text-gray-900">45%</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-1">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">3.8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
