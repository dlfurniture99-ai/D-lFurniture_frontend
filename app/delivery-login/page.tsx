'use client';

import { FiTruck as FaTruck, FiMail as FaEnvelope, FiArrowRight as FaArrowRight, FiHome as FaHome } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { toast } from 'sonner';

export default function DeliveryLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('📧 Request OTP clicked for:', email);

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/delivery-boy/request-otp`;
      console.log('🚀 Calling API:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      console.log('✅ API Response:', data);

      if (!response.ok) {
        toast.error(data.message || 'Failed to send OTP');
        return;
      }

      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (error) {
      console.error('Request OTP failed:', error);
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/delivery-boy/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp }),
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Login failed');
        return;
      }

      // Store user data
      localStorage.setItem('deliveryUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);

      toast.success(`Welcome ${data.user.name}!`);
      router.push('/delivery');
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaTruck className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Delivery Portal</h1>
          </div>
          <p className="text-gray-400">Login to manage deliveries</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          {step === 1 ? (
            <>
              {/* Step 1: Email */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Enter Your Email</h2>
              </div>

              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
                    />
                  </div>
                </div>

                <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                  <p className="text-blue-200 text-sm">
                    <strong>Passwordless Login:</strong> We&apos;ll send you an OTP via email. No password needed!
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending OTP...' : (
                    <>
                      <FaArrowRight className="w-5 h-5" />
                      Send OTP
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Step 2: OTP */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Enter OTP</h2>
                <p className="text-gray-400 text-sm mb-6">
                  We've sent a 6-digit OTP to <span className="text-yellow-400">{email}</span>
                </p>
              </div>

              <form onSubmit={handleOtpLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    One-Time Password
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition text-center text-2xl font-bold tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? 'Logging in...' : (
                    <>
                      <FaArrowRight className="w-5 h-5" />
                      Login
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp('');
                  }}
                  className="w-full py-3 border border-white/20 text-white rounded-lg hover:bg-white/5 transition"
                >
                  Back
                </button>
              </form>
              </>
              )}

              {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-gray-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Back to Home */}
          <Link
            href="/"
            className="w-full py-3 border border-white/20 text-white rounded-lg font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2"
          >
            <FaHome className="w-5 h-5" />
            Back to Home
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Contact your admin for access credentials
          </p>
          <p className="text-gray-500 text-xs">
            © 2024 D&L Furnitech Delivery System
          </p>
        </div>
      </div>
    </div>
  );
}
