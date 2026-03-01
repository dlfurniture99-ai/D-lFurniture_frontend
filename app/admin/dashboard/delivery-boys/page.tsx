'use client';

import { FiPlus as FaPlus, FiTrash2 as FaTrash, FiCheck as FaCheck, FiX as FaTimes, FiUser as FaUser, FiPhone as FaPhone, FiMail as FaEnvelope } from 'react-icons/fi';
import { useState, useEffect } from 'react';

import { toast } from 'sonner';
import AdminSidebar from '@/components/AdminSidebar';
import AdminTopNav from '@/components/AdminTopNav';
import { adminApi } from '@/app/apis/adminApi';

interface DeliveryBoy {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: 'deliveryBoy';
  isActive: boolean;
  createdAt: string;
}

export default function DeliveryBoysPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delivery-boys`,
        {
          credentials: 'include'
        }
      );
      const data = await response.json();
      setDeliveryBoys(data.data || []);
    } catch (error) {
      toast.error('Failed to load delivery boys');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliveryBoy = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register-delivery-boy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Failed to add delivery boy');
        return;
      }

      toast.success('Delivery boy registered successfully!');
      setFormData({ name: '', email: '', phone: '' });
      setShowForm(false);
      await fetchDeliveryBoys();
    } catch (error) {
      console.error('Failed to add delivery boy:', error);
      toast.error('Failed to add delivery boy');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDeliveryBoyStatus = async (id: string, isActive: boolean) => {
    const action = isActive ? 'deactivate' : 'activate';
    const message = isActive 
      ? 'Are you sure you want to suspend this delivery boy account?' 
      : 'Are you sure you want to activate this delivery boy account?';
    
    if (!confirm(message)) return;

    try {
      const endpoint = isActive ? 'deactivate' : 'activate';
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delivery-boys/${id}/${endpoint}`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        toast.error(`Failed to ${action} delivery boy`);
        return;
      }

      toast.success(`Delivery boy ${action}d successfully`);
      await fetchDeliveryBoys();
    } catch (error) {
      console.error(`Failed to ${action} delivery boy:`, error);
      toast.error(`Failed to ${action} delivery boy`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} title="Delivery Boys Management" />

        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-6xl mx-auto">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-black">Delivery Boys</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-medium"
              >
                <FaPlus className="w-5 h-5" />
                Add Delivery Boy
              </button>
            </div>

            {/* Add Form */}
            {showForm && (
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
                <h2 className="text-2xl font-bold text-black mb-6">Add New Delivery Boy</h2>
                <form onSubmit={handleAddDeliveryBoy} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Email *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91-9876543210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    />
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-900 text-sm">
                      <strong>Note:</strong> Simple data storage only. Delivery boy will receive OTP when they request login. No password needed!
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-yellow-400 font-medium transition"
                    >
                      {loading ? 'Adding...' : 'Add Delivery Boy'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50 font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Delivery Boys List */}
            {loading && !showForm ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading delivery boys...</p>
              </div>
            ) : deliveryBoys.length === 0 ? (
              <div className="text-center py-12">
                <FaUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No delivery boys added yet</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {deliveryBoys.map(boy => (
                  <div key={boy._id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                    <div className="grid md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Name</p>
                        <p className="text-black font-semibold flex items-center gap-2">
                          <FaUser className="w-4 h-4 text-yellow-600" />
                          {boy.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Email</p>
                        <p className="text-black flex items-start gap-2 truncate">
                          <FaEnvelope className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <a href={`mailto:${boy.email}`} className="text-yellow-600 hover:text-yellow-700 truncate" title={boy.email}>
                            {boy.email}
                          </a>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm mb-1">Phone</p>
                        <p className="text-black flex items-center gap-2">
                          <FaPhone className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                          <a href={`tel:${boy.phone}`} className="text-yellow-600 hover:text-yellow-700">
                            {boy.phone}
                          </a>
                        </p>
                      </div>
                      <div>
                         <p className="text-gray-600 text-sm mb-1">Status</p>
                         <div className="flex items-center gap-2">
                           {boy.isActive ? (
                             <>
                               <FaCheck className="w-4 h-4 text-green-600" />
                               <span className="text-green-600 font-semibold">Approved</span>
                             </>
                           ) : (
                             <>
                               <FaTimes className="w-4 h-4 text-red-600" />
                               <span className="text-red-600 font-semibold">Suspended</span>
                             </>
                           )}
                         </div>
                       </div>
                       <div className="flex items-center justify-end gap-2">
                         <button
                           onClick={() => handleToggleDeliveryBoyStatus(boy._id, boy.isActive)}
                           className={`p-2 rounded-lg transition ${
                             boy.isActive
                               ? 'bg-red-100 text-red-600 hover:bg-red-200'
                               : 'bg-green-100 text-green-600 hover:bg-green-200'
                           }`}
                           title={boy.isActive ? 'Suspend account' : 'Activate account'}
                         >
                           {boy.isActive ? (
                             <FaTrash className="w-4 h-4" />
                           ) : (
                             <FaCheck className="w-4 h-4" />
                           )}
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

