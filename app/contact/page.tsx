'use client';

import { FiPhone as FaPhone, FiMail as FaEnvelope, FiMapPin as FaMapMarkerAlt, FiMessageCircle as FaWhatsapp, FiX as FaTimes } from 'react-icons/fi';
import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


export default function ContactPage() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const whatsappNumber = '8562875794';

  const openWhatsAppDirect = () => {
    const message = encodeURIComponent('Hello, I would like to know more about D&L FurniTech furniture.');
    window.open(`https://wa.me/91${whatsappNumber}?text=${message}`, '_blank');
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hi! My name is ${formData.name}. Phone: ${formData.phone}. Message: ${formData.message}`;
    window.open(`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setShowModal(false);
    setFormData({ name: '', phone: '', message: '' });
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-neutral-950 to-neutral-900 py-20 pt-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-500 mb-6">Contact Us</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Get in touch with D&L FurniTech - We're here to help you find the perfect furniture for your home
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Phone */}
            <div className="text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition">
              <div className="text-5xl text-yellow-600 mb-4 flex justify-center">
                <FaPhone size={50} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Call Us</h3>
              <p className="text-gray-600 mb-3">
                Get instant support from our team
              </p>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">+91 8562875794</p>
                <p className="text-lg font-semibold text-gray-900">+91 8890840926</p>
              </div>
            </div>

            {/* Email */}
            <div className="text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition">
              <div className="text-5xl text-yellow-600 mb-4 flex justify-center">
                <FaEnvelope size={50} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Email Us</h3>
              <p className="text-gray-600 mb-3">
                Send us your queries and feedback
              </p>
              <p className="text-lg font-semibold text-gray-900">support@dlafurnitech.com</p>
            </div>

            {/* Location */}
            <div className="text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition">
              <div className="text-5xl text-yellow-600 mb-4 flex justify-center">
                <FaMapMarkerAlt size={50} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visit Us</h3>
              <p className="text-gray-600 mb-3">
                Find us at our showroom
              </p>
              <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                D&L FurniTech<br />
                Premium Furniture Store<br />
                India
              </p>
            </div>
          </div>

          {/* WhatsApp Chat Support */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-12 text-center border-2 border-green-200">
            <div className="text-6xl text-green-500 mb-6 flex justify-center">
              <FaWhatsapp size={80} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Chat Support on WhatsApp</h2>
            <p className="text-lg text-gray-600 mb-8">
              Get instant responses from our support team. Click below to start a conversation
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg transition duration-300 flex items-center justify-center gap-3 text-lg shadow-lg mx-auto"
            >
              <FaWhatsapp size={28} />
              Start Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">About D&L FurniTech</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-6 text-gray-700 leading-relaxed text-justify">
            <p>
              Welcome to D&L FurniTech, your ultimate destination for premium, handcrafted solid wood furniture in India. With over two decades of expertise in furniture manufacturing and design, D&L FurniTech has established itself as a trusted name in delivering exceptional quality furniture that combines traditional craftsmanship with contemporary aesthetics. Our commitment to excellence and customer satisfaction has made us the preferred choice for thousands of homeowners and interior designers across India.
            </p>

            <p>
              At D&L FurniTech, we understand that furniture is more than just a functional element of your home—it's a reflection of your personal style and taste. That's why we meticulously craft each piece using only the finest materials, including premium solid woods like sheesham, mango wood, and teak. Our skilled artisans bring decades of experience to every project, ensuring that every furniture piece meets our stringent quality standards and exceeds customer expectations.
            </p>

            <p>
              Our extensive collection at D&L FurniTech includes sofas, beds, dining sets, storage solutions, office furniture, and decorative pieces designed for every room in your home. Whether you're looking for modern minimalist designs or classic traditional styles, our diverse range caters to all aesthetic preferences and budgets. We offer customization options to ensure that your furniture perfectly matches your specific requirements and interior design vision.
            </p>

            <p>
              Customer satisfaction is at the heart of D&L FurniTech's operations. We pride ourselves on providing exceptional customer service, from initial consultation to post-purchase support. Our dedicated team is available 24/7 to assist you with product selection, customization options, delivery arrangements, and after-sales service. We also offer comprehensive warranty coverage on all our furniture products, demonstrating our confidence in their durability and quality.
            </p>

            <p>
              D&L FurniTech is committed to sustainability and ethical manufacturing practices. We source our materials responsibly and employ eco-friendly production methods to minimize our environmental impact. Our transparent business practices and competitive pricing make premium quality furniture accessible to everyone. Contact D&L FurniTech today to explore our collection, get expert advice from our furniture specialists, and transform your living spaces with furniture that combines style, comfort, and longevity. Experience the D&L FurniTech difference—where quality craftsmanship meets innovative design.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={24} />
            </button>

            <div className="text-center mb-6">
              <FaWhatsapp size={50} className="text-green-500 mx-auto mb-3" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Us on WhatsApp</h2>
              <p className="text-gray-600 text-sm mt-2">Send us your details and we'll get back to you shortly</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={4}
                  placeholder="Tell us how we can help..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaWhatsapp size={20} />
                Send on WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
