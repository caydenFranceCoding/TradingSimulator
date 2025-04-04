import React, { useContext } from 'react';
import { MarketContext } from '../../context/MarketContext';
import { Link } from 'react-router-dom';

const MarketOverview = () => {
  const { assets } = useContext(MarketContext);

  // Calculate market trend (how many assets are up vs down)
  const marketTrend = Object.values(assets).reduce(
    (acc, asset) => {
      if (asset.price > asset.previousPrice) {
        acc.up += 1;
      } else if (asset.price < asset.previousPrice) {
        acc.down += 1;
      } else {
        acc.unchanged += 1;
      }
      return acc;
    },
    { up: 0, down: 0, unchanged: 0 }
  );

  // Sort assets by percent change (descending)
  const sortedAssets = Object.keys(assets)
    .map(symbol => ({
      symbol,
      ...assets[symbol],
      change: assets[symbol].price - assets[symbol].previousPrice,
      changePercent: ((assets[symbol].price - assets[symbol].previousPrice) / assets[symbol].previousPrice) * 100
    }))
    .sort((a, b) => b.changePercent - a.changePercent);

  // Get top gainers and losers
  const topGainers = sortedAssets.filter(asset => asset.change > 0).slice(0, 3);
  const topLosers = [...sortedAssets].filter(asset => asset.change < 0).slice(-3).reverse();

  return (
    <div className="market-overview">
      <div className="market-sentiment">
        <h3>Market Sentiment</h3>
        <div className="sentiment-bars">
          <div className="sentiment-bar">
            <div className="bar-label">Rising</div>
            <div className="bar-container">
              <div
                className="bar-fill up"
                style={{
                  width: `${(marketTrend.up / Object.keys(assets).length) * 100}%`
                }}
              >
                {marketTrend.up}
              </div>
            </div>
          </div>
          <div className="sentiment-bar">
            <div className="bar-label">Falling</div>
            <div className="bar-container">
              <div
                className="bar-fill down"
                style={{
                  width: `${(marketTrend.down / Object.keys(assets).length) * 100}%`
                }}
              >
                {marketTrend.down}
              </div>
            </div>
          </div>
          {marketTrend.unchanged > 0 && (
            <div className="sentiment-bar">
              <div className="bar-label">Unchanged</div>
              <div className="bar-container">
                <div
                  className="bar-fill unchanged"
                  style={{
                    width: `${(marketTrend.unchanged / Object.keys(assets).length) * 100}%`
                  }}
                >
                  {marketTrend.unchanged}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="market-movers">
        <div className="top-gainers">
          <h4>Top Gainers</h4>
          <ul className="movers-list">
            {topGainers.map(asset => (
              <li key={asset.symbol} className="mover-item">
                <Link to="/trading" className="mover-link">
                  <div className="mover-symbol">{asset.symbol}</div>
                  <div className="mover-price">${asset.price.toFixed(2)}</div>
                  <div className="mover-change positive">
                    +{asset.changePercent.toFixed(2)}%
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="top-losers">
          <h4>Top Losers</h4>
          <ul className="movers-list">
            {topLosers.map(asset => (
              <li key={asset.symbol} className="mover-item">
                <Link to="/trading" className="mover-link">
                  <div className="mover-symbol">{asset.symbol}</div>
                  <div className="mover-price">${asset.price.toFixed(2)}</div>
                  <div className="mover-change negative">
                    {asset.changePercent.toFixed(2)}%
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx>{`
        .market-overview {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .market-overview h3 {
          margin-top: 0;
          font-size: 18px;
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        
        .market-sentiment {
          margin-bottom: 20px;
        }
        
        .sentiment-bars {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .sentiment-bar {
          display: flex;
          align-items: center;
        }
        
        .bar-label {
          width: 80px;
          font-size: 14px;
          color: #666;
        }
        
        .bar-container {
          flex: 1;
          background-color: #f0f2f5;
          height: 24px;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 13px;
          min-width: 30px;
        }
        
        .bar-fill.up {
          background-color: #2ecc71;
        }
        
        .bar-fill.down {
          background-color: #e74c3c;
        }
        
        .bar-fill.unchanged {
          background-color: #7f8c8d;
        }
        
        .market-movers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .market-movers h4 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
        }
        
        .movers-list {
          list-style-type: none;
          padding: 0;
          margin: 0;
        }
        
        .mover-item {
          margin-bottom: 8px;
        }
        
        .mover-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-decoration: none;
          color: inherit;
          padding: 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .mover-link:hover {
          background-color: #f5f5f5;
        }
        
        .mover-symbol {
          font-weight: 600;
          font-size: 14px;
          color: #333;
        }
        
        .mover-price {
          font-size: 14px;
          color: #666;
        }
        
        .mover-change {
          font-weight: 600;
          font-size: 14px;
        }
        
        .positive {
          color: #2ecc71;
        }
        
        .negative {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};

export default MarketOverview;