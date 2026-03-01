'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { adminApi } from '@/app/apis/adminApi';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.customers.getAll();
      console.log('Customers response:', response);
      
      if (response.success) {
        const customersData = response.users || response.data || response.customers || [];
        
        // Transform user data to customer format
        const transformedCustomers = customersData.map((user: any) => ({
          _id: user._id,
          name: user.name || 'Unknown',
          email: user.email || '',
          phone: user.phone || 'N/A',
          totalOrders: user.totalOrders || 0,
          totalSpent: user.totalSpent || 0,
          joinDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'
        }));
        
        setCustomers(transformedCustomers);
        if (transformedCustomers.length === 0) {
          toast.info('No customers found');
        }
      } else {
        toast.error('Failed to fetch customers');
        setCustomers([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      toast.error('Failed to load customers');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Customers" />

        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-6 lg:p-8">
            {loading ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-4 border-gray-300 border-t-yellow-600 rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading customers...</p>
                </div>
              </div>
            ) : customers.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
                <p className="text-gray-600">No customers found</p>
              </div>
            ) : (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">All Customers ({customers.length})</h2>
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

