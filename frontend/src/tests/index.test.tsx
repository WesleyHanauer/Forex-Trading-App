import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterView from './components/register.test';
import LoginView from './components/login.test';
import Trades from './components/trades.test';
import Dashboard from './components/dashboard.test';

function RootRedirect() {
  const isLoggedIn = localStorage.getItem('token') !== null;

  return isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}

describe('App', () => {
  it('should render RegisterView component when /register is accessed', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<RegisterView />} />
        </Routes>
      </BrowserRouter>
    );

    // Add your assertions for RegisterView component here
  });

  it('should render LoginView component when /login is accessed', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginView />} />
        </Routes>
      </BrowserRouter>
    );

    // Add your assertions for LoginView component here
  });

  it('should render Trades component when /trades is accessed', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/trades" element={<Trades />} />
        </Routes>
      </BrowserRouter>
    );

    // Add your assertions for Trades component here
  });

  it('should render Dashboard component when /dashboard is accessed', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    );

    // Add your assertions for Dashboard component here
  });
});
