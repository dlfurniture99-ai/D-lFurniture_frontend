'use client';

import { contactInfo } from '@/lib/contactConfig';

export default function ReturnsPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Returns & Exchange Policy</h1>
        <p className="text-gray-600 mb-6">Last Updated: February 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Return Window</h2>
            <p className="text-gray-700 mb-4">
              We offer a 30-day return window from the date of delivery. Products must be in original condition with all packaging and accessories to be eligible for return.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Eligibility for Return</h2>
            <p className="text-gray-700 mb-4">
              Products are eligible for return if they meet the following criteria:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Returned within 30 days of delivery</li>
              <li>Product is in original, unused condition</li>
              <li>All original packaging, tags, and accessories are included</li>
              <li>Product shows no signs of wear or damage (beyond normal handling)</li>
              <li>Receipt/order confirmation is provided</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Non-Returnable Items</h2>
            <p className="text-gray-700 mb-4">
              The following items cannot be returned:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Custom or personalized furniture</li>
              <li>Clearance or final sale items</li>
              <li>Items used or assembled</li>
              <li>Items with visible damage caused by customer</li>
              <li>Items missing original packaging or parts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Return Process</h2>
            <p className="text-gray-700 mb-4">
              To initiate a return:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-gray-700">
              <li>Contact our customer service within 30 days of delivery</li>
              <li>Provide order number and reason for return</li>
              <li>Obtain return authorization and shipping label</li>
              <li>Package the item securely with all original materials</li>
              <li>Ship the item to our designated return address</li>
              <li>We will inspect and process your return</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Refunds</h2>
            <p className="text-gray-700 mb-4">
              Upon approval of your return:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Refunds will be processed within 7-10 business days</li>
              <li>Refund amount includes product price (original shipping charges non-refundable)</li>
              <li>Return shipping costs are borne by the customer unless item is defective</li>
              <li>Refunds will be credited to the original payment method</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Exchanges</h2>
            <p className="text-gray-700 mb-4">
              We offer exchanges for damaged or defective items:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Exchanges are processed at no additional cost if item is defective</li>
              <li>Exchanges must be initiated within 30 days of delivery</li>
              <li>We will arrange pickup of the defective item</li>
              <li>Replacement will be shipped upon receipt of returned item</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Defective Products</h2>
            <p className="text-gray-700 mb-4">
              If you receive a defective product:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Report within 48 hours of delivery</li>
              <li>Provide photographs showing the defect</li>
              <li>Keep original packaging and protective materials</li>
              <li>We will arrange free replacement or refund</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Warranty</h2>
            <p className="text-gray-700 mb-4">
              All furniture items come with a 1-year manufacturing defect warranty covering:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Structural defects in wood or frame</li>
              <li>Defects in upholstery material</li>
              <li>Defects in hardware or fasteners</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Warranty does not cover normal wear and tear, misuse, or damage from accidents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For returns or exchanges, contact us:
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
