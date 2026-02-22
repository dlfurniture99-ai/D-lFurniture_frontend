'use client';

import Link from 'next/link';
import { FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h5 className="text-white font-bold mb-4">About D&L Furnitech</h5>
            <p className="text-sm leading-relaxed mb-4">
              D&L Furnitech brings you premium, solid wood furniture that
              combines tradition with contemporary design.
            </p>
            <p className="text-xs text-gray-400">
             © 2024 D&L Furnitech. All rights reserved.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h5 className="text-white font-bold mb-4">Categories</h5>
            <ul className="text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Sofas & Seating
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Beds & Mattresses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Dining Sets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Storage & Cabinets
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-yellow-500 transition">
                  Office Furniture
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h5 className="text-white font-bold mb-4">Customer Service</h5>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/contact-us" className="hover:text-yellow-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-yellow-500 transition">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns-policy" className="hover:text-yellow-500 transition">
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-yellow-500 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/warranty-policy" className="hover:text-yellow-500 transition">
                  Warranty
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h5 className="text-white font-bold mb-4">Connect With Us</h5>
            <div className="flex gap-3 mb-6">
              <a
                href="https://www.instagram.com/wooden_space_udaipur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-600 transition text-white"
                title="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/dipesh-malviya-5bb91b206/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-yellow-600 transition text-white"
                title="LinkedIn"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
            <div className="text-sm">
              <p className="mb-2 font-semibold text-white">Newsletter Signup</p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 bg-gray-800 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-600 mb-2"
              />
              <button className="w-full bg-yellow-600 text-black py-2 rounded font-semibold hover:bg-yellow-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400 mb-6">
            <p className="flex items-center justify-center gap-1">
              D&L Furnitech © 2024. All rights reserved. | Handcrafted
              with <FaHeart size={14} className="text-red-500" /> in India
            </p>
            <div className="flex flex-wrap gap-6 justify-center md:justify-end">
              <Link href="/privacy-policy" className="hover:text-gray-300 transition">
                Privacy Policy
              </Link>
              <Link href="/terms-conditions" className="hover:text-gray-300 transition">
                Terms & Conditions
              </Link>
              <Link href="/warranty-policy" className="hover:text-gray-300 transition">
                Warranty
              </Link>
              <Link href="/returns-policy" className="hover:text-gray-300 transition">
                Returns
              </Link>
              <Link href="/shipping-policy" className="hover:text-gray-300 transition">
                Shipping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
