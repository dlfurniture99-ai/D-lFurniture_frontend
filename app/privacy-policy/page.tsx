'use client';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-6">Last Updated: February 2024</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              D&L Furnitech ("we," "our," or "us") operates the website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
            <p className="text-gray-700 mb-4">We may collect information about you in a variety of ways, including:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Personal Data:</strong> Name, email address, phone number, shipping address, billing address</li>
              <li><strong>Payment Information:</strong> Credit/debit card details (processed securely)</li>
              <li><strong>Account Data:</strong> Login credentials, profile information</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages visited, time spent</li>
              <li><strong>Cookies:</strong> Small files stored on your device for functionality</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the collected information for:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Processing orders and payments</li>
              <li>Delivering products and services</li>
              <li>Sending order confirmations and updates</li>
              <li>Responding to customer inquiries</li>
              <li>Marketing and promotional communications (with consent)</li>
              <li>Improving website functionality and user experience</li>
              <li>Fraud prevention and security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Protection</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All payment information is encrypted and processed securely.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Third-Party Sharing</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal data. We may share information with:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Payment processors (for transaction processing)</li>
              <li>Logistics partners (for delivery)</li>
              <li>Service providers (hosting, analytics)</li>
              <li>Legal authorities (if required by law)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies to enhance your experience. You can control cookie settings in your browser. Disabling cookies may affect website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For privacy concerns or to exercise your rights, contact us at:
            </p>
            <p className="text-gray-700">
              Email: privacy@dandlfurnitech.com<br/>
              Address: D&L Furnitech, India
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
