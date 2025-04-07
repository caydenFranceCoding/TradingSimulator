import React, { useContext, useState } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { MarketContext } from '../../context/MarketContext';
import './TradeHistory.css';

const TradeHistory = () => {
  const { transactions } = useContext(PortfolioContext);
  const { assets } = useContext(MarketContext);
  const [sortOption, setSortOption] = useState('date-desc');
  const [filter, setFilter] = useState('all');

  // Create a filtered and sorted version of the transactions
  const getFilteredTransactions = () => {
    let filtered = [...transactions];

    // Apply filters
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.type === filter);
    }

    // Apply sorting
    switch (sortOption) {
      case 'date-asc':
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'date-desc':
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'shares-asc':
        filtered.sort((a, b) => a.shares - b.shares);
        break;
      case 'shares-desc':
        filtered.sort((a, b) => b.shares - a.shares);
        break;
      default:
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate current profit/loss for each transaction
  const calculatePL = (transaction) => {
    const asset = assets[transaction.symbol];
    if (!asset) return { value: 0, percent: 0 };

    if (transaction.type === 'buy') {
      const currentValue = transaction.shares * asset.price;
      const cost = transaction.total;
      const plValue = currentValue - cost;
      const plPercent = (plValue / cost) * 100;
      return { value: plValue, percent: plPercent };
    }

    return { value: 0, percent: 0 }; // For sell transactions, we don't calculate ongoing P/L
  };

  return (
    <div className="trade-history">
      <div className="history-header">
        <h3>Transaction History</h3>
        <div className="history-controls">
          <div className="filter-control">
            <label htmlFor="type-filter">Filter:</label>
            <select
              id="type-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Transactions</option>
              <option value="buy">Buy Orders</option>
              <option value="sell">Sell Orders</option>
            </select>
          </div>
          <div className="sort-control">
            <label htmlFor="sort-option">Sort By:</label>
            <select
              id="sort-option"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="price-desc">Price (Highest First)</option>
              <option value="price-asc">Price (Lowest First)</option>
              <option value="shares-desc">Shares (Most First)</option>
              <option value="shares-asc">Shares (Least First)</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTransactions.length > 0 ? (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Day</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Shares</th>
                <th>Price</th>
                <th>Total</th>
                <th>Current P/L</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => {
                const pl = calculatePL(transaction);
                const isProfitable = pl.value >= 0;

                return (
                  <tr key={index} className={transaction.type === 'buy' ? 'buy-order' : 'sell-order'}>
                    <td>{transaction.day}</td>
                    <td className="symbol-cell">{transaction.symbol}</td>
                    <td className={`type-cell ${transaction.type}`}>
                      {transaction.type.toUpperCase()}
                    </td>
                    <td>{transaction.shares}</td>
                    <td>${transaction.price.toFixed(2)}</td>
                    <td>${transaction.total.toFixed(2)}</td>
                    <td className={transaction.type === 'buy' ? (isProfitable ? 'positive' : 'negative') : ''}>
                      {transaction.type === 'buy' ? (
                        <>
                          ${pl.value.toFixed(2)} ({pl.percent >= 0 ? '+' : ''}{pl.percent.toFixed(2)}%)
                        </>
                      ) : (
                        'N/A'
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-transactions">
          <p>No transactions match your filter criteria.</p>
        </div>
      )}

      <div className="history-summary">
        <div className="summary-item">
          <span className="summary-label">Total Transactions:</span>
          <span className="summary-value">{filteredTransactions.length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Buy Orders:</span>
          <span className="summary-value">{filteredTransactions.filter(t => t.type === 'buy').length}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Sell Orders:</span>
          <span className="summary-value">{filteredTransactions.filter(t => t.type === 'sell').length}</span>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;