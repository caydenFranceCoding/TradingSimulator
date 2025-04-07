import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MarketContext } from '../../context/MarketContext';
import { useAuth } from '../../context/AuthContext';
import { logOut } from '../../firebase/auth';
import './Header.css';

const Header = () => {
  const { day, advanceDay } = useContext(MarketContext);
  const { currentUser, userData } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActivePath = (path) => {
    return location.pathname === `/app${path}`;
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <h1>Asphire Trading</h1>
      </div>
      <nav className="navigation">
        <Link to="/app" className={`nav-link ${isActivePath('/') ? 'active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/app/trading" className={`nav-link ${isActivePath('/trading') ? 'active' : ''}`}>
          Trading
        </Link>
        <Link to="/app/market" className={`nav-link ${isActivePath('/market') ? 'active' : ''}`}>
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

        <div className="user-menu-container">
          <div
            className="user-info"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Profile"
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar-placeholder">
                {currentUser?.displayName?.charAt(0) || userData?.name?.charAt(0) || 'U'}
              </div>
            )}
            <span className="user-name">
              {currentUser?.displayName || userData?.name || 'User'}
            </span>
          </div>

          {showUserMenu && (
            <div className="user-dropdown">
              <Link to="/app/profile" className="dropdown-item">Profile</Link>
              <Link to="/app/settings" className="dropdown-item">Settings</Link>
              <button onClick={handleLogout} className="dropdown-item logout">
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;