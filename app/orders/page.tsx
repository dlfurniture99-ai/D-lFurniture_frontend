import type { Metadata } from 'next';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';

export const metadata: Metadata = {
  title: 'My Orders - D&L Furnitech',
  description: 'View your orders on D&L Furnitech',
};

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-color-gold hover:text-color-gold-light transition mb-8"
        >
          <IoArrowBack size={20} />
          Back to Account
        </Link>

        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-8">My Orders</h1>

        {/* Empty State */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Orders Yet</h2>
          <p className="text-gray-400 mb-6">
            You haven't placed any orders yet. Start exploring our furniture collections!
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-color-gold text-black rounded font-semibold hover:bg-color-gold-light transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Placeholder for orders list */}
        <div className="mt-8 text-gray-400 text-center text-sm">
          <p>Orders will appear here once you make a purchase.</p>
        </div>
      </div>
    </div>
  );
}
