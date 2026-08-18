import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const Layout: React.FC = () => (
  <div>
    <nav className="bg-white border-b p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold text-lg">MyGT App</Link>
          <Link to="/items" className="text-sm text-slate-600">Items</Link>
          <Link to="/protected" className="text-sm text-slate-600">Protected</Link>
        </div>
        <div>
          <Link to="/login" className="text-sm text-indigo-600">Login</Link>
        </div>
      </div>
    </nav>

    <Outlet />
  </div>
);

export default Layout;
