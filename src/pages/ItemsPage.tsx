import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { CreateLostFoundItemDto, ItemStatus } from '../../types/index';
import { useAuthStore } from '../store/authStore';

const ItemsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState<CreateLostFoundItemDto>({
    title: '',
    description: '',
    category: 'Accessories',
    status: ItemStatus.LOST,
    location: '',
    userId: user?.id || 1,
    userName: user?.name || 'User',
    userEmail: user?.email || '',
    userPhone: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      }));
    }
  }, [user]);

  const [submitted, setSubmitted] = useState(false);

  const createMutation = useMutation({
    mutationFn: (payload: CreateLostFoundItemDto) => api.createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.userEmail || !formData.userPhone) {
      alert('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  const categories = ['Accessories', 'Electronics', 'Documents', 'Clothing', 'Books', 'Sports Equipment', 'Other'];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <p className="text-lg font-semibold">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        {submitted ? (
          <div className="rounded-2xl border border-green-300 bg-green-50 p-8 text-center dark:border-green-700 dark:bg-green-900/20">
            <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400">✅ Posted Successfully!</h2>
            <p className="mt-3 text-green-600 dark:text-green-300">Thank you for helping our community. Redirecting to homepage...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-semibold">Post a Lost or Found Item</h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                Help reunite people with their belongings. Fill in the details about the item you lost or found.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
              
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Status *</label>
                <div className="mt-3 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={ItemStatus.LOST}
                      checked={formData.status === ItemStatus.LOST}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🔴</span> I Lost Something
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={ItemStatus.FOUND}
                      checked={formData.status === ItemStatus.FOUND}
                      onChange={handleChange}
                      className="h-4 w-4"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🟢</span> I Found Something
                    </span>
                  </label>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Name/Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Blue Umbrella, AirPods Pro, Student ID"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the item, color, brand, any identifying marks, etc."
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location (Where lost/found) *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Library, Building A 3rd Floor, Campus Gate"
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
              </div>

              {/* Contact Information */}
              <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
                <h3 className="mb-4 text-lg font-semibold">Your Contact Information</h3>

                <div className="space-y-4">
                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      name="userPhone"
                      value={formData.userPhone}
                      onChange={handleChange}
                      placeholder="09123456789"
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    />
                  </div>

                  <div className="rounded-lg bg-slate-100 dark:bg-slate-950 p-4 space-y-2 text-sm">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:hover:bg-indigo-700"
                >
                  {createMutation.isPending ? 'Posting...' : '✅ Post Item'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="flex-1 rounded-lg border border-slate-300 bg-slate-100 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
              </div>

              {createMutation.isError && (
                <div className="rounded-lg border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400">
                  <p className="font-semibold">Error posting item</p>
                  <p className="text-sm">{createMutation.error?.message}</p>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
