'use client';

import { useState } from 'react';

interface RazorpayButtonProps {
  amount: number; // Amount in INR
  user?: {
    name: string;
    email: string;
    contact: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RazorpayButton({ amount, user }: RazorpayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // 1. Create Order
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error('Server error: Failed to create order');
      }

      const { order } = data;

      // 2. Initialize Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: 'D&L Furnitech',
        description: 'Furniture Purchase',
        image: '/logo.jpg', // Ensure this path is correct in your public folder
        order_id: order.id,
        handler: async function (response: any) {
          // 3. Verify Payment on Backend
          const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            alert('Payment Successful!');
            // Redirect to success page or clear cart here
          } else {
            alert('Payment Verification Failed');
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.contact || '',
        },
        theme: {
          color: '#D4AF37',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      paymentObject.on('payment.failed', function (response: any){
        alert(`Payment Failed: ${response.error.description}`);
      });

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Something went wrong while initializing payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
    >
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
}