'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import OfferBar from '@/components/OfferBar';
import Footer from '@/components/Footer';
import { useAuth } from '@/lib/useAuth';
import { getOrderById, updateOrderStatus, Order } from '@/lib/api';

export default function AdminOrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated, user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getOrderById(id);
        if (response.success && response.data) {
          setOrder(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.role === 'admin') {
      fetchOrder();
    }
  }, [id, isAuthenticated, user]);

  // Handle status update
  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      setIsUpdating(true);
      const response = await updateOrderStatus(id, newStatus);
      if (response.success && response.data) {
        setOrder(response.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if user is admin
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="w-full">
        <OfferBar />
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
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
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full">
        <OfferBar />
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-white rounded-lg p-12 text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading order details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-full">
        <OfferBar />
        <Header />
        <main className="min-h-screen bg-gray-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="bg-white rounded-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Order Not Found
              </h1>
              <p className="text-gray-600 mb-8">{error || 'This order does not exist.'}</p>
              <Link
                href="/admin/orders"
                className="inline-block bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full">
      <OfferBar />
      <Header />
      <main className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link href="/admin/dashboard" className="hover:text-yellow-500">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/admin/orders" className="hover:text-yellow-500">
              Orders
            </Link>
            <span>/</span>
            <span>Order Details</span>
          </div>

          {/* Back Button */}
          <Link
            href="/admin/orders"
            className="inline-block mb-6 text-yellow-600 hover:text-yellow-700 font-semibold"
          >
            ← Back to Orders
          </Link>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Order #{order._id?.slice(-6)}
                  </h1>
                  <div
                    className={`px-4 py-2 rounded-lg border font-semibold capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </div>
                </div>
                <p className="text-gray-600">
                  Placed on{' '}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'N/A'}
                </p>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between pb-4 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          Product ID: {item.productId}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{item.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Subtotal: ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span>{' '}
                    {order.shippingAddress.firstName}{' '}
                    {order.shippingAddress.lastName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{' '}
                    {order.shippingAddress.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{' '}
                    {order.shippingAddress.phone}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{' '}
                    {order.shippingAddress.address}
                  </p>
                  <p>
                    <span className="font-semibold">City:</span>{' '}
                    {order.shippingAddress.city}
                  </p>
                  <p>
                    <span className="font-semibold">State:</span>{' '}
                    {order.shippingAddress.state}
                  </p>
                  <p>
                    <span className="font-semibold">ZIP Code:</span>{' '}
                    {order.shippingAddress.zipCode}
                  </p>
                  <p>
                    <span className="font-semibold">Country:</span>{' '}
                    {order.shippingAddress.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-lg p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{order.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-yellow-600">
                    ₹{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Update Status
                </h2>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdating}
                  className={`w-full px-4 py-2 rounded-lg border font-medium transition capitalize ${getStatusColor(
                    order.status
                  )} disabled:opacity-50`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {isUpdating && (
                  <p className="text-sm text-gray-600 mt-2">Updating status...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
