'use client';

import { useState, useEffect } from 'react';
import { FaBox, FaCalendar, FaTruck, FaCheckCircle } from 'react-icons/fa';

interface Booking {
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

const statusColors = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  confirmed: 'bg-blue-500/20 text-blue-400',
  shipped: 'bg-purple-500/20 text-purple-400',
  delivered: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400'
};

const statusIcons = {
  pending: FaBox,
  confirmed: FaCheckCircle,
  shipped: FaTruck,
  delivered: FaCheckCircle,
  cancelled: FaBox
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // Token is automatically sent via HTTP-only cookie
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        credentials: 'include', // Include cookies
      });
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-28 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <FaBox className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => {
              const StatusIcon = statusIcons[booking.status];
              return (
                <div key={booking._id} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                  <div className="grid md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Booking ID</p>
                      <p className="text-white font-bold text-lg">{booking.bookingId}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Product</p>
                      <p className="text-white font-semibold">{booking.productId.name}</p>
                      <p className="text-gray-400 text-sm">Qty: {booking.quantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Total Price</p>
                      <p className="text-yellow-400 font-bold text-lg">₹{booking.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Status</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusColors[booking.status]}`}>
                        <StatusIcon className="w-4 h-4" />
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="text-white">{new Date(booking.createdAt).toLocaleDateString()}</p>
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
