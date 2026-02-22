'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaTruck, FaQrcode, FaArrowRight, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'sonner';

interface BookingData {
  _id: string;
  bookingId: string;
  status: string;
  totalPrice: number;
  quantity?: number;
  product?: {
    _id: string;
    name: string;
    price: number;
  };
  customer?: {
    name: string;
    phone: string;
    email: string;
  };
  shippingAddress?: any;
}

const steps = ['Search Booking', 'Verify Customer', 'Confirm Delivery'];

export default function DeliveryPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [deliveryBoyName, setDeliveryBoyName] = useState('');
  const [deliveryBoyPhone, setDeliveryBoyPhone] = useState('');
  const [deliveryUser, setDeliveryUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('deliveryUser');
      const token = localStorage.getItem('authToken');

      if (!user || !token) {
        router.push('/delivery-login');
        return;
      }

      setDeliveryUser(JSON.parse(user));
      setAuthenticated(true);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('deliveryUser');
    localStorage.removeItem('authToken');
    router.push('/delivery-login');
    toast.success('Logged out successfully');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter booking ID');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const url = `${process.env.NEXT_PUBLIC_API_URL}/delivery/search?searchTerm=${searchTerm}`;
      console.log('🔍 Searching booking:', { searchTerm, url });
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        credentials: 'include'
      });
      const data = await response.json();
      console.log('📦 Search response:', { status: response.status, data });

      if (!response.ok) {
        console.error('❌ Search failed:', data.message);
        toast.error(data.message || 'Booking not found');
        return;
      }

      console.log('✅ Booking found:', data.booking);
      setBookingData(data.booking);
      setCurrentStep(1);
      toast.success('Booking found!');
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Failed to search booking');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOtp = async () => {
    if (!bookingData) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery/${bookingData._id}/generate-otp`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          credentials: 'include'
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to generate OTP');
        return;
      }

      toast.success('OTP sent to customer. Ask them for the OTP.');
      setCurrentStep(2);
    } catch (error) {
      console.error('Failed to generate OTP:', error);
      toast.error('Failed to generate OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData || !otp || !deliveryBoyName || !deliveryBoyPhone) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delivery/${bookingData._id}/confirm`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          credentials: 'include',
          body: JSON.stringify({
            otp,
            deliveryBoyName,
            deliveryBoyPhone
          })
        }
      );
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to confirm delivery');
        return;
      }

      toast.success('Delivery confirmed successfully!');
      // Reset form
      setSearchTerm('');
      setBookingData(null);
      setOtp('');
      setDeliveryBoyName('');
      setDeliveryBoyPhone('');
      setCurrentStep(0);
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
      toast.error('Failed to confirm delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Top Bar with User Info */}
        {deliveryUser && (
          <div className="flex items-center justify-between mb-8 bg-white/10 border border-white/20 rounded-lg p-4">
            <div>
              <p className="text-gray-400 text-sm">Logged in as</p>
              <p className="text-white font-semibold">{deliveryUser.name}</p>
              <p className="text-gray-500 text-xs">{deliveryUser.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition flex items-center gap-2 font-semibold text-sm"
            >
              <FaSignOutAlt className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaTruck className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Delivery Management</h1>
          </div>
          <p className="text-gray-400">Confirm product deliveries with OTP verification</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  index <= currentStep
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStep ? 'bg-yellow-500' : 'bg-gray-700'
                }`}
              />
              {index === steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStep ? 'bg-yellow-500' : 'bg-gray-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Search Booking</h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
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
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Searching...' : (
                    <>
                      <FaSearch className="w-5 h-5" />
                      Search Booking
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {currentStep === 1 && bookingData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Booking Details</h2>
              <div className="space-y-4 bg-black/20 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Booking ID</span>
                  <span className="text-white font-semibold">{bookingData.bookingId}</span>
                </div>
                {bookingData.product && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Product Name</span>
                    <span className="text-white font-semibold">{bookingData.product.name}</span>
                  </div>
                )}
                {bookingData.quantity && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Quantity</span>
                    <span className="text-white font-semibold">{bookingData.quantity}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Price</span>
                  <span className="text-yellow-400 font-bold">₹{bookingData.totalPrice}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span className="text-blue-400 font-semibold">{bookingData.status}</span>
                </div>
                {bookingData.customer && (
                  <>
                    <div className="flex justify-between items-center pt-4 border-t border-white/10">
                      <span className="text-gray-400">Customer Name</span>
                      <span className="text-white font-semibold">{bookingData.customer.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Customer Phone</span>
                      <span className="text-white font-semibold">{bookingData.customer.phone}</span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={handleGenerateOtp}
                disabled={loading}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? 'Generating OTP...' : (
                  <>
                    <FaQrcode className="w-5 h-5" />
                    Generate OTP for Customer
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setSearchTerm('');
                  setBookingData(null);
                }}
                className="w-full py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition"
              >
                Back
              </button>
            </div>
          )}

          {currentStep === 2 && bookingData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">Confirm Delivery</h2>
              <form onSubmit={handleConfirmDelivery} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Delivery Boy Name *
                  </label>
                  <input
                    type="text"
                    value={deliveryBoyName}
                    onChange={(e) => setDeliveryBoyName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={deliveryBoyPhone}
                    onChange={(e) => setDeliveryBoyPhone(e.target.value)}
                    placeholder="+91-XXXXXXXXXX"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Customer OTP *
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 text-center text-2xl font-bold tracking-widest"
                  />
                </div>

                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Note:</strong> Customer has received a 4-digit OTP on their registered phone number. Please ask them to provide it.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 4}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Confirming...' : (
                    <>
                      <FaHome className="w-5 h-5" />
                      Confirm Delivery
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setOtp('');
                    setDeliveryBoyName('');
                    setDeliveryBoyPhone('');
                  }}
                  className="w-full py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition"
                >
                  Back
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 text-sm">
            Need help? Contact support at <span className="text-yellow-400">support@dandlfurnitech.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
