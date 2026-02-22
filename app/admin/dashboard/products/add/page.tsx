'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCheckCircle, FaPlus, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
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

export default function AddProductPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic'); // basic, images, details, variants
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  
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

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required';
    if (formData.images.length === 0) newErrors.images = 'At least one product image is required';

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
        images: formData.images.length > 0 ? formData.images : undefined,
        isVisible: true
      };

      console.log('Sending product data:', productData);
      const response = await adminApi.products.create(productData);
      console.log('Response received:', response);

      if (response.success) {
        toast.success('Product added successfully');
        router.push('/admin/dashboard/products');
      }
    } catch (error: any) {
      console.error('Failed to create product:', error);
      toast.error(error?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📝' },
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'variants', label: 'Variants', icon: '🎨' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? '256px' : '80px' }}>
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Add New Product" />

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-8 text-black hover:text-black font-medium transition"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Products
            </button>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black mb-2">Add New Product</h1>
              <p className="text-black">Create a comprehensive product listing with images, details, and variants</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium text-sm transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-yellow-600 text-black'
                      : 'border-transparent text-black hover:text-black'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* BASIC INFO TAB */}
              {activeTab === 'basic' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="name" className="block text-sm font-semibold text-black mb-2">
                        Product Name * <span className="text-xs text-black">(Required)</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Premium Wireless Headphones with Noise Cancellation"
                        maxLength={100}
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                        <span className="text-black text-xs ml-auto">{formData.name.length}/100</span>
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label htmlFor="brand" className="block text-sm font-semibold text-black mb-2">
                        Brand Name *
                      </label>
                      <input
                        type="text"
                        id="brand"
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        placeholder="e.g., Sony, Samsung"
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                          errors.brand ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand}</p>}
                    </div>

                    {/* SKU */}
                    <div>
                      <label htmlFor="sku" className="block text-sm font-semibold text-black mb-2">
                        SKU (Stock Keeping Unit) *
                      </label>
                      <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="e.g., PROD-001-BLK"
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                          errors.sku ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.sku && <p className="text-red-600 text-sm mt-1">{errors.sku}</p>}
                    </div>

                    {/* Short Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="shortDescription" className="block text-sm font-semibold text-black mb-2">
                        Short Description * <span className="text-xs text-black">(Max 160 chars - for listings)</span>
                      </label>
                      <textarea
                        id="shortDescription"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleInputChange}
                        placeholder="Brief product description that appears in search results..."
                        maxLength={160}
                        rows={2}
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition resize-none ${
                          errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <div className="flex justify-between mt-1">
                        {errors.shortDescription && <p className="text-red-600 text-sm">{errors.shortDescription}</p>}
                        <span className="text-black text-xs ml-auto">{formData.shortDescription.length}/160</span>
                      </div>
                    </div>

                    {/* Full Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="fullDescription" className="block text-sm font-semibold text-black mb-2">
                        Full Description *
                      </label>
                      <textarea
                        id="fullDescription"
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleInputChange}
                        placeholder="Detailed product description including features, benefits, usage instructions..."
                        rows={5}
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition resize-none ${
                          errors.fullDescription ? 'border-red-500' : 'border-gray-300'}`}/>
                      {errors.fullDescription && <p className="text-red-600 text-sm mt-1">{errors.fullDescription}</p>}
                    </div>

                    {/* Category */}
                    <div className="md:col-span-2">
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="category" className="block text-sm font-semibold text-black">
                          Category *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCategoryModal(true)}
                          className="text-xs bg-yellow-100 text-black px-3 py-1 rounded hover:bg-yellow-200 transition">
                          + Add Custom Category
                        </button>
                      </div>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
                    </div>

                    {/* Price Row */}
                    <div>
                      <label htmlFor="price" className="block text-sm font-semibold text-black mb-2">
                        Original Price (₹) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                    </div>

                    {/* Discount */}
                    <div>
                      <label htmlFor="discountPercentage" className="block text-sm font-semibold text-black mb-2">
                        Discount (%) <span className="text-xs text-black">(Optional)</span>
                      </label>
                      <input
                        type="number"
                        id="discountPercentage"
                        name="discountPercentage"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        placeholder="0"
                        step="0.1"
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Final Price Display */}
                    {(formData.price || formData.discountPercentage) && (
                      <div className="md:col-span-2 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-black mb-2">Final Price (After Discount):</p>
                        <p className="text-3xl font-bold text-black">₹{calculateFinalPrice()}</p>
                        {formData.discountPercentage && (
                          <p className="text-sm text-black mt-1">
                            You save ₹{(parseFloat(String(formData.price)) * parseFloat(String(formData.discountPercentage)) / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Stock */}
                    <div>
                      <label htmlFor="stock" className="block text-sm font-semibold text-black mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        className={`w-full px-4 py-3 border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition ${
                          errors.stock ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* IMAGES TAB */}
              {activeTab === 'images' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Product Images *</h3>
                    <p className="text-sm text-black mb-4">Upload high-quality product images. First image will be used as the main image.</p>
                    
                    {/* Upload Area */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 hover:bg-yellow-100 transition"
                    >
                      <FaImage className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                      <p className="text-black font-medium mb-1">Click to upload images</p>
                      <p className="text-sm text-black">or drag and drop</p>
                      <p className="text-xs text-black mt-2">PNG, JPG, GIF up to 10MB each</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {errors.images && <p className="text-red-600 text-sm mt-2">{errors.images}</p>}
                  </div>

                  {/* Image Gallery */}
                  {formData.images.length > 0 && (
                    <div className="mt-8">
                      <h4 className="text-sm font-semibold text-black mb-4">
                        Uploaded Images ({formData.images.length})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={image}
                              alt={`Product ${index + 1}`}
                              className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                            />
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                Main Image
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* DETAILS TAB */}
              {activeTab === 'details' && (
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weight */}
                    <div>
                      <label htmlFor="weight" className="block text-sm font-semibold text-black mb-2">
                        Weight <span className="text-xs text-black">(e.g., 500g, 2kg)</span>
                      </label>
                      <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="e.g., 250 grams"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Dimensions */}
                    <div>
                      <label htmlFor="dimensions" className="block text-sm font-semibold text-black mb-2">
                        Dimensions <span className="text-xs text-black">(e.g., 10x20x30 cm)</span>
                      </label>
                      <input
                        type="text"
                        id="dimensions"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="Length x Width x Height"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600 transition"
                      />
                    </div>

                    {/* Material */}
                    <div>
                      <label htmlFor="material" className="block text-sm font-semibold text-black mb-2">
                        Material <span className="text-xs text-black">(e.g., Cotton, Stainless Steel)</span>
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
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle className="w-5 h-5" />
                      Create Product
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
