'use client';

import { FaBars } from 'react-icons/fa';

interface AdminTopNavProps {
  onMenuToggle: () => void;
  title?: string;
}

export default function AdminTopNav({ onMenuToggle, title = 'Admin Dashboard' }: AdminTopNavProps) {
  return (
    <div className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <FaBars className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="text-sm text-gray-600">
        Welcome back, <span className="font-semibold text-gray-900">Admin</span>
      </div>
    </div>
  );
}
