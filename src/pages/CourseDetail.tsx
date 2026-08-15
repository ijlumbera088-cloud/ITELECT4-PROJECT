import React from 'react';
import { useParams } from 'react-router-dom';

const CourseDetail: React.FC = () => {
  const params = useParams() as { id?: string };
  const id = params.id ?? 'unknown';

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Course detail</h2>
      <p className="mt-3 text-sm text-slate-700">You are viewing course id: <strong>{id}</strong></p>
    </div>
  );
};

export default CourseDetail;
