'use client';



import { FiUser as FaUser, FiUserCheck as FaFemale, FiStar as FaStar } from 'react-icons/fi';
export default function Testimonials() {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      city: 'Mumbai',
      rating: 5,
      text: 'Amazing quality furniture! My entire living room is from The Wooden Space. Highly recommended!',
      icon: FaUser,
    },
    {
      name: 'Priya Singh',
      city: 'Delhi',
      rating: 5,
      text: 'The craftsmanship is outstanding. Delivery was quick and furniture arrived in perfect condition.',
      icon: FaFemale,
    },
    {
      name: 'Vikram Patel',
      city: 'Bangalore',
      rating: 5,
      text: 'Best investment for my home. The durability and design are unmatched at this price point.',
      icon: FaUser,
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => {
            const IconComponent = testimonial.icon;
            return (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl text-yellow-600">
                  <IconComponent size={32} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.city}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    <FaStar size={16} />
                  </span>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">"{testimonial.text}"</p>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}
