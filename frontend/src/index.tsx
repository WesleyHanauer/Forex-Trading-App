import React from 'react';
import ReactDOM from 'react-dom/client';
import RegisterView from './components/register';
import LoginView from './components/login';
import Trades from './components/trades';
import Dashboard from './components/dashboard';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

function RootRedirect() {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return <Navigate to={isLoggedIn ? '/dashboard' : '/login'} />;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/trades" element={<Trades />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
