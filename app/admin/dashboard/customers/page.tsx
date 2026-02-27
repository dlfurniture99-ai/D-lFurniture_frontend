'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
}

export default function CustomersPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setCustomers([
        { _id: '1', name: 'John Doe', email: 'john@example.com', phone: '9876543210', totalOrders: 5, totalSpent: 125000, joinDate: '2023-01-15' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '9876543211', totalOrders: 3, totalSpent: 75000, joinDate: '2023-06-20' },
        { _id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '9876543212', totalOrders: 8, totalSpent: 250000, joinDate: '2022-12-10' },
        { _id: '4', name: 'Sarah Williams', email: 'sarah@example.com', phone: '9876543213', totalOrders: 2, totalSpent: 45000, joinDate: '2024-01-05' },
        { _id: '5', name: 'Robert Brown', email: 'robert@example.com', phone: '9876543214', totalOrders: 6, totalSpent: 180000, joinDate: '2023-03-22' }
      ]);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}>
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Customers" />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">All Customers</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs md:text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 md:px-6 py-3 text-left font-semibold text-gray-900">Name</th>
                      <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                      <th className="hidden md:table-cell px-3 md:px-6 py-3 text-left font-semibold text-gray-900">Phone</th>
                      <th className="px-3 md:px-6 py-3 text-center font-semibold text-gray-900">Orders</th>
                      <th className="px-3 md:px-6 py-3 text-left font-semibold text-gray-900">Total Spent</th>
                      <th className="hidden sm:table-cell px-3 md:px-6 py-3 text-left font-semibold text-gray-900">Join Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map(customer => (
                      <tr key={customer._id} className="hover:bg-gray-50 transition">
                        <td className="px-3 md:px-6 py-4 text-gray-900 font-semibold">{customer.name}</td>
                        <td className="hidden sm:table-cell px-3 md:px-6 py-4 text-gray-600">{customer.email}</td>
                        <td className="hidden md:table-cell px-3 md:px-6 py-4 text-gray-600">{customer.phone}</td>
                        <td className="px-3 md:px-6 py-4 text-gray-600 font-medium text-center">{customer.totalOrders}</td>
                        <td className="px-3 md:px-6 py-4 text-gray-900 font-semibold">₹{customer.totalSpent.toLocaleString()}</td>
                        <td className="hidden sm:table-cell px-3 md:px-6 py-4 text-gray-600">{customer.joinDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
