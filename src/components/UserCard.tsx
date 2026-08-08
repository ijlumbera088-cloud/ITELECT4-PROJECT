import React from 'react';

interface UserCardProps {
  name: string;
  email: string;
  role: string;
  compact?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ name, email, role, compact = false }) => {
  const containerClasses = compact
    ? 'rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-sm transition duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/90'
    : 'rounded-[28px] border border-slate-200 bg-white/95 p-6 shadow-sm transition duration-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/95';

  return (
    <div className={containerClasses}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:bg-indigo-900 dark:text-indigo-200">
          {role}
        </span>
      </div>
      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{email}</p>
    </div>
  );
};
