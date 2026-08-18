import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrevious } from '../../hooks/usePrevious';
import { CourseCard } from '../components/CourseCard';
import { useQuery } from '@tanstack/react-query';
import { api, Item, EventItem } from '../api/client';
import { useUiStore } from '../store/uiStore';

const DashboardPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const darkMode = useUiStore((s) => s.darkMode);
  const toggleDarkMode = useUiStore((s) => s.toggleDarkMode);

  const inputRef = useRef<HTMLInputElement>(null);
  const prevSearchTerm = usePrevious(searchTerm);
  const navigate = useNavigate();

  const { data: items, isLoading: itemsLoading } = useQuery<Item[], Error>({ queryKey: ['items'], queryFn: () => api.getItems() });
  const { data: events, isLoading: eventsLoading } = useQuery<EventItem[], Error>({ queryKey: ['events'], queryFn: () => api.getEvents() });

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
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = itemsLoading || eventsLoading;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">GT3 Part 1</p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Responsive Tailwind Dashboard</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                A dynamic React interface with responsive cards, dark mode, and styled loading/error states.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              {darkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <label className="block text-sm font-medium text-slate-800 dark:text-slate-200">Search courses</label>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mt-3 w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-sm text-slate-600 dark:text-slate-300">Previous search term</p>
              <p className="mt-2 rounded-3xl bg-slate-100 px-4 py-3 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
                {prevSearchTerm || 'No previous search yet'}
              </p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-100">Available Items</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Items load from the API and reflow using responsive Tailwind grids.
                  </p>
                </div>
                <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
                  {(filteredItems ?? []).length} item{(filteredItems ?? []).length === 1 ? '' : 's'} found
                </span>
              </div>

              {isLoading ? (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-700 shadow-sm dark:border-slate-600 dark:bg-slate-950 dark:text-slate-200">
                  <p className="text-lg font-semibold">Loading items...</p>
                  <p className="mt-2 text-sm">Connecting to local API. Make sure `npm run api` is running.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredItems.map((item, index) => (
                    <div key={item.id}>
                      <CourseCard
                        title={item.name}
                        description={item.description ?? ''}
                        variant={index % 2 === 0 ? 'default' : 'compact'}
                      />
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={() => navigate(`/items/${item.id}`)}
                          className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Upcoming events</h2>
                <div className="mt-5 space-y-4">
                  {(events ?? []).map((ev) => (
                    <div key={ev.id} className="rounded-3xl border p-4">
                      <h3 className="font-semibold">{ev.title}</h3>
                      <p className="text-sm">{new Date(ev.date).toLocaleString()} — {ev.location}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
                <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Quick actions</h2>
                <div className="mt-5 space-y-4">
                  <button onClick={() => navigate('/items')} className="rounded bg-indigo-600 px-4 py-2 text-white">Browse items</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[32px] border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-slate-100">Dashboard notes</h2>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                <li>• Responsive grid breakpoints: small screens and large screens.</li>
                <li>• Dark mode is toggled via a `dark` root class.</li>
                <li>• Component variants are shown in default and compact course cards.</li>
                <li>• Loading state is styled using border and card UI instead of plain text.</li>
              </ul>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
};

export default DashboardPage;
