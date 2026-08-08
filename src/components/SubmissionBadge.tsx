import React from 'react';

interface SubmissionBadgeProps {
  course: string;
  student: string;
  grade?: number;
  status: 'submitted' | 'late' | 'missing';
}

const statusStyles: Record<SubmissionBadgeProps['status'], string> = {
  submitted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-200',
  late: 'bg-amber-100 text-amber-900 dark:bg-amber-900/70 dark:text-amber-100',
  missing: 'bg-rose-100 text-rose-900 dark:bg-rose-900/70 dark:text-rose-100',
};

export const SubmissionBadge: React.FC<SubmissionBadgeProps> = ({ course, student, grade, status }) => (
  <div className={`rounded-3xl border border-slate-200 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950 ${statusStyles[status]}`}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 dark:text-slate-100">{status}</span>
      {typeof grade === 'number' ? (
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">Grade {grade}</span>
      ) : (
        <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-100">No grade</span>
      )}
    </div>
    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{course}</h4>
    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">Submitted by {student}</p>
  </div>
);
