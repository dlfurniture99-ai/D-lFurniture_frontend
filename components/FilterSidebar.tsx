'use client';

import { useState } from 'react';

interface FilterState {
  priceRange: number;
  materials: string[];
  finishes: string[];
  seatingCapacity: string[];
  availability: string[];
  deliveryTime: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

export default function FilterSidebar({ filters, setFilters }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePriceChange = (value: number) => {
    setFilters({ ...filters, priceRange: value });
  };

  const handleMaterialChange = (material: string) => {
    const materials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    setFilters({ ...filters, materials });
  };

  const handleFinishChange = (finish: string) => {
    const finishes = filters.finishes.includes(finish)
      ? filters.finishes.filter((f) => f !== finish)
      : [...filters.finishes, finish];
    setFilters({ ...filters, finishes });
  };

  const handleSeatingChange = (seating: string) => {
    const seatingCapacity = filters.seatingCapacity.includes(seating)
      ? filters.seatingCapacity.filter((s) => s !== seating)
      : [...filters.seatingCapacity, seating];
    setFilters({ ...filters, seatingCapacity });
  };

  const handleAvailabilityChange = (availability: string) => {
    const availabilities = filters.availability.includes(availability)
      ? filters.availability.filter((a) => a !== availability)
      : [...filters.availability, availability];
    setFilters({ ...filters, availability: availabilities });
  };

  const handleDeliveryChange = (delivery: string) => {
    const deliveryTime = filters.deliveryTime.includes(delivery)
      ? filters.deliveryTime.filter((d) => d !== delivery)
      : [...filters.deliveryTime, delivery];
    setFilters({ ...filters, deliveryTime });
  };

  const FilterContent = () => (
    <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-24">
        {/* Filters Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-6">Filters</h3>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">
            Price Range
          </h4>
          <input
            type="range"
            min="0"
            max="100000"
            value={filters.priceRange}
            onChange={(e) => handlePriceChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>₹0</span>
            <span>₹{filters.priceRange.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Categories</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="sofas" 
                className="w-4 h-4 cursor-pointer" 
                checked={filters.materials.includes('sofas')}
                onChange={() => handleMaterialChange('sofas')}
              />
              <label htmlFor="sofas" className="cursor-pointer text-gray-700">
                Sofas
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="beds" 
                className="w-4 h-4 cursor-pointer" 
                checked={filters.materials.includes('beds')}
                onChange={() => handleMaterialChange('beds')}
              />
              <label htmlFor="beds" className="cursor-pointer text-gray-700">
                Beds
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="dining" 
                className="w-4 h-4 cursor-pointer" 
                checked={filters.materials.includes('dining-sets')}
                onChange={() => handleMaterialChange('dining-sets')}
              />
              <label htmlFor="dining" className="cursor-pointer text-gray-700">
                Dining
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="storage" 
                className="w-4 h-4 cursor-pointer" 
                checked={filters.materials.includes('storage')}
                onChange={() => handleMaterialChange('storage')}
              />
              <label htmlFor="storage" className="cursor-pointer text-gray-700">
                Storage
              </label>
            </li>
          </ul>
        </div>





        {/* Availability */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4 text-sm">Availability</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="instock" 
                className="w-4 h-4 cursor-pointer" 
                checked={filters.availability.includes('instock')}
                onChange={() => handleAvailabilityChange('instock')}
              />
              <label htmlFor="instock" className="cursor-pointer text-gray-700">
                In Stock
              </label>
            </li>
            <li className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="preorder" 
                className="w-4 h-4 cursor-pointer" 
                checked={filters.availability.includes('preorder')}
                onChange={() => handleAvailabilityChange('preorder')}
              />
              <label htmlFor="preorder" className="cursor-pointer text-gray-700">
                Pre-Order
              </label>
            </li>
          </ul>
        </div>


    </div>
  );

  return (
    <>
      {/* Mobile Filter Funnel Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 z-40 p-3 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition shadow-lg"
        title="Open Filters"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>

      {/* Mobile Filter Modal/Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg transition"
                title="Close Filters"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Filter Content */}
            <div className="p-6">
              <FilterContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filters */}
      <aside className="hidden lg:block w-64 pr-6">
        <FilterContent />
      </aside>
    </>
  );
}
