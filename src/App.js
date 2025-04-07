import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MarketProvider } from './context/MarketContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Trading from './components/trading/Trading';
import LandingPage from './components/landing/LandingPage';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <MarketProvider>
        <PortfolioProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Protected routes */}
              <Route element={<PrivateRoute />}>
                {/* App routes with Header */}
                <Route path="/app/*" element={
                  <div className="app-container">
                    <Header />
                    <div className="main-content">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/trading" element={<Trading />} />
                        <Route path="/market" element={<div>Market View Coming Soon</div>} />
                      </Routes>
                    </div>
                  </div>
                } />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </PortfolioProvider>
      </MarketProvider>
    </AuthProvider>
  );
}

export default App;