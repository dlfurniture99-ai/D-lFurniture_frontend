'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cartStore, CartItem } from '@/lib/cartStore';
import { toast, Toaster } from 'sonner';
import { userApi } from '@/app/apis/config';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showPhoneField, setShowPhoneField] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // Check authentication first
    const user = localStorage.getItem('user');
    
    if (!user) {
      // Not logged in - redirect to login
      toast.error('Please login to proceed with checkout');
      setTimeout(() => {
        router.push('/login?redirect=/checkout');
      }, 1000);
      return;
    }

    setIsChecking(false);
    setIsAuthenticated(true);
    
    // Get cart items
    const items = cartStore.getCart();
    setCartItems(items);
    setTotal(cartStore.getTotal());

    // Get user data from localStorage
    if (user) {
      const userData = JSON.parse(user);
      setUserData(userData);

      // Pre-fill form with user data
      const [firstName, ...lastNameParts] = userData.name.split(' ');
      setFormData({
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });

      // Show phone field only if user doesn't have one
      setShowPhoneField(!userData.phone);
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCODOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.address) {
      toast.error('Address is required');
      return;
    }

    if (showPhoneField && !formData.phone) {
      toast.error('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.post('payment/place-cod-order', {
        cartItems: cartItems.map(item => ({
          productId: item._id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData.address,
        phone: formData.phone || userData?.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      if (response.success) {
        toast.success('Order placed successfully! Check your email for confirmation.');
        cartStore.clearCart();
        setTimeout(() => {
          router.push(`/order-confirmation?orderId=${response.data.bookingId}`);
        }, 1500);
      } else {
        toast.error(response.message || 'Failed to place COD order');
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to place COD order');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.address) {
      toast.error('Address is required');
      return;
    }

    if (showPhoneField && !formData.phone) {
      toast.error('Phone number is required');
      return;
    }

    setLoading(true);

    try {
      // Create order on backend
      const orderResponse = await userApi.post('payment/create-order', {
        amount: total,
        cartItems: cartItems.map(item => ({
          // Use MongoDB ID if available, otherwise use the numeric id
          // The backend will look up the product if needed
          productId: item._id || item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: formData.address,
        phone: formData.phone || userData?.phone,
      });

      if (!orderResponse.success) {
        toast.error(orderResponse.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      // Load Razorpay script
      console.log('📝 Starting script load, env key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('✓ Razorpay script loaded successfully');
        const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        console.log('keyId:', keyId);
        
        if (!keyId) {
          toast.error('Razorpay configuration missing. Please check environment variables.');
          setLoading(false);
          return;
        }

        const razorpayOptions = {
          key: keyId,
          amount: total * 100, // Amount in paise
          currency: 'INR',
          order_id: orderResponse.data.orderId,
          name: 'D&L Furnitech',
          description: `Order for ${cartItems.length} item(s)`,
          image: '/logo.jpg',
          handler: async (response: any) => {
            try {
              // Verify payment on backend
              const verifyResponse = await userApi.post('payment/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.success) {
                toast.success('Payment successful!');
                cartStore.clearCart();
                setTimeout(() => {
                  router.push(`/order-confirmation?orderId=${verifyResponse.data.bookingId}`);
                }, 1000);
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error: any) {
              toast.error(error?.message || 'Payment verification error');
            }
            setLoading(false);
          },
          prefill: {
            name: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            contact: formData.phone || userData?.phone,
          },
          notes: {
            address: formData.address,
          },
          theme: {
            color: '#FBBF24',
          },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.open();
      };
      
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        toast.error('Failed to load Razorpay gateway');
        setLoading(false);
      };

      console.log('📤 Appending script to document');
      document.body.appendChild(script);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to proceed to payment');
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </main>
    );
  }

  // Redirect if not authenticated (this will be handled in useEffect, but just in case)
  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add items to your cart to proceed with checkout
          </p>
          <Link
            href="/"
            className="inline-block bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <Toaster position="top-right" richColors closeButton />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-yellow-500">
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-yellow-500">
            Cart
          </Link>
          <span>/</span>
          <span>Checkout</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={paymentMethod === 'cod' ? handleCODOrder : handleProceedToPayment} className="space-y-8">
              {/* Payment Method Selection */}
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Method
                </h2>
                
                <div className="space-y-3">
                  {/* Razorpay Option */}
                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                    paymentMethod === 'razorpay' 
                      ? 'border-yellow-600 bg-yellow-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="razorpay"
                      checked={paymentMethod === 'razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'razorpay')}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Online Payment (Razorpay)</p>
                      <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Wallet</p>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition ${
                    paymentMethod === 'cod' 
                      ? 'border-yellow-600 bg-yellow-50' 
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <div className="ml-3">
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">Pay when your order is delivered</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Delivery Details Section */}
              <div className="bg-white rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Delivery Details
                </h2>

                {/* User Info (Display Only) */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                        Name
                      </label>
                      <p className="text-gray-900 font-medium">{formData.firstName} {formData.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase">
                        Email
                      </label>
                      <p className="text-gray-900 font-medium">{formData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Phone Number (Only if not available) */}
                {showPhoneField && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="e.g., 9876543210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 bg-white text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                )}

                {/* Address (Editable) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    placeholder="Enter your complete delivery address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-yellow-600 focus:ring-2 focus:ring-yellow-200 bg-white text-gray-900 placeholder-gray-400 resize-none"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Include house number, street, city, and pincode</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
               type="submit"
               disabled={loading}
               className="w-full bg-yellow-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
               {loading ? (
                 <>
                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                   Processing...
                 </>
               ) : paymentMethod === 'cod' ? (
                 'Place Order (Cash on Delivery)'
               ) : (
                 'Proceed to Payment'
               )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      ₹{((item.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">₹0</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-yellow-500">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-gray-700">
                {paymentMethod === 'cod' ? (
                  <>
                    <p className="mb-2">✓ Pay with cash on delivery</p>
                    <p className="mb-2">✓ No upfront payment required</p>
                    <p>✓ Confirmation email will be sent</p>
                  </>
                ) : (
                  <>
                    <p className="mb-2">✓ Secure payment with Razorpay</p>
                    <p className="mb-2">✓ Multiple payment options</p>
                    <p>✓ Safe & encrypted transactions</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
