import React, { useContext } from 'react';
import { MarketContext } from '../../context/MarketContext';
import './MarketOverview.css';

const MarketOverview = () => {
  const { indices, getMarketMovers, marketTrend } = useContext(MarketContext);

  const { gainers, losers } = getMarketMovers();

  const getMarketSentiment = () => {
    if (marketTrend > 0) {
      return { text: 'Bullish', color: '#2ecc71' };
    } else if (marketTrend < 0) {
      return { text: 'Bearish', color: '#e74c3c' };
    } else {
      return { text: 'Neutral', color: '#f39c12' };
    }
  };

  const sentiment = getMarketSentiment();

  return (
    <div className="market-overview">
      <div className="overview-section">
        <h3 className="section-title">Market Indices</h3>
        <div className="indices-container">
          {Object.keys(indices).map(symbol => {
            const index = indices[symbol];
            const priceChange = index.price - index.previousPrice;
            const priceChangePercent = (priceChange / index.previousPrice) * 100;
            const isPositive = priceChange >= 0;

            return (
              <div key={symbol} className="index-card">
                <div className="index-name">{index.name}</div>
                <div className="index-price">${index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={`index-change ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '+' : ''}${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="overview-section">
        <h3 className="section-title">Market Sentiment</h3>
        <div className="sentiment-container">
          <div className="sentiment-gauge">
            <div
              className="sentiment-indicator"
              style={{
                left: `${(marketTrend + 1) * 50}%`,
                backgroundColor: sentiment.color
              }}
            ></div>
            <div className="sentiment-scale">
              <span>Bearish</span>
              <span>Neutral</span>
              <span>Bullish</span>
            </div>
          </div>
          <div className="sentiment-text" style={{ color: sentiment.color }}>
            Current Market Sentiment: <strong>{sentiment.text}</strong>
          </div>
        </div>
      </div>

      <div className="overview-section gainers-losers">
        <div className="movers-section">
          <h3 className="section-title">Top Gainers</h3>
          <div className="movers-list">
            {gainers.map(item => (
              <div key={item.symbol} className="mover-item">
                <span className="mover-symbol">{item.symbol}</span>
                <span className="mover-change positive">+{item.change.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="movers-section">
          <h3 className="section-title">Top Losers</h3>
          <div className="movers-list">
            {losers.map(item => (
              <div key={item.symbol} className="mover-item">
                <span className="mover-symbol">{item.symbol}</span>
                <span className="mover-change negative">{item.change.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;