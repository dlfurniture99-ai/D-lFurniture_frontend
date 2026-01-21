'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getAllFurniture,
  createFurniture,
  updateFurniture,
  deleteFurniture,
  Furniture,
  getAuthToken,
} from '@/lib/api';
import { removeAuthToken } from '@/lib/api';

export default function AdminDashboard() {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'rating' | 'bestsellers'>('createdAt');
  const router = useRouter();

  const categories = [
    'Sofas',
    'Beds',
    'Dining',
    'Storage',
    'Office',
    'Decor',
  ];

  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    mrp: 0,
    category: '',
    images: [''],
    discount: 0,
    stock: 0,
    description: '',
  });

  // Fetch furniture on mount
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/admin');
      return;
    }

    loadFurniture();
  }, [router, page, category, minPrice, maxPrice, sortBy, searchTerm]);

  const loadFurniture = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAllFurniture(
        page,
        10,
        category || undefined,
        searchTerm || undefined,
        sortBy === 'createdAt' ? undefined : sortBy,
        minPrice ? Number(minPrice) : undefined,
        maxPrice ? Number(maxPrice) : undefined
      );
      
      if (response.success && response.data?.furniture) {
        setFurniture(response.data.furniture);
        setTotalPages(response.data.pagination.pages);
      } else {

        setError('Failed to load furniture');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load furniture');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    router.push('/admin');
  };

  const handleAddFurniture = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      
      if (editingId) {
        // Update furniture
        const response = await updateFurniture(editingId, formData);
        if (response.success) {
          await loadFurniture();
        } else {
          setError(response.message || 'Failed to update furniture');
        }
      } else {
        // Create furniture
        const response = await createFurniture(formData as any);
        if (response.success) {
          await loadFurniture();
        } else {
          setError(response.message || 'Failed to create furniture');
        }
      }

      // Reset form
      setFormData({
        name: '',
        price: 0,
        mrp: 0,
        category: '',
        images: [''],
        discount: 0,
        stock: 0,
        description: '',
      });
      setEditingId(null);
      setShowForm(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save furniture');
    }
  };

  const handleEditFurniture = (item: Furniture) => {
    setFormData({
      name: item.name,
      price: item.price,
      mrp: item.mrp,
      category: item.category,
      images: item.images || [''],
      discount: item.discount || 0,
      stock: item.stock,
      description: item.description || '',
    });
    setEditingId(item._id || null);
    setShowForm(true);
  };

  const handleDeleteFurniture = async (id: string | undefined) => {
    if (!id) return;
    
    if (confirm('Are you sure you want to delete this furniture?')) {
      try {
        setError('');
        const response = await deleteFurniture(id);
        if (response.success) {
          await loadFurniture();
        } else {
          setError(response.message || 'Failed to delete furniture');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to delete furniture');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Admin Header */}
      <header className="bg-yellow-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">D&L Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 text-black">
        {/* Admin Navigation Tabs */}
        <div className="mb-6 flex gap-3 border-b border-gray-300">
          <button
            className="px-6 py-3 font-semibold text-white bg-yellow-600 border-b-2 border-yellow-700 rounded-t-lg"
          >
            📦 Products
          </button>
          <Link href="/admin/orders">
            <button
              className="px-6 py-3 font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-t-lg transition"
            >
              📋 Orders
            </button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-semibold">Total Products</p>
            <p className="text-3xl font-bold text-yellow-600">{furniture.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-semibold">In Stock</p>
            <p className="text-3xl font-bold text-green-600">
              {furniture.filter((item: Furniture) => item.stock > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-semibold">Avg Price</p>
            <p className="text-3xl font-bold text-blue-600">
              {furniture.length > 0 ? `₹${Math.round(furniture.reduce((a, b) => a + b.price, 0) / furniture.length).toLocaleString()}` : '₹0'}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <p className="text-gray-600 text-sm font-semibold">Back to Store</p>
            <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
              Visit Site →
            </Link>
          </div>
        </div>

        {/* Add Furniture Button */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: '',
                price: 0,
                mrp: 0,
                category: '',
                images: [''],
                discount: 0,
                stock: 0,
                description: '',
              });
            }}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition font-semibold"
          >
            {showForm ? 'Cancel' : '+ Add New Furniture'}
          </button>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg p-4 shadow mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Min Price (₹)
              </label>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Max Price (₹)
              </label>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
              >
                <option value="createdAt">Newest</option>
                <option value="price">Price (Low to High)</option>
                <option value="rating">Rating</option>
                <option value="bestsellers">Best Sellers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Modal Backdrop */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
              {/* Modal Header */}
              <div className="sticky top-0 bg-yellow-600 text-white px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Furniture' : 'Add New Furniture'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      name: '',
                      price: 0,
                      mrp: 0,
                      category: '',
                      images: [''],
                      discount: 0,
                      stock: 0,
                      description: '',
                    });
                  }}
                  className="text-2xl font-bold hover:text-yellow-200 transition"
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleAddFurniture} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Furniture Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                      placeholder="e.g., Wooden Sofa Set"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      MRP (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.mrp}
                      onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                      placeholder="Furniture description..."
                      rows={3}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Image URLs (one per line)
                    </label>
                    <textarea
                      value={formData.images.join('\n')}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value.split('\n').filter(url => url.trim()) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-mono text-sm"
                      placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="mt-6 flex gap-4 justify-end border-t pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({
                        name: '',
                        price: 0,
                        mrp: 0,
                        category: '',
                        images: [''],
                        discount: 0,
                        stock: 0,
                        description: '',
                      });
                    }}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    {editingId ? 'Update Furniture' : 'Add Furniture'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Furniture Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading furniture...</div>
          ) : (
            <>
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">MRP</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Discount</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {furniture.map((item) => (
                    <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{item.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₹{item.mrp.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.stock}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{item.discount || 0}%</td>
                      <td className="px-6 py-4 text-center text-sm space-x-2">
                        <button
                          onClick={() => handleEditFurniture(item)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteFurniture(item._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {furniture.length === 0 && (
                <div className="p-8 text-center text-gray-600">No furniture found</div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border-t">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
