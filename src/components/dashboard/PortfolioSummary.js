// src/components/dashboard/PortfolioSummary.js
import React, { useContext, useState, useEffect } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { MarketContext } from '../../context/MarketContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const PortfolioSummary = () => {
  const { cash, holdings, calculatePortfolioValue, transactions } = useContext(PortfolioContext);
  const { assets } = useContext(MarketContext);
  const [historicalValue, setHistoricalValue] = useState([]);
  const [performance, setPerformance] = useState({
    dayChange: 0,
    dayChangePercent: 0,
    totalReturn: 0,
    totalReturnPercent: 0
  });

  // Calculate current portfolio value
  const { holdingsValue, totalValue } = calculatePortfolioValue();

  // Calculate performance metrics
  useEffect(() => {
    // This would normally calculate based on actual historical data
    // For now, we'll simulate some basic metrics

    // Simulate a previous day value as 0.5-1.5% different
    const randomFactor = 0.995 + (Math.random() * 0.01);
    const previousDayValue = totalValue * randomFactor;

    // Calculate day change
    const dayChange = totalValue - previousDayValue;
    const dayChangePercent = (dayChange / previousDayValue) * 100;

    // For total return, we'll use initial cash (10000) as the baseline
    const initialValue = 10000; // This is our starting cash value
    const totalReturn = totalValue - initialValue;
    const totalReturnPercent = (totalReturn / initialValue) * 100;

    setPerformance({
      dayChange,
      dayChangePercent,
      totalReturn,
      totalReturnPercent
    });

    // Add to historical value (in a real app, this would be stored persistently)
    setHistoricalValue(prev => [
      ...prev,
      { day: prev.length + 1, value: totalValue }
    ]);
  }, [totalValue]);

  return (
    <div className="portfolio-summary">
      <h3>Portfolio Summary</h3>

      <div className="portfolio-values">
        <div className="value-card total">
          <div className="value-label">Total Value</div>
          <div className="value-amount">{formatCurrency(totalValue)}</div>
          <div className={`value-change ${performance.dayChange >= 0 ? 'positive' : 'negative'}`}>
            {performance.dayChange >= 0 ? '+' : ''}
            {formatCurrency(performance.dayChange)} ({performance.dayChangePercent.toFixed(2)}%)
          </div>
        </div>

        <div className="value-card cash">
          <div className="value-label">Cash</div>
          <div className="value-amount">{formatCurrency(cash)}</div>
          <div className="value-percent">{((cash / totalValue) * 100).toFixed(1)}% of portfolio</div>
        </div>

        <div className="value-card holdings">
          <div className="value-label">Investments</div>
          <div className="value-amount">{formatCurrency(holdingsValue)}</div>
          <div className="value-percent">{((holdingsValue / totalValue) * 100).toFixed(1)}% of portfolio</div>
        </div>
      </div>

      <div className="portfolio-performance">
        <h4>Performance</h4>
        <div className="performance-metrics">
          <div className="metric">
            <div className="metric-label">Today</div>
            <div className={`metric-value ${performance.dayChange >= 0 ? 'positive' : 'negative'}`}>
              {performance.dayChange >= 0 ? '+' : ''}
              {formatCurrency(performance.dayChange)} ({performance.dayChangePercent.toFixed(2)}%)
            </div>
          </div>

          <div className="metric">
            <div className="metric-label">Total Return</div>
            <div className={`metric-value ${performance.totalReturn >= 0 ? 'positive' : 'negative'}`}>
              {performance.totalReturn >= 0 ? '+' : ''}
              {formatCurrency(performance.totalReturn)} ({performance.totalReturnPercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      <div className="asset-allocation">
        <h4>Asset Allocation</h4>
        {Object.keys(holdings).length > 0 ? (
          <div className="allocation-chart">
            {Object.keys(holdings).map(symbol => {
              const asset = assets[symbol];
              const holdingValue = holdings[symbol].shares * asset.price;
              const percentage = (holdingValue / holdingsValue) * 100;

              return (
                <div key={symbol} className="allocation-bar" style={{ width: `${percentage}%` }}>
                  <div className="allocation-label">
                    {symbol} ({percentage.toFixed(1)}%)
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-holdings-message">No investments yet. Start trading to build your portfolio!</p>
        )}
      </div>

      <div className="recent-