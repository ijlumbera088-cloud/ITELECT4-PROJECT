import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { LostFoundItem } from '../../types/index';

const ItemDetail: React.FC = () => {
  const params = useParams() as { id?: string };
  const id = params.id ?? '0';
  const idNum = Number(id);
  const navigate = useNavigate();

  const { data: item, isLoading, isError } = useQuery<LostFoundItem, Error>({ 
    queryKey: ['items', idNum], 
    queryFn: () => api.getItem(idNum), 
    enabled: !!idNum 
  });

  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl text-center py-16">
        <p className="text-lg font-semibold">Loading item details...</p>
      </div>
    </div>
  );

  if (isError || !item) return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-red-300 bg-red-50 p-8 text-center dark:border-red-700 dark:bg-red-900/20">
          <h2 className="text-2xl font-semibold text-red-700 dark:text-red-400">❌ Item Not Found</h2>
          <p className="mt-3 text-red-600 dark:text-red-300">This item doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  const isLost = item.status === 'LOST';
  const statusColor = isLost ? 'red' : 'green';

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-2xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 font-semibold text-slate-900 transition hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          ← Go Back
        </button>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
          
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold">{item.title}</h1>
                <span className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  isLost
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {isLost ? '🔴 LOST' : '🟢 FOUND'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Posted on {new Date(item.createdAt).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          {/* Item Details */}
          <div className="mt-8 space-y-6 border-t border-slate-200 pt-8 dark:border-slate-700">
            
            {/* Category & Location */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Category</h3>
                <p className="mt-2 text-lg font-semibold">{item.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {isLost ? 'Lost at' : 'Found at'}
                </h3>
                <p className="mt-2 text-lg font-semibold">📍 {item.location}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Description</h3>
              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-base leading-relaxed dark:bg-slate-950">
                {item.description}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-700">
            <h2 className="text-lg font-semibold">Contact Information</h2>
            <div className="mt-4 space-y-3 rounded-lg bg-slate-50 p-6 dark:bg-slate-950">
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Name</h3>
                <p className="mt-1 text-base font-semibold">{item.userName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</h3>
                <a
                  href={`mailto:${item.userEmail}`}
                  className="mt-1 text-base font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {item.userEmail}
                </a>
              </div>
              <div>
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</h3>
                <a
                  href={`tel:${item.userPhone}`}
                  className="mt-1 text-base font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  {item.userPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${item.userEmail}?subject=${isLost ? 'Found your lost ' : 'About your found '}${item.title}`}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white transition hover:bg-indigo-700"
            >
              📧 Send Email
            </a>
            <a
              href={`tel:${item.userPhone}`}
              className="flex-1 rounded-lg border border-indigo-600 bg-white px-6 py-3 text-center font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-indigo-400 dark:bg-slate-900 dark:text-indigo-400 dark:hover:bg-slate-800"
            >
              📞 Call
            </a>
          </div>

          {/* Status Info */}
          {item.resolved && (
            <div className="mt-6 rounded-lg border border-green-300 bg-green-50 p-4 dark:border-green-700 dark:bg-green-900/20">
              <p className="font-semibold text-green-700 dark:text-green-400">✅ This item has been resolved</p>
              <p className="mt-1 text-sm text-green-600 dark:text-green-300">
                The person who posted this has indicated they found what they were looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
