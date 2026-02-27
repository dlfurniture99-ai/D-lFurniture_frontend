'use client';

import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { FaTachometerAlt, FaBox, FaShoppingCart, FaUsers, FaChartBar, FaCog, FaSignOutAlt, FaTruck } from 'react-icons/fa';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: FaTachometerAlt, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FaBox, label: 'Products', path: '/admin/dashboard/products' },
    { icon: FaShoppingCart, label: 'Orders', path: '/admin/dashboard/orders' },
    { icon: FaTruck, label: 'Delivery Boys', path: '/admin/dashboard/delivery-boys' },
    { icon: FaUsers, label: 'Customers', path: '/admin/dashboard/customers' },
    { icon: FaChartBar, label: 'Analytics', path: '/admin/dashboard/analytics' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin');
  };

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col fixed h-screen max-sm:${!isOpen ? 'w-0' : 'w-full'} max-sm:z-50`}>
      {/* Logo */}
      <div className="h-20 border-b border-gray-200 flex items-center justify-center">
        {isOpen ? (
          <Image 
            src="/logo.jpg" 
            alt="The Wooden Space" 
            width={48}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        ) : (
          <div className="text-center">
            <div className="font-bold text-lg text-yellow-600">TWS</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.path)
                ? 'bg-yellow-50 text-yellow-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className={`${!isOpen && 'hidden'}`}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button className={`w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition ${!isOpen && 'justify-center'}`}>
          <FaCog className="w-5 h-5 flex-shrink-0" />
          <span className={`${!isOpen && 'hidden'}`}>Settings</span>
        </button>
        <button 
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium ${!isOpen && 'justify-center'}`}
        >
          <FaSignOutAlt className="w-5 h-5 flex-shrink-0" />
          <span className={`${!isOpen && 'hidden'}`}>Logout</span>
        </button>
      </div>
    </div>
  );
}
