'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/lib/useAuth';
import { getAllOrders, updateOrderStatus, Order } from '@/lib/api';

export default function AdminOrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllOrders(page, 20);
        if (response.success && response.data) {
          setOrders(response.data.orders);
          setTotalPages(response.data.pagination.pages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchOrders();
    }
  }, [page, isAuthenticated, user]);

  // Handle status update
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const response = await updateOrderStatus(orderId, newStatus);
      if (response.success && response.data) {
        setOrders(orders.map(order => 
          order._id === orderId ? response.data! : order
        ));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders by status
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <AdminLayout adminEmail={user?.email || 'Admin'}>
        <div className="bg-white rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8">
            You need to be an admin to access this page.
          </p>
          <Link
            href="/admin"
            className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
          >
            Go to Admin Login
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout adminEmail={user?.email || 'Admin'}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">All Orders</h1>
        <p className="text-gray-600 mt-2">
          Manage and track all customer orders
        </p>
      </div>

          {/* Status Filter */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Filter by Status
            </h2>
            <div className="flex flex-wrap gap-3">
              {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                      filterStatus === status
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            // Empty State
            <div className="bg-white rounded-lg p-12 text-center">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Orders Found
              </h2>
              <p className="text-gray-600">
                {filterStatus === 'all'
                  ? 'There are no orders yet.'
                  : `There are no ${filterStatus} orders.`}
              </p>
            </div>
          ) : (
            // Orders Table
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Items
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <code className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {order._id?.slice(-6)}
                          </code>
                        </td>

                        {/* Customer Info */}
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {order.shippingAddress.email}
                            </p>
                          </div>
                        </td>

                        {/* Items Count */}
                        <td className="px-6 py-4">
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">
                            ₹{order.total.toLocaleString()}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order._id!, e.target.value)
                            }
                            disabled={updatingId === order._id}
                            className={`text-sm font-semibold px-3 py-1 rounded-lg border transition ${
                              order.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                                : order.status === 'processing'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : order.status === 'shipped'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : order.status === 'delivered'
                                ? 'bg-green-50 text-green-800 border-green-200'
                                : 'bg-red-50 text-red-800 border-red-200'
                            } disabled:opacity-50`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>

                        {/* View Details */}
                        <td className="px-6 py-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="text-yellow-600 hover:text-yellow-700 font-semibold text-sm"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition font-medium"
              >
                Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-2 rounded-lg font-medium transition ${
                      page === p
                        ? 'bg-yellow-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition font-medium"
              >
                Next
              </button>
            </div>
          )}
    </AdminLayout>
  );
}
