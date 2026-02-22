'use client';

export default function SaleBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-neutral-950 to-neutral-900 py-12 md:py-16 rounded-xl my-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl md:text-4xl font-bold text-yellow-500 mb-2">
            Big Savings
          </h3>
          <p className="text-yellow-400 text-lg">
            Limited time offer on all furniture categories
          </p>
        </div>
        <button className="bg-yellow-600 text-neutral-950 px-8 py-4 rounded-lg font-bold hover:bg-yellow-500 transition text-lg whitespace-nowrap">
          Explore Deals
        </button>
      </div>
    </section>
  );
}
