import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Layout: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div>
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
              🔴🟢 Lost & Found
            </Link>
            <div className="hidden sm:flex items-center gap-4">
              <Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                Home
              </Link>
              <Link to="/items" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                Post Item
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-semibold text-white transition dark:hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
