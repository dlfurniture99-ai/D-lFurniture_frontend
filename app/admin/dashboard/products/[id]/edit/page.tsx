'use client';

import { FiArrowLeft as FaArrowLeft, FiCheckCircle as FaCheckCircle, FiPlus as FaPlus, FiTrash2 as FaTrash, FiImage as FaImage, FiX as FaTimes } from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { adminApi } from '@/app/apis/adminApi';

interface FormData {
  name: string;
  shortDescription: string;
  fullDescription: string;
  price: number | '';
  discountPercentage: number | '';
  stock: number | '';
  category: string;
  customCategory: string;
  brand: string;
  sku: string;
  weight: string;
  dimensions: string;
  material: string;
  warranty: string;
  returnPolicy: string;
  colors: string[];
  sizes: string[];
  specifications: { key: string; value: string }[];
  images: string[];
}

const DEFAULT_CATEGORIES = [
  'Sofas & Couches',
  'Chairs & Stools',
  'Beds & Mattresses',
  'Desks & Tables',
  'Storage & Cabinets',
  'Shelving & Units',
  'Outdoor Furniture',
  'Bedroom Furniture',
  'Dining Furniture',
  'Office Furniture'
];

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    discountPercentage: '',
    stock: '',
    category: '',
    customCategory: '',
    brand: '',
    sku: '',
    weight: '',
    dimensions: '',
    material: '',
    warranty: '',
    returnPolicy: '30 days',
    colors: [],
    sizes: [],
    specifications: [],
    images: []
  });

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin');
      return;
    }
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await adminApi.products.getById(productId);
      
      if (response.success && response.data) {
        const product = response.data;
        console.log('Product data:', product);
        setFormData({
          name: product.name || '',
          shortDescription: product.shortDescription || product.description?.substring(0, 100) || '',
          fullDescription: product.description || product.fullDescription || '',
          price: product.price || '',
          discountPercentage: product.discountPercentage || '',
          stock: product.stock || '',
          category: product.category || '',
          customCategory: '',
          brand: product.brand || 'N/A',
          sku: product.sku || `SKU-${product._id?.substring(0, 8)}` || '',
          weight: product.weight || '',
          dimensions: product.dimensions || '',
          material: product.material || '',
          warranty: product.warranty || '',
          returnPolicy: product.returnPolicy || '30 days',
          colors: product.colors || [],
          sizes: product.finishes || [],
          specifications: product.specifications || [],
          images: []
        });
        
        setExistingImageUrls(product.images || []);
        setCategories(prev => 
          product.category && !DEFAULT_CATEGORIES.includes(product.category)
            ? [...DEFAULT_CATEGORIES, product.category]
            : prev
        );
      }
    } catch (error: any) {
      console.error('Failed to fetch product:', error);
      toast.error('Failed to load product');
      router.push('/admin/dashboard/products');
    } finally {
      setPageLoading(false);
    }
  };

  const calculateFinalPrice = () => {
    if (formData.price && formData.discountPercentage) {
      const price = parseFloat(String(formData.price));
      const discount = parseFloat(String(formData.discountPercentage));
      return (price - (price * discount) / 100).toFixed(2);
    }
    return formData.price ? parseFloat(String(formData.price)).toFixed(2) : '0.00';
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (!categories.includes(newCategory.trim())) {
        setCategories([...categories, newCategory.trim()]);
        setFormData(prev => ({
          ...prev,
          category: newCategory.trim(),
          customCategory: newCategory.trim()
        }));
        setNewCategory('');
        setShowCategoryModal(false);
        toast.success('Category added successfully');
      } else {
        toast.error('Category already exists');
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(newImages).then(images => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...images]
        }));
        toast.success(`${images.length} image(s) added`);
      });
    }
  };

  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const addColor = (color: string) => {
    if (color && !formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, color]
      }));
    }
  };

  const removeColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const addSize = (size: string) => {
    if (size && !formData.sizes.includes(size)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, size]
      }));
    }
  };

  const removeSize = (index: number) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: '', value: '' }]
    }));
  };

  const updateSpecification = (index: number, key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) =>
        i === index ? { key, value } : spec
      )
    }));
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
    if (!formData.fullDescription.trim()) newErrors.fullDescription = 'Full description is required';
    if (formData.price === '' || parseFloat(String(formData.price)) <= 0) newErrors.price = 'Valid price is required';
    if (formData.stock === '' || parseInt(String(formData.stock)) < 0) newErrors.stock = 'Valid stock is required';
    if (!formData.category && !formData.customCategory) newErrors.category = 'Category is required';
    if (existingImageUrls.length === 0 && formData.images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'discountPercentage', 'stock'].includes(name) 
        ? (value === '' ? '' : parseFloat(value)) 
        : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const productData = {
        name: formData.name.trim(),
        shortDescription: formData.shortDescription.trim(),
        fullDescription: formData.fullDescription.trim(),
        price: parseFloat(String(formData.price)),
        discountPercentage: formData.discountPercentage ? parseFloat(String(formData.discountPercentage)) : 0,
        finalPrice: parseFloat(calculateFinalPrice()),
        stock: parseInt(String(formData.stock)),
        category: formData.customCategory || formData.category,
        brand: formData.brand.trim(),
        sku: formData.sku.trim(),
        weight: formData.weight.trim() || undefined,
        dimensions: formData.dimensions.trim() || undefined,
        material: formData.material.trim() || undefined,
        warranty: formData.warranty.trim() || undefined,
        returnPolicy: formData.returnPolicy,
        colors: formData.colors.length > 0 ? formData.colors : undefined,
        finishes: formData.sizes.length > 0 ? formData.sizes : undefined,
        specifications: formData.specifications.filter(s => s.key && s.value),
        images: [...existingImageUrls, ...formData.images]
      };

      console.log('Updating product with data:', productData);
      const response = await adminApi.products.update(productId, productData);
      console.log('Update response:', response);

      if (response.success) {
        toast.success('Product updated successfully');
        router.push('/admin/dashboard/products');
      } else {
        console.error('Update failed:', response);
        toast.error(response.message || 'Failed to update product');
      }
    } catch (error: any) {
      console.error('Failed to update product:', error);
      toast.error(error?.message || error?.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex min-h-screen flex-1 flex-col md:ml-64">
          <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Edit Product" />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin">
              <div className="h-12 w-12 border-4 border-yellow-600 border-t-transparent rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Edit Product" />

        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-200 rounded-lg transition"
              >
                <FaArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
                <p className="text-sm text-gray-600 mt-1">Update product details</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-gray-200">
                {['basic', 'images', 'details', 'variants'].map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-medium border-b-2 transition ${
                      activeTab === tab
                        ? 'border-yellow-600 text-yellow-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* BASIC INFO TAB */}
              {activeTab === 'basic' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                        Product Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-sm font-semibold text-black mb-2">
                        Category <span className="text-red-600">*</span>
                      </label>
                      <div className="flex gap-2">
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                        >
                          <option value="">Select a category</option>
                          {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => setShowCategoryModal(true)}
                          className="px-4 py-3 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
                        >
                          + New
                        </button>
                      </div>
                      {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
                    </div>

                    {/* Price */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-black mb-2">
                        Price <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                      {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {/* Discount */}
                    <div>
                      <label htmlFor="discountPercentage" className="block text-sm font-semibold text-black mb-2">
                        Discount <span className="text-xs text-gray-600">(%)</span>
                      </label>
                      <input
                        type="number"
                        id="discountPercentage"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.01"
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Final Price Display */}
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Final Price</label>
                      <div className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg">
                        <p className="text-lg font-bold text-yellow-600">₹{calculateFinalPrice()}</p>
                      </div>
                    </div>

                    {/* Stock */}
                    <div>
                      <label htmlFor="stock" className="block text-sm font-semibold text-black mb-2">
                        Stock <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                      {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
                    </div>

                    {/* Brand */}
                    <div>
                      <label htmlFor="brand" className="block text-sm font-semibold text-black mb-2">
                        Brand
                      </label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="Brand name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <label htmlFor="sku" className="block text-sm font-semibold text-black mb-2">
                        SKU
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="SKU"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="pt-6 border-t border-gray-200">
                    <div>
                      <label htmlFor="shortDescription" className="block text-sm font-semibold text-black mb-2">
                        Short Description <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Brief product description (for listings)"
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition resize-none"
                      />
                      {errors.shortDescription && <p className="text-red-600 text-sm mt-1">{errors.shortDescription}</p>}
                    </div>

                    <div className="mt-4">
                      <label htmlFor="fullDescription" className="block text-sm font-semibold text-black mb-2">
                        Full Description <span className="text-red-600">*</span>
                      </label>
                      <textarea
                        id="fullDescription"
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleInputChange}
                        placeholder="Detailed product description"
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition resize-none"
                      />
                      {errors.fullDescription && <p className="text-red-600 text-sm mt-1">{errors.fullDescription}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* IMAGES TAB */}
              {activeTab === 'images' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-black mb-4">Product Images</h3>
                    
                    <div className="mb-6">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-yellow-600 transition text-center cursor-pointer"
                      >
                        <FaImage className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-black font-medium">Click to upload images</p>
                        <p className="text-sm text-gray-600">or drag and drop</p>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {errors.images && <p className="text-red-600 text-sm mb-4">{errors.images}</p>}

                    {/* Existing Images */}
                    {existingImageUrls.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-black mb-3">Current Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {existingImageUrls.map((url, index) => (
                            <div key={`existing-${index}`} className="relative group">
                              <img src={url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                              <button
                                type="button"
                                onClick={() => removeImage(index, true)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images */}
                    {formData.images.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-black mb-3">New Images to Add</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {formData.images.map((url, index) => (
                            <div key={`new-${index}`} className="relative group">
                              <img src={url} alt={`New ${index + 1}`} className="w-full h-32 object-cover rounded-lg border border-yellow-300 border-2" />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition"
                              >
                                <FaTimes className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weight */}
                    <div>
                      <label htmlFor="weight" className="block text-sm font-semibold text-black mb-2">
                        Weight <span className="text-xs text-black">(kg)</span>
                      </label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g., 25 kg"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Dimensions */}
                    <div>
                      <label htmlFor="dimensions" className="block text-sm font-semibold text-black mb-2">
                        Dimensions <span className="text-xs text-black">(L x W x H)</span>
                      </label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="e.g., 200 x 100 x 80 cm"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Material */}
                    <div>
                      <label htmlFor="material" className="block text-sm font-semibold text-black mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        id="material"
                        name="material"
                        value={formData.material}
                        onChange={handleInputChange}
                        placeholder="Material composition"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Warranty */}
                    <div>
                      <label htmlFor="warranty" className="block text-sm font-semibold text-black mb-2">
                        Warranty <span className="text-xs text-black">(e.g., 1 Year)</span>
                      </label>
                      <input
                        type="text"
                        id="warranty"
                        name="warranty"
                        value={formData.warranty}
                        onChange={handleInputChange}
                        placeholder="e.g., 2 Years Manufacturer Warranty"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Return Policy */}
                    <div className="md:col-span-2">
                      <label htmlFor="returnPolicy" className="block text-sm font-semibold text-black mb-2">
                        Return Policy
                      </label>
                      <select
                        id="returnPolicy"
                        name="returnPolicy"
                        value={formData.returnPolicy}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      >
                        <option value="7 days">7 days easy returns</option>
                        <option value="14 days">14 days easy returns</option>
                        <option value="30 days">30 days easy returns</option>
                        <option value="60 days">60 days easy returns</option>
                        <option value="No returns">No returns</option>
                      </select>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-black">Product Specifications</h4>
                      <button
                        type="button"
                        onClick={addSpecification}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium text-sm"
                      >
                        <FaPlus className="w-3 h-3" />
                        Add Specification
                      </button>
                    </div>

                    <div className="space-y-3">
                      {formData.specifications.map((spec, index) => (
                        <div key={index} className="flex gap-3 items-end">
                          <input
                            type="text"
                            placeholder="e.g., Seat Height, Capacity, Legs Type"
                            value={spec.key}
                            onChange={(e) => updateSpecification(index, e.target.value, spec.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                          />
                          <input
                            type="text"
                            placeholder="e.g., 18 inches, 300 lbs, Metal"
                            value={spec.value}
                            onChange={(e) => updateSpecification(index, spec.key, e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecification(index)}
                            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {formData.specifications.length === 0 && (
                      <p className="text-black text-sm text-center py-6">No specifications added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* VARIANTS TAB */}
              {activeTab === 'variants' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                  {/* Available Colors */}
                  <div>
                    <h4 className="text-lg font-semibold text-black mb-4">Available Colors</h4>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        id="colorInput"
                        placeholder="e.g., Black, White, Gray, Brown"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('colorInput') as HTMLInputElement;
                          if (input.value) {
                            addColor(input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                      >
                        Add Color
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color, index) => (
                        <div key={index} className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                          <span>{color}</span>
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="hover:text-yellow-600"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Available Finishes */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-black mb-4">Available Finishes</h4>
                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        id="sizeInput"
                        placeholder="e.g., Matte, Glossy, Walnut, Oak, Veneer"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('sizeInput') as HTMLInputElement;
                          if (input.value) {
                            addSize(input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
                      >
                        Add Finish
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {formData.sizes.map((size, index) => (
                        <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                          <span>{size}</span>
                          <button
                            type="button"
                            onClick={() => removeSize(index)}
                            className="hover:text-blue-600"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-4 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed font-medium transition"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin">
                        <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      </div>
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="w-5 h-5" />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-black mb-4">Add Custom Category</h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 mb-4"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCategory}
                className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
