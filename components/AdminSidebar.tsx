'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  HiOutlineChartBar,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineHome,
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineArrowRightOnRectangle
} from 'react-icons/hi2';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: HiOutlineHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: HiOutlineCube, label: 'Products', path: '/admin/dashboard/products' },
    { icon: HiOutlineShoppingBag, label: 'Orders', path: '/admin/dashboard/orders' },
    { icon: HiOutlineTruck, label: 'Delivery Boys', path: '/admin/dashboard/delivery-boys' },
    { icon: HiOutlineUsers, label: 'Customers', path: '/admin/dashboard/customers' },
    { icon: HiOutlineChartBar, label: 'Analytics', path: '/admin/dashboard/analytics' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const handleNavigate = (path: string) => {
    router.push(path);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onToggle} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="h-20 border-b border-gray-200 flex items-center justify-center px-4">
          <Image
            src="/logo.jpg"
            alt="The Wooden Space"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto h-[calc(100vh-160px)]">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path) ? 'bg-yellow-50 text-yellow-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <button 
            onClick={() => handleNavigate('/admin/dashboard/settings')}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition"
          >
            <HiOutlineCog6Tooth className="w-5 h-5 flex-shrink-0" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            <HiOutlineArrowRightOnRectangle className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
