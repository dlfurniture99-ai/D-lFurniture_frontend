'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, setAuthToken } from '@/lib/api';
import { IoEye, IoEyeOff } from 'react-icons/io5';

export default function AdminSignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.adminSecret) {
      setError('Admin secret key is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!validateForm()) {
        setLoading(false);
        return;
      }

      const response = await apiClient.post('/auth/admin-signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        adminSecret: formData.adminSecret,
      });

      const data = response.data;

      if (data.success && data.data?.token) {
        setAuthToken(data.data.token);
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          First Name
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="John"
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
          disabled={loading}
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Last Name
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Doe"
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
          disabled={loading}
        />
      </div>

      {/* Email */}
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

      {/* Password */}
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
            placeholder="At least 6 characters"
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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
            disabled={loading}
          >
            {showConfirmPassword ? (
              <IoEyeOff size={20} />
            ) : (
              <IoEye size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Admin Secret Key */}
      <div>
        <label className="block text-sm font-medium text-gray-200 mb-2">
          Admin Secret Key
        </label>
        <input
          type="password"
          name="adminSecret"
          value={formData.adminSecret}
          onChange={handleChange}
          placeholder="Enter admin secret key"
          className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition"
          disabled={loading}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Signup Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-yellow-600 text-white font-semibold py-3 rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Admin Account...' : 'Admin Sign Up'}
      </button>
    </form>
  );
}
