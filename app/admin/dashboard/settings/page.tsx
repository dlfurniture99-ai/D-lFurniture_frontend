'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

export default function AdminSettings() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
    const adminData = localStorage.getItem('adminData');
    if (adminData) {
      const data = JSON.parse(adminData);
      setAdminEmail(data.email || '');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    router.push('/admin');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Settings" />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8 max-w-4xl">
            {/* Settings Container */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Admin Profile Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Admin Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={adminEmail}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {/* Logout Section */}
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Session</h2>
                <p className="text-sm text-gray-600 mb-4">Click below to logout from your admin account</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
                >
                  <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
