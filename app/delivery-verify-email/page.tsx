'use client';

import { FiTruck as FaTruck, FiMail as FaEnvelope, FiCheckCircle as FaCheckCircle, FiArrowRight as FaArrowRight, FiShield as FaShieldAlt } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { toast } from 'sonner';

export default function DeliveryVerifyEmailPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP input
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setStep(2);
    toast.success('Please check your email for the OTP');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-delivery-boy-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            otp
          }),
          credentials: 'include'
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to verify email');
        return;
      }

      // Store user data and token
      localStorage.setItem('deliveryUser', JSON.stringify(data.user));
      localStorage.setItem('authToken', data.token);

      toast.success('Email verified successfully!');
      
      // Show success message and redirect
      setStep(3);
      setTimeout(() => {
        router.push('/delivery-login');
      }, 2000);
    } catch (error) {
      console.error('Verification failed:', error);
      toast.error('Failed to verify email');
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
            <h1 className="text-3xl font-bold text-white">Verify Email</h1>
          </div>
          <p className="text-gray-400">Complete email verification to activate your delivery account</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 1
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            1
          </div>
          <div className={`h-1 w-12 ${step >= 2 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 2
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            2
          </div>
          <div className={`h-1 w-12 ${step >= 3 ? 'bg-yellow-500' : 'bg-gray-700'}`} />
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              step >= 3
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            ✓
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Enter Your Email</h2>
                <p className="text-gray-400 text-sm mb-6">
                  We'll send you a verification OTP to this email address
                </p>
              </div>

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
                    placeholder="delivery@example.com"
                    className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <FaArrowRight className="w-5 h-5" />
                Send OTP
              </button>

              <p className="text-gray-400 text-xs text-center">
                Make sure to use the email provided by the admin
              </p>
            </form>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">Enter OTP</h2>
                <p className="text-gray-400 text-sm mb-6">
                  We've sent a 6-digit OTP to<br />
                  <strong className="text-yellow-400">{email}</strong>
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-3">
                  One-Time Password (OTP)
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

              <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>Check your email:</strong> Look for the OTP in your inbox or spam folder
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : (
                  <>
                    <FaCheckCircle className="w-5 h-5" />
                    Verify OTP
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
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center animate-pulse">
                  <FaCheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                <p className="text-gray-400">
                  Your email has been verified successfully. You can now login to your delivery account.
                </p>
              </div>

              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <p className="text-green-200 text-sm">
                  You will be redirected to login page in a moment...
                </p>
              </div>

              <Link
                href="/delivery-login"
                className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <FaArrowRight className="w-5 h-5" />
                Go to Login
              </Link>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Issues with verification?
          </p>
          <p className="text-gray-500 text-xs">
            Contact admin at support@dandlfurnitech.com
          </p>
        </div>
      </div>
    </div>
  );
}
