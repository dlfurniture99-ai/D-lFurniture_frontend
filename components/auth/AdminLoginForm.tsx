'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setAuthToken } from '@/lib/api';
import { IoEye, IoEyeOff } from 'react-icons/io5';

export default function AdminLoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.email.trim()) {
        setError('Email is required');
        setLoading(false);
        return;
      }
      if (!formData.password) {
        setError('Password is required');
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/auth/admin-login', formData);
      const data = response.data;

      if (data.success && data.data?.token) {
        setAuthToken(data.data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Admin Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="admin@example.com"
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
          disabled={loading}
        />
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
            disabled={loading}
          >
            {showPassword ? (
              <IoEyeOff size={20} />
            ) : (
              <IoEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging in...' : 'Admin Login'}
      </button>
    </form>
  );
}
