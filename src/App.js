import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MarketProvider } from './context/MarketContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Header from './components/layout/Header';
import Dashboard from './components/dashboard/Dashboard';
import Trading from './components/trading/Trading';
import './App.css';

function App() {
  return (
    <MarketProvider>
      <PortfolioProvider>
        <Router>
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
        </Router>
      </PortfolioProvider>
    </MarketProvider>
  );
}

export default App;