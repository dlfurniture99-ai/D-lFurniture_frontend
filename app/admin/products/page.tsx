'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import {
  getAllFurniture,
  createFurniture,
  updateFurniture,
  deleteFurniture,
  Furniture,
  getAuthToken,
  getAllCategories,
  Category,
} from '@/lib/api';
import { useAdminProtect } from '@/hooks/useAdminProtect';
import { useAuth } from '@/lib/useAuth';

export default function AdminProducts() {
  useAdminProtect();
  const { user } = useAuth();
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
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
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    mrp: '',
    category: '',
    discount: '',
    stock: '',
    description: '',
  });

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/admin');
      return;
    }
 
    loadFurniture();
    fetchCategories();
  }, [router, page, category, minPrice, maxPrice, sortBy, searchTerm]);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      if (response.success && response.data?.categories) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

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

  const handleAddFurniture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      setError('');
      const formDataToSend = new FormData();

      const mrpValue = parseInt(formData.mrp) || 0;
      const discountValue = parseInt(formData.discount) || 0;
      const sellingPrice = Math.round(mrpValue - (mrpValue * discountValue / 100));
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('price', sellingPrice.toString());
      formDataToSend.append('mrp', mrpValue.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('discount', discountValue.toString());
      formDataToSend.append('stock', formData.stock || '0');
      formDataToSend.append('description', formData.description);

      // Append multiple images
      console.log('Files to upload:', files.length);
      files.forEach((file) => {
        console.log('Appending file:', file.name, file.type, file.size);
        formDataToSend.append('images', file);
      });

      // Append existing images for update
      if (editingId) {
        console.log('Existing images:', existingImages);
        existingImages.forEach((url) => {
          formDataToSend.append('existingImages', url);
        });
      }

      // Validate at least one image for new products
      if (!editingId && files.length === 0) {
        setError('Please add at least one image');
        setLoading(false);
        return;
      }

      let response;
      if (editingId) {
        response = await updateFurniture(editingId, formDataToSend as any);
      } else {
        response = await createFurniture(formDataToSend as any);
      }
      
      if (response.success) {
        await loadFurniture();
        setFormData({
          name: '',
          mrp: '',
          category: '',
          discount: '',
          stock: '',
          description: '',
        });
        setFiles([]);
        setExistingImages([]);
        setEditingId(null);
        setShowForm(false);
      } else {
        setError(response.message || 'Failed to save furniture');
      }

    } catch (err: any) {
      setError(err.message || 'Failed to save furniture');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFurniture = (item: Furniture) => {
    setFormData({
      name: item.name,
      mrp: item.mrp.toString(),
      category: item.category,
      discount: item.discount?.toString() || '',
      stock: item.stock.toString(),
      description: item.description || '',
    });
    setFiles([]);
    setExistingImages(item.images || []);
    setEditingId(item._id || null);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalImages = existingImages.length + files.length + selectedFiles.length;
    
    if (totalImages > 5) {
      setError('Maximum 5 images allowed');
      return;
    }
    setFiles([...files, ...selectedFiles]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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
    <AdminLayout adminEmail={user?.email || 'Admin'}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Products Management</h1>
        <p className="text-gray-600 mt-2">Add, edit, and delete furniture products</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
      </div>

      {/* Add Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              mrp: '',
              category: '',
              discount: '',
              stock: '',
              description: '',
            });
            setFiles([]);
            setExistingImages([]);
          }}
          className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition font-semibold flex items-center gap-2"
        >
          <span>+</span> Add New Product
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg p-4 shadow mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
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
                <option key={cat._id || cat.id} value={cat.name}>
                  {cat.emoji ? `${cat.emoji} ` : ''}{cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Min Price (₹)</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Price (₹)</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
            >
              <option value="createdAt">Newest</option>
              <option value="price">Price: Low to High</option>
              <option value="bestsellers">Best Sellers</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-yellow-600 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    mrp: '',
                    category: '',
                    discount: '',
                    stock: '',
                    description: '',
                  });
                  setFiles([]);
                  setExistingImages([]);
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
                    Product Name *
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
                      <option key={cat._id || cat.id} value={cat.name}>
                        {cat.emoji ? `${cat.emoji} ` : ''}{cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.mrp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, mrp: val });
                      }}
                      className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-black"
                      placeholder="Enter price"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.discount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        const num = parseInt(val) || 0;
                        if (num <= 100) {
                          setFormData({ ...formData, discount: val });
                        }
                      }}
                      className="w-full pl-3 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-black"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">%</span>
                  </div>
                  {formData.mrp && formData.discount && (
                    <p className="text-xs text-green-600 mt-1">
                      Selling Price: ₹{Math.round(parseInt(formData.mrp) - (parseInt(formData.mrp) * parseInt(formData.discount) / 100)).toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={formData.stock}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setFormData({ ...formData, stock: val });
                      }}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-black"
                      placeholder="Enter quantity"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black"
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Images (Max 5) {!editingId && existingImages.length === 0 && files.length === 0 && '*'}
                  </label>
                  
                  {/* Existing Images Preview */}
                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">Existing Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {existingImages.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Product ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Files Preview */}
                  {files.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-2">New Images:</p>
                      <div className="flex flex-wrap gap-2">
                        {files.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Input */}
                  {(existingImages.length + files.length) < 5 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-yellow-600 file:text-white file:font-semibold file:cursor-pointer hover:file:bg-yellow-700"
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {existingImages.length + files.length}/5 images added
                  </p>
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
                      mrp: '',
                      category: '',
                      discount: '',
                      stock: '',
                      description: '',
                    });
                    setFiles([]);
                    setExistingImages([]);
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-600">Loading products...</div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
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
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span className="font-semibold">₹{item.price.toLocaleString()}</span>
                      {(item.discount ?? 0) > 0 && (
                        <span className="ml-2 text-xs text-gray-500 line-through">₹{item.mrp.toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{item.category}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.stock > 10 ? 'bg-green-100 text-green-800' : item.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {(item.discount ?? 0) > 0 ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">{item.discount}% OFF</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
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
              <div className="p-8 text-center text-gray-600">No products found</div>
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
    </AdminLayout>
  );
}
