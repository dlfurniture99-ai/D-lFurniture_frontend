'use client';

import { FiChevronDown as FaChevronDown } from 'react-icons/fi';
import { useState } from 'react';


export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What types of wood do you use?",
      answer: "We use premium solid wood from sustainable forests, including teak, sheesham, mango wood, and acacia wood. Each type of wood is selected for its durability and aesthetic appeal."
    },
    {
      question: "Do you offer customization?",
      answer: "Yes! We offer customization for dimensions, upholstery color, and wood finish. Contact our team for custom furniture solutions tailored to your needs."
    },
    {
      question: "What is your delivery timeline?",
      answer: "Standard delivery takes 5-14 business days depending on your location. Metro cities receive delivery in 5-7 days, while other locations may take up to 14 days."
    },
    {
      question: "Is shipping free?",
      answer: "Free shipping is available on orders over ₹499. Orders below ₹499 will be charged a flat shipping fee of ₹99."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is dispatched, you'll receive a tracking ID via email. Use this ID on our website to track your shipment in real-time."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return window from delivery date. Products must be in original, unused condition with all packaging to be eligible."
    },
    {
      question: "Do you offer warranty?",
      answer: "All furniture comes with a 1-year manufacturing defect warranty. This covers structural defects, upholstery issues, and hardware problems."
    },
    {
      question: "Can I assemble the furniture myself?",
      answer: "Yes, furniture comes with assembly instructions. We also offer paid assembly services in select locations. Contact us for details."
    },
    {
      question: "Do you deliver outside India?",
      answer: "Currently, we ship only within India. International shipping may be available upon request. Contact us for more information."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely."
    },
    {
      question: "How do I cancel my order?",
      answer: "Orders can be cancelled within 24 hours of placement. After that, contact our customer service team immediately."
    },
    {
      question: "What should I do if I receive a damaged product?",
      answer: "Report the damage within 48 hours of delivery with photographs. We'll arrange a free replacement or refund at no cost."
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h1>
        <p className="text-gray-600 text-center mb-12">Find answers to common questions about our furniture and services</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900 text-left">{faq.question}</h3>
                <FaChevronDown 
                  className={`text-yellow-600 transition-transform ${activeIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {activeIndex === index && (
                <div className="p-6 bg-white border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Didn't find your answer?</h3>
          <p className="text-gray-700 mb-4">
            Our customer service team is here to help! Contact us via email or phone.
          </p>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> support@dandlfurnitech.com</p>
            <p><strong>Phone:</strong> +91-XXXX-XXXX-XXXX</p>
            <p><strong>Hours:</strong> Monday - Friday, 10 AM - 6 PM IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
