import React from 'react';

interface CourseCardProps {
  title: string;
  description: string;
  variant?: 'default' | 'compact';
}

export const CourseCard: React.FC<CourseCardProps> = ({ title, description, variant = 'default' }) => {
  const baseClasses = 'rounded-3xl border p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg';
  const variantClasses = variant === 'compact'
    ? 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
    : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950';

  return (
    <article className={`${baseClasses} ${variantClasses}`}>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
    </article>
  );
};
