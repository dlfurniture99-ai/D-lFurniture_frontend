'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { adminApi } from '@/app/apis/adminApi';

interface Order {
  _id: string;
  bookingId: string;
  userId: { name?: string; email?: string; phone?: string };
  productId: { name?: string; price?: number };
  quantity: number;
  totalPrice: number;
  paymentStatus?: string;
  paymentMethod?: string;
  status: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await adminApi.bookings.getAll();
      console.log('Orders response:', response);
      
      if (response.success) {
        const bookingsData = response.bookings || response.data || [];
        console.log('Bookings data:', bookingsData);
        setOrders(Array.isArray(bookingsData) ? bookingsData : []);
      } else {
        toast.error('Failed to fetch orders');
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status?.toLowerCase() || '';
    switch (lowerStatus) {
      case 'completed':
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    const lowerMethod = method?.toLowerCase() || '';
    switch (lowerMethod) {
      case 'cod':
        return 'bg-blue-100 text-blue-700';
      case 'upi':
        return 'bg-purple-100 text-purple-700';
      case 'card':
        return 'bg-indigo-100 text-indigo-700';
      case 'netbanking':
        return 'bg-cyan-100 text-cyan-700';
      case 'wallet':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    const lowerMethod = method?.toLowerCase() || '';
    switch (lowerMethod) {
      case 'cod':
        return 'Cash on Delivery';
      case 'upi':
        return 'UPI';
      case 'card':
        return 'Credit/Debit Card';
      case 'netbanking':
        return 'Net Banking';
      case 'wallet':
        return 'Digital Wallet';
      default:
        return method || 'N/A';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Orders" />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin">
                  <div className="h-12 w-12 border-4 border-yellow-600 border-t-transparent rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900">All Orders</h2>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">{orders.length} orders total</p>
                </div>
                <div className="overflow-x-auto">
                   {orders.length === 0 ? (
                     <div className="p-8 text-center">
                       <p className="text-gray-600">No orders found</p>
                     </div>
                   ) : (
                     <table className="w-full text-xs md:text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Booking ID</th>
                            <th className="hidden sm:table-cell px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Customer</th>
                            <th className="hidden md:table-cell px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Product</th>
                            <th className="px-2 md:px-4 py-3 text-center font-semibold text-gray-900">Qty</th>
                            <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Amount</th>
                            <th className="hidden lg:table-cell px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Address</th>
                            <th className="hidden sm:table-cell px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                            <th className="hidden xl:table-cell px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Payment</th>
                            <th className="px-2 md:px-4 py-3 text-left font-semibold text-gray-900">Status</th>
                          </tr>
                        </thead>
                       <tbody className="divide-y divide-gray-200">
                         {orders.map(order => (
                           <tr key={order._id} className="hover:bg-gray-50 transition">
                             <td className="px-2 md:px-4 py-4 text-gray-900 font-semibold text-xs md:text-sm">{order.bookingId}</td>
                             <td className="hidden sm:table-cell px-2 md:px-4 py-4 text-gray-700">
                               <div className="font-medium text-xs md:text-sm">{order.userId?.name || 'Unknown'}</div>
                               <div className="text-xs text-gray-500">{order.userId?.email}</div>
                               <div className="text-xs text-gray-500">{order.userId?.phone}</div>
                             </td>
                             <td className="hidden md:table-cell px-2 md:px-4 py-4 text-gray-700">
                               <div className="font-medium text-xs md:text-sm">{order.productId?.name || 'N/A'}</div>
                               <div className="text-xs text-gray-500">₹{order.productId?.price || 0}</div>
                             </td>
                             <td className="px-2 md:px-4 py-4 text-gray-700 text-center text-xs md:text-sm">{order.quantity}</td>
                             <td className="px-2 md:px-4 py-4 text-gray-900 font-semibold text-xs md:text-sm">₹{order.totalPrice.toLocaleString()}</td>
                             <td className="hidden lg:table-cell px-2 md:px-4 py-4 text-gray-700 text-xs">
                               <div>{order.shippingAddress?.street}</div>
                               <div>{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                               <div>{order.shippingAddress?.zipCode}</div>
                             </td>
                             <td className="hidden sm:table-cell px-2 md:px-4 py-4 text-gray-600 whitespace-nowrap text-xs md:text-sm">{formatDate(order.createdAt)}</td>
                             <td className="hidden xl:table-cell px-2 md:px-4 py-4">
                               <span className={`px-1.5 md:px-2 py-1 rounded-full text-xs font-semibold ${getPaymentMethodColor(order.paymentMethod || 'cod')}`}>
                                 {getPaymentMethodLabel(order.paymentMethod || 'cod').slice(0, 3)}
                               </span>
                             </td>
                             <td className="px-2 md:px-4 py-4">
                               <span className={`px-1.5 md:px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                 {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                               </span>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

