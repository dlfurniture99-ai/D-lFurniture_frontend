'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { FaCheckCircle, FaBox, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/');
      return;
    }

    // Simulate order fetch - in real scenario, fetch from backend
    // For now, show a generic confirmation
    setLoading(false);
  }, [orderId, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 flex items-center justify-center">
        <div className="text-white text-xl">Loading order details...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-8 text-center">
            <FaCheckCircle className="w-20 h-20 text-white mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-green-50 text-lg">Your order has been placed successfully</p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Order ID Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-xl p-6">
              <p className="text-sm font-semibold text-gray-600 uppercase mb-1">Order ID</p>
              <p className="text-3xl font-bold text-yellow-600 font-mono break-all">{orderId}</p>
              <p className="text-sm text-gray-600 mt-3">Save this ID for your records</p>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FaBox className="text-yellow-500" />
                What Happens Next?
              </h2>
              
              <div className="space-y-3">
                {[
                  { step: 1, title: 'Order Confirmed', desc: 'Your order has been received', icon: '✓', color: 'bg-green-500' },
                  { step: 2, title: 'Payment Arrangement', desc: 'Our team will contact you about Cash on Delivery', icon: '📞', color: 'bg-blue-500' },
                  { step: 3, title: 'Preparation', desc: 'We will prepare your order for delivery', icon: '📦', color: 'bg-purple-500' },
                  { step: 4, title: 'Delivery', desc: 'Your order will be delivered soon', icon: '🚚', color: 'bg-yellow-500' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`${item.color} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 mt-1`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-3">Important Information</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>A confirmation email has been sent to your registered email address</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>You will pay cash when the delivery person arrives at your location</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Our team will contact you within 24 hours with delivery details</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Please verify the product condition before making the payment</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaPhone className="text-yellow-500" />
                  Contact Support
                </h3>
                <p className="text-gray-600 text-sm">
                  If you have any questions about your order, please contact our support team.
                </p>
                <a href="tel:+918562875794" className="text-yellow-600 font-semibold mt-2 inline-block">
                  +91 85628 75794
                </a>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-yellow-500" />
                  Track Your Order
                </h3>
                <p className="text-gray-600 text-sm">
                  You can track your order status in your account dashboard.
                </p>
                <Link href="/my-orders" className="text-yellow-600 font-semibold mt-2 inline-block">
                  View My Orders →
                </Link>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <Link
                href="/"
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition text-center"
              >
                Continue Shopping
              </Link>
              <Link
                href="/my-orders"
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
              >
                View My Orders
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
          <h3 className="text-white font-bold mb-3">Need Help?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Check out our FAQ or contact our support team if you have any questions about your order.
          </p>
          <div className="flex gap-3">
            <Link
              href="/faq"
              className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm"
            >
              Visit FAQ
            </Link>
            <span className="text-gray-500">•</span>
            <Link
              href="/contact-us"
              className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
