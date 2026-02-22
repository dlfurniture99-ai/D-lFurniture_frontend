'use client';

export default function TrustBadges() {
  const badges = [
    {
      icon: '🌳',
      title: '100% Solid Wood',
      description: 'Crafted from premium, sustainably sourced wood',
    },
    {
      icon: '🛡️',
      title: '5 Year Warranty',
      description: 'Complete peace of mind with comprehensive coverage',
    },
    {
      icon: '🚚',
      title: 'Free Delivery',
      description: 'Complimentary shipping on all orders across India',
    },
    {
      icon: '✨',
      title: '100% Customizable',
      description: 'Choose dimensions, colors, and finishes to match your style',
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Craftic Furnitures
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{badge.icon}</span>
                </div>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">{badge.title}</h4>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
