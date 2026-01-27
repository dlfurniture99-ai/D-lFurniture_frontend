'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useAuth } from '@/lib/useAuth';
import { useAdminProtect } from '@/hooks/useAdminProtect';

interface Customer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
}

export default function AdminCustomers() {
  useAdminProtect();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'recent' | 'topspenders'>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadCustomers();
  }, [page, searchTerm, filterBy]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError('');
      // Mock data - in production, fetch from API
      const mockCustomers: Customer[] = [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+91 9876543210',
          address: '123 Main St',
          city: 'Delhi',
          zipCode: '110001',
          totalOrders: 5,
          totalSpent: 15000,
          joinedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          phone: '+91 9876543211',
          address: '456 Oak Ave',
          city: 'Mumbai',
          zipCode: '400001',
          totalOrders: 8,
          totalSpent: 25000,
          joinedDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setCustomers(mockCustomers);
    } catch (err: any) {
      setError(err.message || 'Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === 'recent') {
      return matchesSearch;
    } else if (filterBy === 'topspenders') {
      return matchesSearch && customer.totalSpent > 10000;
    }
    return matchesSearch;
  });

  return (
    <AdminLayout adminEmail={user?.email || 'Admin'}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-2">View and manage customer information</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-600 text-sm font-semibold">Total Customers</p>
          <p className="text-3xl font-bold text-blue-600">{customers.length}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-600 text-sm font-semibold">Total Orders</p>
          <p className="text-3xl font-bold text-green-600">
            {customers.reduce((sum, c) => sum + c.totalOrders, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-600 text-sm font-semibold">Total Revenue</p>
          <p className="text-3xl font-bold text-yellow-600">
            ₹{customers.reduce((sum, c) => sum + c.totalSpent, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <p className="text-gray-600 text-sm font-semibold">Avg Spent</p>
          <p className="text-3xl font-bold text-purple-600">
            {customers.length > 0 ? `₹${Math.round(customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length).toLocaleString()}` : '₹0'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Filter By</label>
            <select
              value={filterBy}
              onChange={(e) => {
                setFilterBy(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
            >
              <option value="all">All Customers</option>
              <option value="recent">Recent Customers</option>
              <option value="topspenders">Top Spenders</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-gray-600">No customers found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Orders</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Total Spent</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {customer.firstName} {customer.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{customer.city}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {customer.totalOrders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{customer.totalSpent.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(customer.joinedDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
