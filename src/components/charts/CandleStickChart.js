import React, { useContext, useState, useEffect } from 'react';
import { MarketContext } from '../../context/MarketContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const CandleStickChart = ({ symbol }) => {
  const { assets, getChartData, timeframe } = useContext(MarketContext);
  const [chartData, setChartData] = useState([]);


  useEffect(() => {
    const asset = assets[symbol];
    if (asset && asset.history && asset.history.length > 0) {
      // Transform price history into simulated OHLC data
      const simulatedData = asset.history.map((dataPoint, index) => {
        // I shall now create some randomness in the high/low/open values
        const volatility = asset.volatility || 2;
        const randomFactor = Math.random() * volatility / 100;

        return {
          day: dataPoint.day,
          open: index > 0 ? asset.history[index - 1].price : dataPoint.price * (1 - randomFactor),
          high: dataPoint.price * (1 + randomFactor),
          low: dataPoint.price * (1 - randomFactor),
          close: dataPoint.price,
        };
      });

      setChartData(simulatedData);
    }
  }, [assets, symbol, timeframe]);

  if (chartData.length === 0) {
    return <div>Loading chart data...</div>;
  }

  // Calculate min and max values for Y-axis domain
  const allValues = chartData.flatMap(item => [item.high, item.low, item.open, item.close]);
  const minValue = Math.min(...allValues) * 0.995;
  const maxValue = Math.max(...allValues) * 1.005;

  // Custom tooltip to display OHLC data
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="candlestick-tooltip" style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        }}>
          <p><strong>Day {label}</strong></p>
          <p>Open: ${data.open.toFixed(2)}</p>
          <p>High: ${data.high.toFixed(2)}</p>
          <p>Low: ${data.low.toFixed(2)}</p>
          <p>Close: ${data.close.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis
            domain={[minValue, maxValue]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Draw the price area */}
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
            </linearGradient>
          </defs>

          <Area
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorClose)"
          />

          {/* Add a reference line for the last closing price */}
          {chartData.length > 0 && (
            <ReferenceLine
              y={chartData[chartData.length - 1].close}
              stroke="red"
              strokeDasharray="3 3"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandleStickChart;