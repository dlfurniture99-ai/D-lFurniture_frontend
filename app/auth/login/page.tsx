import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { IoArrowBack } from 'react-icons/io5';

export const metadata: Metadata = {
  title: 'Login - D&L Furnitech',
  description: 'Login to your D&L Furnitech account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pt-32 pb-12 px-4">
      <div className="max-w-md mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-color-gold hover:text-color-gold-light transition mb-8"
        >
          <IoArrowBack size={20} />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Welcome Back</h1>
          <p className="text-gray-400">
            Sign in to your D&L Furnitech account to continue shopping
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
          <LoginForm />
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-color-gold font-semibold mb-2">Secure</p>
            <p className="text-gray-400 text-sm">256-bit SSL encrypted</p>
          </div>
          <div>
            <p className="text-color-gold font-semibold mb-2">Fast</p>
            <p className="text-gray-400 text-sm">Instant order processing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
