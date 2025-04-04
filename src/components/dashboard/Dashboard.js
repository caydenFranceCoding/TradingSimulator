// src/components/dashboard/Dashboard.js
import React, { useContext } from 'react';
import { MarketContext } from '../../context/MarketContext';
import { PortfolioContext } from '../../context/PortfolioContext';
import NewsFeed from '../news/NewsFeed';
import MarketOverview from './MarketOverview';
import './Dashboard.css';

const Dashboard = () => {
  const { day, assets } = useContext(MarketContext);
  const { cash, holdings, calculatePortfolioValue } = useContext(PortfolioContext);

  const { holdingsValue, totalValue } = calculatePortfolioValue();

  return (
    <div className="dashboard">
      <div className="market-day">
        <h2>Trading Dashboard</h2>
        <h3>Market Day: {day}</h3>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-column">
          <div className="dashboard-card portfolio-summary">
            <h3>Portfolio Summary</h3>
            <div className="portfolio-values">
              <div className="value-card cash">
                <div className="value-label">Cash</div>
                <div className="value-amount">${cash.toFixed(2)}</div>
              </div>
              <div className="value-card holdings">
                <div className="value-label">Holdings Value</div>
                <div className="value-amount">${holdingsValue.toFixed(2)}</div>
              </div>
              <div className="value-card total">
                <div className="value-label">Total Value</div>
                <div className="value-amount">${totalValue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-column">
          <MarketOverview />
        </div>
      </div>

      <div className="dashboard-wide">
        <NewsFeed />
      </div>

      <div className="dashboard-card">
        <h3>Your Holdings</h3>
        {Object.keys(holdings).length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Shares</th>
                <th>Avg. Price</th>
                <th>Current Price</th>
                <th>Total Value</th>
                <th>Profit/Loss</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(holdings).map(symbol => {
                const holding = holdings[symbol];
                const asset = assets[symbol];
                const currentValue = holding.shares * asset.price;
                const profitLoss = currentValue - (holding.shares * holding.avgPrice);
                const profitLossPercent = (profitLoss / (holding.shares * holding.avgPrice)) * 100;

                return (
                  <tr key={symbol}>
                    <td><strong>{symbol}</strong></td>
                    <td>{asset.name}</td>
                    <td>{holding.shares}</td>
                    <td>${holding.avgPrice.toFixed(2)}</td>
                    <td>${asset.price.toFixed(2)}</td>
                    <td>${currentValue.toFixed(2)}</td>
                    <td className={profitLoss >= 0 ? 'positive' : 'negative'}>
                      ${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
                    </td>
                    <td>
                      <button className="btn btn-success">Buy</button>
                      <button className="btn btn-danger">Sell</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No holdings yet. Start trading to build your portfolio!</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;