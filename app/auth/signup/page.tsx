import type { Metadata } from 'next';
import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';
import { IoArrowBack } from 'react-icons/io5';

export const metadata: Metadata = {
  title: 'Sign Up - D&L Furnitech',
  description: 'Create a new D&L Furnitech account',
};

export default function SignupPage() {
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
          <h1 className="text-4xl font-bold text-white mb-3">Join D&L Furnitech</h1>
          <p className="text-gray-400">
            Create an account to enjoy exclusive furniture collections and fast checkout
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">
          <SignupForm />
        </div>

        {/* Benefits */}
        <div className="mt-12 space-y-4">
          <div className="flex items-start gap-3">
            <div className="text-color-gold text-lg">✓</div>
            <p className="text-gray-300 text-sm">
              <strong>Quick Checkout:</strong> Save your information for faster purchases
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-color-gold text-lg">✓</div>
            <p className="text-gray-300 text-sm">
              <strong>Order History:</strong> Track all your orders in one place
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="text-color-gold text-lg">✓</div>
            <p className="text-gray-300 text-sm">
              <strong>Wishlist:</strong> Save your favorite furniture items
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
