import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../api/client';
import { CreateLostFoundItemDto, ItemStatus } from '../../types/index';
import { useAuthStore } from '../store/authStore';
import { ItemSubmissionFormValues, ItemSubmissionSchema } from '../lib/itemSchema';

const ItemsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ItemSubmissionFormValues>({
    resolver: zodResolver(ItemSubmissionSchema),
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      description: '',
      category: 'Accessories',
      status: ItemStatus.LOST,
      location: '',
      userId: user?.id ?? 1,
      userName: user?.name ?? 'User',
      userEmail: user?.email ?? '',
      userPhone: '',
    },
  });

  useEffect(() => {
    if (user) {
      setValue('userId', user.id);
      setValue('userName', user.name);
      setValue('userEmail', user.email);
      reset((current) => ({ ...current, userId: user.id, userName: user.name, userEmail: user.email }));
    }
  }, [user, setValue, reset]);

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

  const onSubmit = (values: ItemSubmissionFormValues) => {
    const payload: CreateLostFoundItemDto = {
      title: values.title,
      description: values.description,
      category: values.category,
      status: values.status,
      location: values.location,
      userId: values.userId,
      userName: values.userName,
      userEmail: values.userEmail,
      userPhone: values.userPhone,
    };

    createMutation.mutate(payload);
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Status *</label>
                <div className="mt-3 flex gap-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value={ItemStatus.LOST}
                      {...register('status')}
                      className="h-4 w-4"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🔴</span> I Lost Something
                    </span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      value={ItemStatus.FOUND}
                      {...register('status')}
                      className="h-4 w-4"
                    />
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🟢</span> I Found Something
                    </span>
                  </label>
                </div>
                {errors.status && <p className="mt-2 text-sm text-red-600">{errors.status.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Item Name/Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Blue Umbrella, AirPods Pro, Student ID"
                  {...register('title')}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Category *</label>
                <select
                  {...register('category')}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label>
                <textarea
                  rows={4}
                  placeholder="Describe the item, color, brand, any identifying marks, etc."
                  {...register('description')}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
                {errors.description && <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Location (Where lost/found) *</label>
                <input
                  type="text"
                  placeholder="e.g., Library, Building A 3rd Floor, Campus Gate"
                  {...register('location')}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                />
                {errors.location && <p className="mt-2 text-sm text-red-600">{errors.location.message}</p>}
              </div>

              <div className="border-t border-slate-200 pt-6 dark:border-slate-700">
                <h3 className="mb-4 text-lg font-semibold">Your Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number *</label>
                    <input
                      type="tel"
                      placeholder="09123456789"
                      {...register('userPhone')}
                      className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
                    />
                    {errors.userPhone && <p className="mt-2 text-sm text-red-600">{errors.userPhone.message}</p>}
                  </div>

                  <div className="rounded-lg bg-slate-100 p-4 text-sm dark:bg-slate-950">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || isSubmitting}
                  className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50 dark:hover:bg-indigo-700"
                >
                  {createMutation.isPending || isSubmitting ? 'Posting...' : '✅ Post Item'}
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
