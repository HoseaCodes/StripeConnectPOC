// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RefreshRedirect from './pages/RefreshRedirect';
import ReturnPage from './pages/ReturnPage';
import ErrorPage from './pages/ErrorPage'; // Custom error page component
import { AuthProvider } from './context/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const App = () => {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/refresh" element={<RefreshRedirect />} />
            <Route path="/return" element={<ReturnPage />} />
            <Route path="/error" element={<ErrorPage />} />
          </Routes>
        </Router>
      </Elements>
    </AuthProvider>
  );
};

export default App;
