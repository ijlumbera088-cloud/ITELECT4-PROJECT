import React from 'react';
import { Link } from 'react-router-dom';

const CoursesPage: React.FC = () => {
  // simple placeholder page listing links
  const courses = [
    { id: '1', title: 'ITELECT4' },
    { id: '2', title: 'CCPROG1' },
    { id: '3', title: 'CCDSALG' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">All Courses</h2>
      <ul className="space-y-2">
        {courses.map((c) => (
          <li key={c.id}>
            <Link to={`/courses/${c.id}`} className="text-indigo-600 underline">
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoursesPage;
