'use client';

import { contactInfo } from '@/lib/contactConfig';

export default function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Shipping & Delivery Policy</h1>
        <p className="text-gray-600 mb-6">Last Updated: February 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Delivery Timeline</h2>
            <p className="text-gray-700 mb-4">
              We strive to deliver your orders within the promised timeframe. Standard delivery times are:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Metro Cities:</strong> 5-7 business days</li>
              <li><strong>Major Cities:</strong> 7-10 business days</li>
              <li><strong>Other Locations:</strong> 10-14 business days</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Delivery times are estimates and not guaranteed. Orders placed during weekends or holidays will be processed on the next business day.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Shipping Charges</h2>
            <p className="text-gray-700 mb-4">
              Free shipping is available on orders over ₹499. Orders below this amount will be charged a flat shipping fee of ₹99.
            </p>
            <p className="text-gray-700">
              Shipping charges are calculated based on delivery location and order weight.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Delivery Address</h2>
            <p className="text-gray-700 mb-4">
              Please ensure you provide accurate and complete delivery address. D&L Furnitech is not responsible for delays or non-delivery due to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Incorrect address information provided by customer</li>
              <li>Delivery address being inaccessible</li>
              <li>Customer not being available at the delivery address</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Order Tracking</h2>
            <p className="text-gray-700 mb-4">
              Once your order is dispatched, you will receive a tracking ID via email. You can track your shipment status on our website using this ID.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Undeliverable Orders</h2>
            <p className="text-gray-700 mb-4">
              If a parcel is returned as undeliverable, we will attempt redelivery. After two failed delivery attempts, the parcel will be returned to our warehouse at your expense.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Damaged or Missing Items</h2>
            <p className="text-gray-700 mb-4">
              In case of damaged or missing items:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Report within 48 hours of delivery</li>
              <li>Provide photographs of the damaged/missing item</li>
              <li>Keep the original packaging and protective materials</li>
              <li>We will arrange replacement or refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. International Shipping</h2>
            <p className="text-gray-700 mb-4">
              Currently, we offer shipping only within India. International shipping may be available upon request. Please contact us for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Delay in Delivery</h2>
            <p className="text-gray-700 mb-4">
              While we strive to meet delivery timelines, delays may occur due to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Unforeseen circumstances (weather, natural disasters)</li>
              <li>High order volume</li>
              <li>Third-party logistics provider delays</li>
            </ul>
            <p className="text-gray-700 mt-4">
              D&L Furnitech will not be held responsible for delays beyond our control. We will notify you of any significant delays.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For shipping-related inquiries, contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
              <p className="text-gray-700">
                <strong>Phone:</strong>{' '}
                <a href={`tel:${contactInfo.phone}`} className="text-yellow-600 hover:text-yellow-700">
                  {contactInfo.phone}
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong>{' '}
                <a href={`mailto:${contactInfo.email}`} className="text-yellow-600 hover:text-yellow-700">
                  {contactInfo.email}
                </a>
              </p>
              <p className="text-gray-700">
                <strong>Business Hours:</strong> {contactInfo.businessHours}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
