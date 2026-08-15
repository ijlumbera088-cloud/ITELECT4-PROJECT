import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const LoginPage: React.FC = () => {
  const [tokenInput, setTokenInput] = useState('');
  const login = useAuthStore((s) => s.login);
  const navigate = useNavigate();

  const handleLogin = () => {
    login(tokenInput || 'demo-token');
    navigate('/', { replace: true });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold">Login</h2>
      <div className="mt-4 max-w-sm">
        <label className="block text-sm font-medium">Token</label>
        <input value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} className="mt-2 w-full rounded border px-3 py-2" />
        <div className="mt-4">
          <button onClick={handleLogin} className="rounded bg-indigo-600 px-4 py-2 text-white">Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
