import React, { useState } from 'react';
import { api } from '../api/client';

interface ReviewResult {
  summary: string;
  risk: 'low' | 'medium' | 'high';
  recommendation: 'approve' | 'flag' | 'request_more_info';
  confidence: number;
}

const emptyForm = {
  title: '',
  description: '',
  category: 'Accessories',
  location: '',
  status: 'LOST',
};

const AIReviewPage: React.FC = () => {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.reviewItem(form);
      const review = response.review as ReviewResult | undefined;
      setResult(review ?? null);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'AI review failed.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
          Gemini AI Review
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-50">AI Item Review</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</span>
              <input
                value={form.title}
                onChange={(event) => handleChange('title', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
                placeholder="Blue backpack"
                required
              />
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</span>
              <textarea
                value={form.description}
                onChange={(event) => handleChange('description', event.target.value)}
                className="min-h-32 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
                placeholder="Black backpack with a broken zipper and red keychain."
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</span>
              <input
                value={form.category}
                onChange={(event) => handleChange('category', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Status</span>
              <select
                value={form.status}
                onChange={(event) => handleChange('status', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
              >
                <option value="LOST">LOST</option>
                <option value="FOUND">FOUND</option>
              </select>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Location</span>
              <input
                value={form.location}
                onChange={(event) => handleChange('location', event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-50"
                placeholder="Library second floor"
                required
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Reviewing...' : 'Review with Gemini'}
          </button>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">AI Feedback</h2>

          {error ? (
            <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300">
              {error}
            </div>
          ) : result ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Summary</p>
                <p className="mt-2 text-base text-slate-800 dark:text-slate-200">{result.summary}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Risk</p>
                  <p className="mt-2 font-semibold capitalize text-slate-900 dark:text-slate-50">{result.risk}</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Confidence</p>
                  <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">{result.confidence}%</p>
                </div>
              </div>

              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-950/30">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:text-indigo-300">Recommendation</p>
                <p className="mt-2 font-semibold capitalize text-indigo-800 dark:text-indigo-200">{result.recommendation}</p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 p-5 text-sm text-slate-600 dark:border-slate-600 dark:text-slate-300">
              Submit a report to get an AI-generated review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIReviewPage;
