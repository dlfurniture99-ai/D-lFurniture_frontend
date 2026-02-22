'use client';

import Link from 'next/link';

export default function FeaturedCategories() {
  const categories = [
    {
      name: 'Sofas',
      slug: 'sofas',
      image: '/sofa.png',
      description: 'Comfortable and stylish seating',
    },
    {
      name: 'Beds',
      slug: 'beds',
      image: '/bed.png',
      description: 'Premium sleeping solutions',
    },
    {
      name: 'Dining Sets',
      slug: 'dining-sets',
      image: '/dinning.png',
      description: 'Elegant dining furniture',
    },
    {
      name: 'Storage',
      slug: 'storage',
      image: '/storage.jpg',
      description: 'Functional storage solutions',
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-gray-600">
            Explore our wide range of premium furniture collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={`/category/${category.slug}`}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer h-full flex flex-col">
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-6 flex-grow">{category.description}</p>
                  <span className="text-yellow-600 font-semibold hover:text-yellow-700">
                    Explore →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
