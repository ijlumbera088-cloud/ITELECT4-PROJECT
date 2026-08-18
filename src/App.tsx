import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import ItemsPage from './pages/ItemsPage';
import ItemDetail from './pages/ItemDetail';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<DashboardPage />} />
      <Route path="items" element={<ItemsPage />} />
      <Route path="items/:id" element={<ItemDetail />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="protected" element={<ProtectedRoute />}>
        <Route index element={<div className="p-6">Protected content</div>} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
);

export default App;
