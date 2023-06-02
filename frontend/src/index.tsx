import React from 'react';
import { render } from 'react-dom';
import RegisterView from './components/register';
import LoginView from './components/login';
import Trades from './components/trades';
import Dashboard from './components/dashboard';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

function RootRedirect() {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return <Navigate to={isLoggedIn ? '/dashboard' : '/login'} />;
}

const rootElement = document.getElementById('root');

render(
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
  </React.StrictMode>,
  rootElement
);
