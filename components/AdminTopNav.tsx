'use client';

import { HiOutlineBars3 } from 'react-icons/hi2';

interface AdminTopNavProps {
  onMenuToggle: () => void;
  title?: string;
}

export default function AdminTopNav({ onMenuToggle, title = 'Admin Dashboard' }: AdminTopNavProps) {
  return (
    <div className="h-16 md:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 lg:px-8 shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Toggle sidebar menu"
        >
          <HiOutlineBars3 className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-base sm:text-lg md:text-2xl font-bold text-gray-900 truncate">{title}</h1>
      </div>
      <div className="hidden sm:block text-xs md:text-sm text-gray-600 text-right">
        Welcome back, <span className="font-semibold text-gray-900">Admin</span>
      </div>
    </div>
  );
}
