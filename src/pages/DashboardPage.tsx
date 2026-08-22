import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePrevious } from '../../hooks/usePrevious';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useUiStore } from '../store/uiStore';
import { LostFoundItem, ItemStatus } from '../../types/index';

const DashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'LOST' | 'FOUND'>('LOST');
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);

  const inputRef = useRef<HTMLInputElement>(null);
  const prevSearchTerm = usePrevious(searchTerm);
  const navigate = useNavigate();

  const { data: items = [], isLoading: itemsLoading } = useQuery<LostFoundItem[], Error>({ 
    queryKey: ['items'], 
    queryFn: () => api.getItems() 
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const filteredItems = (items ?? []).filter((item) =>
    item.status === activeTab && 
    (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isLoading = itemsLoading;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">Help Your Community</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Lost & Found</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Search for lost items or report what you found. Help others find their belongings!
              </p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">Search items</label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search by name, category, or location..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </div>
            <Link 
              to="/items" 
              className="flex items-center justify-center rounded-3xl border border-indigo-300 bg-indigo-50 p-4 text-indigo-700 font-semibold transition hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/40"
            >
              ➕ Post Lost/Found Item
            </Link>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('LOST')}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === 'LOST'
                  ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              🔴 Lost Items
            </button>
            <button
              onClick={() => setActiveTab('FOUND')}
              className={`px-4 py-3 font-semibold transition ${
                activeTab === 'FOUND'
                  ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              🟢 Found Items
            </button>
          </div>
        </header>

        <section>
          <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-100">
                  {activeTab === 'LOST' ? '🔴 Lost Items' : '🟢 Found Items'}
                </h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {activeTab === 'LOST' 
                    ? 'Check if your lost items have been reported found.' 
                    : 'View items that have been found. Contact if you recognize something!'}
                </p>
              </div>
              <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                {filteredItems.length} {activeTab === 'LOST' ? 'lost' : 'found'} item{filteredItems.length === 1 ? '' : 's'}
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200">
                <p className="text-lg font-semibold">Loading items...</p>
                <p className="mt-2 text-sm">Connecting to database...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200">
                <p className="text-lg font-semibold">No {activeTab === 'LOST' ? 'lost' : 'found'} items found</p>
                <p className="mt-2 text-sm">Try adjusting your search or check back later!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <Link
                    key={item.id}
                    to={`/items/${item.id}`}
                    className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-600"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          {item.category}
                        </p>
                      </div>
                      <span className={`ml-2 rounded-full px-2 py-1 text-xs font-semibold ${
                        item.status === 'LOST'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>📍 {item.location}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>👤 {item.userName}</span>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/items/${item.id}`);
                        }}
                        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-800"
                      >
                        View Details
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
};

export default DashboardPage;
