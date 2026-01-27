'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/lib/useAuth';
import { useAdminProtect } from '@/hooks/useAdminProtect';

export default function AdminAnalytics() {
  useAdminProtect();
  const { user } = useAuth();

  // Mock analytics data
  const analyticsData = {
    totalRevenue: 125000,
    totalOrders: 45,
    totalCustomers: 32,
    avgOrderValue: 2777,
    conversionRate: 3.2,
    avgSessionDuration: '4m 32s',
    topProducts: [
      { name: 'Wooden Sofa Set', sales: 15, revenue: 45000 },
      { name: 'Dining Table', sales: 12, revenue: 36000 },
      { name: 'Bed Frame', sales: 10, revenue: 25000 },
      { name: 'Office Chair', sales: 8, revenue: 19000 },
    ],
    monthlySales: [
      { month: 'Jan', sales: 15000 },
      { month: 'Feb', sales: 18000 },
      { month: 'Mar', sales: 22000 },
      { month: 'Apr', sales: 25000 },
      { month: 'May', sales: 28000 },
      { month: 'Jun', sales: 37000 },
    ],
    ordersByStatus: [
      { status: 'Pending', count: 5 },
      { status: 'Processing', count: 8 },
      { status: 'Shipped', count: 12 },
      { status: 'Delivered', count: 18 },
      { status: 'Cancelled', count: 2 },
    ],
  };

  return (
    <AdminLayout adminEmail={user?.email || 'Admin'}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600 mt-2">Track your store's performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm font-semibold">Total Revenue</p>
          <p className="text-3xl font-bold">₹{(analyticsData.totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-blue-100 text-xs mt-2">+12% from last month</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-green-100 text-sm font-semibold">Total Orders</p>
          <p className="text-3xl font-bold">{analyticsData.totalOrders}</p>
          <p className="text-green-100 text-xs mt-2">+5 this week</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-purple-100 text-sm font-semibold">Total Customers</p>
          <p className="text-3xl font-bold">{analyticsData.totalCustomers}</p>
          <p className="text-purple-100 text-xs mt-2">+8 new customers</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-yellow-100 text-sm font-semibold">Avg Order Value</p>
          <p className="text-3xl font-bold">₹{(analyticsData.avgOrderValue).toLocaleString()}</p>
          <p className="text-yellow-100 text-xs mt-2">+3.2% increase</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-red-100 text-sm font-semibold">Conversion Rate</p>
          <p className="text-3xl font-bold">{analyticsData.conversionRate}%</p>
          <p className="text-red-100 text-xs mt-2">+0.5% improvement</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-indigo-100 text-sm font-semibold">Avg Session</p>
          <p className="text-3xl font-bold">{analyticsData.avgSessionDuration}</p>
          <p className="text-indigo-100 text-xs mt-2">User engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Selling Products</h2>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between border-b pb-4">
                <div>
                  <p className="font-semibold text-gray-900">{idx + 1}. {product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                  <div className="w-24 h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${(product.revenue / analyticsData.topProducts[0].revenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders by Status</h2>
          <div className="space-y-4">
            {analyticsData.ordersByStatus.map((order, idx) => {
              const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-red-500'];
              return (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colors[idx]}`}></div>
                    <p className="font-medium text-gray-900">{order.status}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div
                        className={`h-full ${colors[idx]} rounded-full`}
                        style={{ width: `${(order.count / analyticsData.totalOrders) * 100}%` }}
                      ></div>
                    </div>
                    <p className="font-bold text-gray-900 w-8 text-right">{order.count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sales Trend (Last 6 Months)</h2>
        <div className="flex items-end justify-between h-64 gap-2">
          {analyticsData.monthlySales.map((data, idx) => {
            const maxSales = Math.max(...analyticsData.monthlySales.map(s => s.sales));
            const height = (data.sales / maxSales) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-lg" style={{ height: `${height}%` }}></div>
                <p className="text-sm font-semibold text-gray-900 mt-4">{data.month}</p>
                <p className="text-xs text-gray-600">₹{(data.sales / 1000).toFixed(0)}K</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Categories Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Sofas</span>
              <span className="font-bold text-gray-900">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Beds</span>
              <span className="font-bold text-gray-900">25%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Dining</span>
              <span className="font-bold text-gray-900">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Other</span>
              <span className="font-bold text-gray-900">10%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Segments</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">New Customers</span>
              <span className="font-bold text-gray-900">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Returning</span>
              <span className="font-bold text-gray-900">18</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">VIP Customers</span>
              <span className="font-bold text-gray-900">6</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Direct</span>
              <span className="font-bold text-gray-900">35%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Organic</span>
              <span className="font-bold text-gray-900">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Referral</span>
              <span className="font-bold text-gray-900">20%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
