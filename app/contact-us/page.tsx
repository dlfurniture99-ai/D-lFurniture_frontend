'use client';

import { FiPhone as FaPhone, FiMail as FaEnvelope, FiMapPin as FaMapMarkerAlt, FiClock as FaClock } from 'react-icons/fi';
import { useState } from 'react';
import { toast } from 'sonner';
import { contactInfo } from '@/lib/contactConfig';


export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Send email or API call here
      toast.success('Thank you! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 text-center mb-12">We're here to help! Reach out with any questions or feedback.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <FaPhone className="text-yellow-600 text-2xl" />
              <h3 className="text-lg font-bold">Call Us</h3>
            </div>
            <a href={`tel:${contactInfo.phone}`} className="text-gray-700 hover:text-yellow-600 font-semibold">
              {contactInfo.phone}
            </a>
            <p className="text-sm text-gray-600 mt-2">{contactInfo.businessHours}</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <FaEnvelope className="text-yellow-600 text-2xl" />
              <h3 className="text-lg font-bold">Email Us</h3>
            </div>
            <a href={`mailto:${contactInfo.email}`} className="text-gray-700 hover:text-yellow-600 font-semibold">
              {contactInfo.email}
            </a>
            <p className="text-sm text-gray-600 mt-2">We'll respond within 24 hours</p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <FaMapMarkerAlt className="text-yellow-600 text-2xl" />
              <h3 className="text-lg font-bold">Visit Us</h3>
            </div>
            <p className="text-gray-700 font-semibold">The Wooden Space</p>
            <p className="text-sm text-gray-600 mt-2">{contactInfo.address}</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900"
                placeholder="+91-XXXXXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-gray-900 resize-none"
                placeholder="Tell us more..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
