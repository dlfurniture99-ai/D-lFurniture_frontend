'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaArrowLeft, FaDownload } from 'react-icons/fa';

interface Order {
  _id: string;
  bookingId: string;
  productId: { name: string; price: number };
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  deliveryDate?: string;
}

const statusConfig: any = {
  pending: { color: 'bg-yellow-500/20 text-yellow-400', icon: FaClock, label: 'Pending Payment' },
  confirmed: { color: 'bg-blue-500/20 text-blue-400', icon: FaCheckCircle, label: 'Order Confirmed' },
  shipped: { color: 'bg-purple-500/20 text-purple-400', icon: FaTruck, label: 'Order Shipped' },
  delivered: { color: 'bg-green-500/20 text-green-400', icon: FaCheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-500/20 text-red-400', icon: FaBox, label: 'Cancelled' }
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Token is automatically sent via HTTP-only cookie
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        credentials: 'include', // Include cookies
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(order => order.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-12 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/products" className="p-2 hover:bg-gray-200 rounded-lg transition">
            <FaArrowLeft className="w-5 h-5 text-yellow-600" />
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {['all', 'pending', 'confirmed', 'shipped', 'delivered'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <FaBox className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No orders found</p>
            <Link href="/products" className="text-yellow-400 hover:text-yellow-300 mt-4 inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;
              
              return (
                <div key={order._id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-yellow-500/50 transition">
                  <div className="grid md:grid-cols-5 gap-4 items-center mb-4">
                    {/* Order ID */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Order ID</p>
                      <p className="text-gray-600 font-bold">{order.bookingId}</p>
                    </div>

                    {/* Product */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Product</p>
                      <p className="text-gray-600 font-semibold">{order.productId.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {order.quantity}</p>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Price</p>
                      <p className="text-yellow-400 font-bold text-lg">₹{order.totalPrice}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Order Date</p>
                      <p className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div>
                      <p className="text-gray-400 text-sm">Payment Status</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paymentStatus === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/order-details/${order._id}`}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition font-semibold text-sm"
                      >
                        View Details
                      </Link>
                      <button className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition flex items-center gap-2 font-semibold text-sm">
                        <FaDownload className="w-4 h-4" />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
