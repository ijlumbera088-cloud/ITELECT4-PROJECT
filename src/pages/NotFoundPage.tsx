import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="p-8 text-center">
    <h2 className="text-3xl font-semibold">Page not found</h2>
    <p className="mt-4">The page you requested doesn't exist.</p>
    <div className="mt-6">
      <Link to="/" className="text-indigo-600 underline">Go home</Link>
    </div>
  </div>
);

export default NotFoundPage;
