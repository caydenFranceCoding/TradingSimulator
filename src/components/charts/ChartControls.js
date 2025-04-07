import React, { useContext } from 'react';
import { MarketContext } from '../../context/MarketContext';
import './ChartStyles.css';

const ChartControls = () => {
  const { timeframe, setTimeframe } = useContext(MarketContext);

  const timeframes = [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '3M', label: '3M' },
    { id: '1Y', label: '1Y' },
    { id: 'ALL', label: 'ALL' }
  ];

  return (
    <div className="timeframe-selector">
      {timeframes.map(tf => (
        <button
          key={tf.id}
          className={`timeframe-btn ${timeframe === tf.id ? 'active' : ''}`}
          onClick={() => setTimeframe(tf.id)}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
};

export default ChartControls;