'use client';

import { useState } from 'react';
import { FaSearch, FaTruck, FaCheckCircle, FaClock, FaPhone, FaUser } from 'react-icons/fa';
import { toast } from 'sonner';

interface DeliveryStatus {
  _id: string;
  bookingId: string;
  status: string;
  totalPrice: number;
  deliveryBoyName?: string;
  deliveryBoyPhone?: string;
  deliveredDate?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function DeliveryStatusPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryData, setDeliveryData] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter booking ID');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery/search?searchTerm=${searchTerm}`
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Booking not found');
        setDeliveryData(null);
        return;
      }

      setDeliveryData(data.booking);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search delivery status');
      setDeliveryData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400';
      case 'shipped':
        return 'text-blue-400';
      case 'confirmed':
        return 'text-purple-400';
      case 'pending':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="w-12 h-12" />;
      case 'shipped':
        return <FaTruck className="w-12 h-12" />;
      default:
        return <FaClock className="w-12 h-12" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Track Delivery</h1>
          <p className="text-gray-400">Check your order delivery status in real-time</p>
        </div>

        {/* Search Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-sm font-semibold text-gray-200 mb-3">
              Enter Booking ID
            </label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., BK-123456789"
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition"
            >
              {loading ? 'Searching...' : 'Track Delivery'}
            </button>
          </form>
        </div>

        {/* Results */}
        {deliveryData && (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center justify-center mb-8">
                <div className={`${getStatusColor(deliveryData.status)}`}>
                  {getStatusIcon(deliveryData.status)}
                </div>
              </div>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {deliveryData.status === 'delivered'
                    ? 'Delivered'
                    : deliveryData.status === 'shipped'
                    ? 'Out for Delivery'
                    : 'Processing'}
                </h2>
                <p className="text-gray-400">
                  Booking: <span className="text-yellow-400 font-semibold">{deliveryData.bookingId}</span>
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-white font-semibold">Order Confirmed</p>
                    <p className="text-gray-400 text-sm">Your order has been confirmed</p>
                  </div>
                </div>

                {deliveryData.status !== 'pending' && (
                  <>
                    <div className="w-0.5 h-4 bg-green-500 ml-1.5" />
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-white font-semibold">In Transit</p>
                        <p className="text-gray-400 text-sm">Your package is on the way</p>
                      </div>
                    </div>
                  </>
                )}

                {deliveryData.status === 'delivered' && (
                  <>
                    <div className="w-0.5 h-4 bg-green-500 ml-1.5" />
                    <div className="flex items-center gap-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                      <div>
                        <p className="text-white font-semibold">Delivered</p>
                        <p className="text-gray-400 text-sm">
                          {deliveryData.deliveredDate && new Date(deliveryData.deliveredDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Details */}
              <div className="space-y-4 bg-black/20 p-4 rounded-lg">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Amount</p>
                    <p className="text-yellow-400 font-bold text-lg">₹{deliveryData.totalPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Order ID</p>
                    <p className="text-white font-semibold">{deliveryData.bookingId}</p>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <p className="text-gray-400 text-sm mb-2">Delivery Address</p>
                  <div className="text-white">
                    <p>{deliveryData.shippingAddress.street}</p>
                    <p>
                      {deliveryData.shippingAddress.city}, {deliveryData.shippingAddress.state}{' '}
                      {deliveryData.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>

                {/* Delivery Boy Info */}
                {deliveryData.deliveryBoyName && (
                  <div className="border-t border-white/10 pt-4 mt-4">
                    <p className="text-gray-400 text-sm mb-3">Delivery Executive</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <FaUser className="w-4 h-4 text-yellow-400" />
                        <span className="text-white">{deliveryData.deliveryBoyName}</span>
                      </div>
                      {deliveryData.deliveryBoyPhone && (
                        <div className="flex items-center gap-3">
                          <FaPhone className="w-4 h-4 text-yellow-400" />
                          <a
                            href={`tel:${deliveryData.deliveryBoyPhone}`}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            {deliveryData.deliveryBoyPhone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Help Text */}
            {deliveryData.status === 'shipped' && (
              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  Your delivery executive will contact you soon. Please keep your OTP ready for verification.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!deliveryData && searchTerm && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No delivery information found for this booking ID</p>
          </div>
        )}
      </div>
    </div>
  );
}
