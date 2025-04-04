import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MarketContext } from '../../context/MarketContext';
import './Header.css';

const Header = () => {
  const { day, advanceDay } = useContext(MarketContext);
  const location = useLocation();

  return (
    <header className="header">
      <div className="logo">
        <h1>Asphire Trading</h1>
      </div>
      <nav className="navigation">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/trading" className={`nav-link ${location.pathname === '/trading' ? 'active' : ''}`}>
          Trading
        </Link>
        <Link to="/market" className={`nav-link ${location.pathname === '/market' ? 'active' : ''}`}>
          Market
        </Link>
      </nav>
      <div className="controls">
        <div className="day-control">
          <span className="day-label">Market Day:</span>
          <span className="day-number">{day}</span>
        </div>
        <button className="next-day-btn" onClick={advanceDay}>
          Next Day
        </button>
      </div>
    </header>
  );
};

export default Header;