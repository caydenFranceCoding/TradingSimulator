// src/components/watchlist/Watchlist.js
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketContext } from '../../context/MarketContext';
import './Watchlist.css';

const Watchlist = () => {
  const { assets, setSelectedAsset } = useContext(MarketContext);
  const [watchlist, setWatchlist] = useState([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filteredSymbols, setFilteredSymbols] = useState([]);
  const navigate = useNavigate();

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    } else {
      // Default watchlist with some popular symbols
      const defaultWatchlist = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
      setWatchlist(defaultWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(defaultWatchlist));
    }
  }, []);

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Filter available symbols based on user input
  useEffect(() => {
    if (newSymbol.trim() === '') {
      setFilteredSymbols([]);
      return;
    }

    const searchTerm = newSymbol.toUpperCase();
    const matches = Object.keys(assets)
      .filter(symbol => symbol.includes(searchTerm) || assets[symbol].name.toUpperCase().includes(searchTerm))
      .filter(symbol => !watchlist.includes(symbol))
      .slice(0, 5); // Limit to 5 suggestions

    setFilteredSymbols(matches);
  }, [newSymbol, assets, watchlist]);

  // Add a symbol to watchlist
  const addToWatchlist = (symbol) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
    }
    setNewSymbol('');
    setShowSearch(false);
  };

  // Remove a symbol from watchlist
  const removeFromWatchlist = (symbol, e) => {
    e.stopPropagation(); // Prevent row click event from firing
    setWatchlist(watchlist.filter(item => item !== symbol));
  };

  // Handle click on a watchlist item
  const handleWatchlistItemClick = (symbol) => {
    setSelectedAsset(symbol);
    navigate('/trading');
  };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h3>Watchlist</h3>
        {!showSearch ? (
          <button
            className="add-symbol-btn"
            onClick={() => setShowSearch(true)}
          >
            + Add Symbol
          </button>
        ) : (
          <div className="symbol-search">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Enter symbol or name..."
              autoFocus
            />
            <button
              className="cancel-search-btn"
              onClick={() => {
                setShowSearch(false);
                setNewSymbol('');
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {showSearch && filteredSymbols.length > 0 && (
        <div className="symbol-suggestions">
          {filteredSymbols.map(symbol => (
            <div
              key={symbol}
              className="suggestion-item"
              onClick={() => addToWatchlist(symbol)}
            >
              <span className="suggestion-symbol">{symbol}</span>
              <span className="suggestion-name">{assets[symbol].name}</span>
            </div>
          ))}
        </div>
      )}

      {watchlist.length > 0 ? (
        <div className="watchlist-table-container">
          <table className="watchlist-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map(symbol => {
                if (!assets[symbol]) return null;

                const asset = assets[symbol];
                const priceChange = asset.price - asset.previousPrice;
                const priceChangePercent = (priceChange / asset.previousPrice) * 100;
                const isPositive = priceChange >= 0;

                return (
                  <tr
                    key={symbol}
                    className="watchlist-item"
                    onClick={() => handleWatchlistItemClick(symbol)}
                  >
                    <td className="symbol-cell">
                      <div>{symbol}</div>
                      <div className="asset-name">{asset.name}</div>
                    </td>
                    <td className="price-cell">${asset.price.toFixed(2)}</td>
                    <td className={`change-cell ${isPositive ? 'positive' : 'negative'}`}>
                      {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                    </td>
                    <td className="action-cell">
                      <button
                        className="remove-btn"
                        onClick={(e) => removeFromWatchlist(symbol, e)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-watchlist">
          <p>Your watchlist is empty. Add symbols to track them here.</p>
        </div>
      )}
    </div>
  );
};

export default Watchlist;