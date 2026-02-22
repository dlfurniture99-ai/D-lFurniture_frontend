'use client';

import Link from 'next/link';

interface SubCategory {
  name: string;
  items: string[];
}

interface MegaMenuProps {
  categoryName: string;
  subCategories: SubCategory[];
  isOpen: boolean;
}

export default function MegaMenu({
  categoryName,
  subCategories,
  isOpen,
}: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg z-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Colored sidebar */}
          <div className="hidden md:block w-20 bg-red-600 rounded-lg p-4 text-white">
            <p className="text-sm font-semibold">{categoryName}</p>
          </div>

          {/* Main menu items */}
          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {subCategories.map((subCategory, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                    {subCategory.name}
                  </h4>
                  <ul className="space-y-2">
                    {subCategory.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <Link
                          href={`/product/${item.toLowerCase().replace(/\s+/g, '-')}`}
                          className="text-gray-600 text-sm hover:text-yellow-600 hover:font-semibold transition"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
