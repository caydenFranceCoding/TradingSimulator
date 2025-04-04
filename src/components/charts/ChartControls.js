// src/components/charts/ChartControls.js
import React, { useContext } from 'react';
import { MarketContext } from '../../context/MarketContext';

const ChartControls = () => {
  const { timeframe, setTimeframe } = useContext(MarketContext);

  // Available timeframes
  const timeframes = ['1D', '5D', '1M', '3M', '1Y', 'All'];

  return (
    <div className="chart-controls">
      <div className="timeframe-selector">
        {timeframes.map((tf) => (
          <button
            key={tf}
            className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
            onClick={() => setTimeframe(tf)}
          >
            {tf}
          </button>
        ))}
      </div>
      <div className="chart-type-selector">
        <button className="chart-type-btn active">Line</button>
        <button className="chart-type-btn">Candle</button>
      </div>
      <style jsx>{`
        .chart-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        
        .timeframe-selector, .chart-type-selector {
          display: flex;
          gap: 5px;
        }
        
        .timeframe-btn, .chart-type-btn {
          padding: 5px 10px;
          border: none;
          background-color: #f0f0f0;
          border-radius: 4px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.2s ease;
        }
        
        .timeframe-btn.active, .chart-type-btn.active {
          background-color: #3498db;
          color: white;
        }
        
        .timeframe-btn:hover, .chart-type-btn:hover {
          background-color: #e0e0e0;
        }
        
        .timeframe-btn.active:hover, .chart-type-btn.active:hover {
          background-color: #2980b9;
        }
      `}</style>
    </div>
  );
};

export default ChartControls;