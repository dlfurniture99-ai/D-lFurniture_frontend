'use client';

import { FiTool as GiToolbox, FiGlobe as GiEarthAmerica, FiHeart as FaHeartFA } from 'react-icons/fi';
import Image from 'next/image';




export default function AboutPage() {
  return (
    <div className="w-full">

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-neutral-950 to-neutral-900 py-16 pt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-yellow-500 mb-4">About D&L Furnitech</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Discover the passion and craftsmanship behind D&L Furnitech - Where tradition meets contemporary design
          </p>
        </div>
      </section>

      {/* Owners Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Meet Our Founders</h2>
          
          <div className="flex flex-col items-center justify-center">
            {/* Combined Owners Photo */}
            <div className="rounded-lg overflow-hidden shadow-2xl mb-8 flex items-center justify-center bg-gray-100 max-w-2xl">
              <Image
                src="/owner.jpg"
                alt="Our Founders"
                width={600}
                height={500}
                className="object-contain"
              />
            </div>
            
            <div className="max-w-2xl text-center">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">Founders of D&L Furnitech</h3>
              <p className="text-yellow-400 font-semibold mb-6 text-lg">Co-Founders & Visionaries</p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Our founders bring together decades of experience in furniture design, craftsmanship, and sustainable business practices. With their combined vision of blending traditional woodworking techniques with modern aesthetics, they have built D&L Furnitech into a trusted name in the industry. Their passion for quality, dedication to customer satisfaction, and commitment to excellence form the foundation of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Story</h2>
          
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              D&L Furnitech was born from a simple yet powerful dream: to create furniture that not only beautifies homes but also tells a story of craftsmanship, dedication, and love for our craft. Our founders, driven by their passion for traditional woodworking, decided to bridge the gap between heritage and modernity.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Starting from a small workshop with just a handful of artisans, we have grown into a trusted name in the furniture industry. Every piece that leaves our facility is a testament to the countless hours of work, the quality materials we source, and the expertise of our skilled craftspeople. We believe that furniture is not just about filling spaces—it's about creating memories and providing comfort to families.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Our journey hasn't been easy, but the challenges have only strengthened our resolve. We've faced countless obstacles, from sourcing sustainable materials to maintaining our commitment to quality during rapid growth. Yet, with each hurdle, we've learned something valuable that has made us better.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              What drives us today is the same passion that started it all: the desire to create furniture that transforms spaces and improves lives. We're not just building furniture; we're building relationships with our customers and contributing to their journey of creating beautiful homes and workplaces.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed">
              Today, D&L Furnitech stands as a symbol of quality, innovation, and customer-centricity. We're proud of what we've accomplished, but we're even more excited about the future. With every new design, every customer interaction, and every piece of feedback, we're evolving and growing stronger.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-yellow-500 font-semibold text-center italic text-lg">
                "Crafted with passion, designed with love, built to last forever."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="text-center p-8 rounded-lg bg-neutral-900 hover:shadow-lg transition">
              <div className="text-5xl mb-4 text-yellow-500">
                <GiToolbox size={50} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">Craftsmanship</h3>
              <p className="text-neutral-400">
                Every piece is crafted with meticulous attention to detail, ensuring superior quality and durability that stands the test of time.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center p-8 rounded-lg bg-neutral-900 hover:shadow-lg transition">
              <div className="text-5xl mb-4 text-yellow-500">
                <GiEarthAmerica size={50} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">Sustainability</h3>
              <p className="text-neutral-400">
                We are committed to using sustainable materials and eco-friendly practices to protect our environment for future generations.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center p-8 rounded-lg bg-neutral-900 hover:shadow-lg transition">
              <div className="text-5xl mb-4 text-yellow-500">
                <FaHeartFA size={50} className="mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-yellow-500 mb-4">Customer First</h3>
              <p className="text-neutral-400">
                Our customers are at the heart of everything we do. Their satisfaction and trust are the measures of our success.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
