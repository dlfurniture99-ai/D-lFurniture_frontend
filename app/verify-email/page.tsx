'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';
import { userApi } from '@/app/apis/config';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          toast.error('No verification token provided');
          setLoading(false);
          return;
        }

        // Call backend to verify email
        const response = await userApi.post('auth/verify-email', { token });

        if (response.success) {
          setVerified(true);
          toast.success('Email verified successfully!');
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else {
          toast.error(response.message || 'Email verification failed');
          setLoading(false);
        }
      } catch (error: any) {
        toast.error(error?.message || 'Verification failed');
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Toaster position="top-right" richColors closeButton />
      
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-yellow-200/50">
          {loading && !verified ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
              <p className="text-gray-600">Please wait while we verify your email...</p>
            </div>
          ) : verified ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified</h1>
              <p className="text-gray-600 mb-6">Your email has been verified successfully!</p>
              <p className="text-sm text-gray-500">Redirecting to login...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
              <p className="text-gray-600 mb-6">Your verification link may have expired or is invalid.</p>
              <Link
                href="/register"
                className="inline-block px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                Register Again
              </Link>
            </div>
            )}
            </div>
            </div>
            </div>
            );
            }

            export default function VerifyEmailPage() {
            return (
            <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center"><div className="text-gray-500">Verifying email...</div></div>}>
            <VerifyEmailContent />
            </Suspense>
            );
            }
