'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { adminApi } from '@/app/apis/adminApi';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isVisible: boolean;
  rating?: number;
  category: string;
  description?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminApi.products.getAll();
      
      if (response.success && response.data) {
        const productsData = Array.isArray(response.data) ? response.data : [];
        setProducts(productsData);
      }
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const toggleProductVisibility = async (productId: string) => {
    try {
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const response = await adminApi.products.toggleVisibility(productId, !product.isVisible);
      
      if (response.success) {
        setProducts(products.map(p => 
          p._id === productId ? { ...p, isVisible: !p.isVisible } : p
        ));
        toast.success('Product visibility updated');
      }
    } catch (error: any) {
      console.error('Failed to toggle visibility:', error);
      toast.error('Failed to update product visibility');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const response = await adminApi.products.delete(productId);
      
      if (response.success) {
        setProducts(products.filter(p => p._id !== productId));
        toast.success('Product deleted successfully');
      }
    } catch (error: any) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}>
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Products" />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin">
                  <div className="h-12 w-12 border-4 border-yellow-600 border-t-transparent rounded-full"></div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">All Products</h2>
                    <p className="text-sm text-gray-600 mt-1">{products.length} products total</p>
                  </div>
                  <button 
                    onClick={() => router.push('/admin/dashboard/products/add')}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                  >
                    <FaPlus className="w-4 h-4" />
                    Add Product
                  </button>
                </div>
                <div className="overflow-x-auto">
                  {products.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-600">No products found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                          {products[0]?.rating !== undefined && <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>}
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Visibility</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {products.map(product => (
                          <tr key={product._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name || 'N/A'}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{product.category || 'Uncategorized'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">₹{(product.price || 0).toLocaleString()}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <span className={(product.stock || 0) > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {product.stock || 0} {(product.stock || 0) === 1 ? 'unit' : 'units'}
                              </span>
                            </td>
                            {product.rating !== undefined && product.rating !== null && (
                              <td className="px-6 py-4 text-sm text-gray-600">
                                <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                                  ★ {(product.rating || 0).toFixed(1)}
                                </span>
                              </td>
                            )}
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => toggleProductVisibility(product._id)}
                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold transition ${
                                  product.isVisible
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                }`}
                              >
                                {product.isVisible ? <FaEye className="w-3 h-3" /> : <FaEyeSlash className="w-3 h-3" />}
                                {product.isVisible ? 'Visible' : 'Hidden'}
                              </button>
                            </td>
                            <td className="px-6 py-4 text-sm flex gap-2">
                              <button 
                                onClick={() => router.push(`/admin/dashboard/products/${product._id}/edit`)}
                                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                              >
                                <FaEdit className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => deleteProduct(product._id)}
                                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
