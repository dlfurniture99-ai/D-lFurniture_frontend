'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { adminAuthApi } from '@/app/apis/config';

export default function AdminLogin() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      await adminAuthApi.requestOTP(email.trim());
      toast.success('OTP sent to your email');
      setStep('otp');
    } catch (err: any) {
      const message = err?.message || 'Failed to request OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      console.log('Verifying OTP:', { email: email.trim(), otp: otp.trim() });
      const response = await adminAuthApi.verifyOTP(email.trim(), otp.trim());
      console.log('OTP verification response:', response);
      
      // Store admin token in localStorage for dashboard protection
      if (response?.user) {
        localStorage.setItem('adminToken', 'authenticated');
        localStorage.setItem('adminUser', JSON.stringify(response.user));
      }
      
      toast.success('Login successful');
      // Token is automatically set in cookie by backend
      // Wait a moment for cookie to be set and storage to update
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 500);
    } catch (err: any) {
      console.error('OTP verification error:', err);
      const message = err?.message || 'Invalid OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      await adminAuthApi.requestOTP(email.trim());
      toast.success('OTP resent to your email');
    } catch (err: any) {
      const message = err?.message || 'Failed to resend OTP';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-neutral-950 to-neutral-900 flex items-center justify-center p-4">
      <div className="bg-neutral-800 rounded-lg shadow-2xl p-8 max-w-md w-full text-white">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-yellow-500 mb-2">D&L Admin</h1>
          <p className="text-neutral-400">Secure Login with OTP</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-2 flex items-center gap-2">
                <FaEnvelope className="w-4 h-4" />
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-neutral-700 text-white placeholder-neutral-500"
                placeholder="admin@example.com"
                required
              />
              <p className="text-xs text-neutral-400 mt-1">
                Enter the admin email address registered in the system
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:bg-yellow-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="block text-neutral-300 font-semibold mb-2 flex items-center gap-2">
                <FaLock className="w-4 h-4" />
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setOtp(val);
                }}
                maxLength={6}
                className="w-full px-4 py-3 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 bg-neutral-700 text-white text-center text-2xl tracking-widest placeholder-neutral-500"
                placeholder="000000"
                required
              />
              <p className="text-xs text-neutral-400 mt-1">
                Check your email for the 6-digit OTP (valid for 10 minutes)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition disabled:bg-yellow-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin w-4 h-4" />
                  Verifying...
                </>
              ) : (
                'Verify & Login'
              )}
            </button>

            <div className="text-center pt-4 border-t border-neutral-700">
              <p className="text-sm text-neutral-400 mb-3">
                Didn't receive the OTP?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-yellow-500 hover:text-yellow-400 font-semibold text-sm disabled:text-yellow-300"
              >
                Resend OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('email');
                  setOtp('');
                  setError('');
                }}
                disabled={loading}
                className="block w-full mt-3 text-neutral-400 hover:text-neutral-300 font-semibold text-sm"
              >
                Use Different Email
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-neutral-700 text-center">
          <p className="text-xs text-neutral-500">
            Secure passwordless login for authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
