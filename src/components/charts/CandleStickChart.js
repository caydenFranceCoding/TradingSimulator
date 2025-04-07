import React, { useContext, useState, useEffect } from 'react';
import { MarketContext } from '../../context/MarketContext';
import { Line, Bar, Scatter, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChartStyles.css';

const CandleStickChart = ({ symbol, timeframe }) => {
  const { assets, getChartData } = useContext(MarketContext);
  const [chartData, setChartData] = useState([]);
  const [indicators, setIndicators] = useState({
    sma: true,
    volume: true,
    ema: false,
    rsi: false
  });

  useEffect(() => {
    if (symbol) {
      const data = getChartData(symbol, timeframe);

      // Transform data for candlestick representation
      const transformedData = data.map((item, index, array) => {
        // Calculate OHLC data
        const open = index > 0 ? array[index - 1].price : item.price;
        const high = item.price * (1 + Math.random() * 0.01); // Simulate high
        const low = item.price * (1 - Math.random() * 0.01);  // Simulate low
        const close = item.price;

        // Calculate simple moving average (5-day)
        let sma5 = null;
        if (index >= 4) {
          sma5 = array.slice(index - 4, index + 1).reduce((sum, i) => sum + i.price, 0) / 5;
        }

        // Calculate volume (simulated)
        const volume = Math.floor(Math.random() * 10000) + 5000;

        return {
          day: item.day,
          open,
          high,
          low,
          close,
          sma5,
          volume,
          // Format for candlestick visualization
          highLowLine: [low, high],
          openCloseLine: [open, close],
          fillColor: close >= open ? '#26a69a' : '#ef5350'
        };
      });

      setChartData(transformedData);
    }
  }, [symbol, timeframe, getChartData]);

  const toggleIndicator = (indicator) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: !prev[indicator]
    }));
  };

  const formatYAxis = (value) => {
    return `$${value.toFixed(2)}`;
  };

  if (chartData.length === 0) {
    return <div className="loading-chart">Loading chart data...</div>;
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{symbol} Chart</h3>
        <div className="chart-indicators">
          <button
            className={`indicator-btn ${indicators.sma ? 'active' : ''}`}
            onClick={() => toggleIndicator('sma')}
          >
            SMA
          </button>
          <button
            className={`indicator-btn ${indicators.volume ? 'active' : ''}`}
            onClick={() => toggleIndicator('volume')}
          >
            Volume
          </button>
          <button
            className={`indicator-btn ${indicators.ema ? 'active' : ''}`}
            onClick={() => toggleIndicator('ema')}
          >
            EMA
          </button>
          <button
            className={`indicator-btn ${indicators.rsi ? 'active' : ''}`}
            onClick={() => toggleIndicator('rsi')}
          >
            RSI
          </button>
        </div>
      </div>

      <div className="chart-content">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottomRight', offset: 0 }} />
            <YAxis
              yAxisId="price"
              domain={['auto', 'auto']}
              tickFormatter={formatYAxis}
              label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
            />
            {indicators.volume && (
              <YAxis
                yAxisId="volume"
                orientation="right"
                domain={['auto', 'auto']}
                tickFormatter={(value) => `${value/1000}K`}
                label={{ value: 'Volume', angle: 90, position: 'insideRight' }}
              />
            )}
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="custom-tooltip">
                      <p className="tooltip-label">{`Day: ${payload[0].payload.day}`}</p>
                      <p className="tooltip-data">{`Open: $${payload[0].payload.open.toFixed(2)}`}</p>
                      <p className="tooltip-data">{`High: $${payload[0].payload.high.toFixed(2)}`}</p>
                      <p className="tooltip-data">{`Low: $${payload[0].payload.low.toFixed(2)}`}</p>
                      <p className="tooltip-data">{`Close: $${payload[0].payload.close.toFixed(2)}`}</p>
                      {payload[0].payload.sma5 && (
                        <p className="tooltip-data">{`SMA5: $${payload[0].payload.sma5.toFixed(2)}`}</p>
                      )}
                      <p className="tooltip-data">{`Volume: ${payload[0].payload.volume.toLocaleString()}`}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />

            {/* Candlestick high-low line */}
            <Scatter
              yAxisId="price"
              dataKey="highLowLine"
              fill="none"
              line={{ stroke: '#8884d8' }}
              shape={({ cx, cy }) => {
                return (
                  <line
                    x1={cx}
                    y1={cy[0]}
                    x2={cx}
                    y2={cy[1]}
                    stroke="#8884d8"
                    strokeWidth={1}
                  />
                )
              }}
              legendType="none"
            />

            {/* Candlestick open-close box */}
            <Scatter
              yAxisId="price"
              dataKey="openCloseLine"
              fill="none"
              shape={({ cx, cy, payload }) => {
                const width = 8;
                const height = Math.abs(cy[1] - cy[0]);
                const x = cx - width / 2;
                const y = Math.min(cy[0], cy[1]);

                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height || 1} // Ensure at least 1px height
                    fill={payload.fillColor}
                  />
                )
              }}
              name="Price"
            />

            {/* SMA line */}
            {indicators.sma && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="sma5"
                stroke="#ff7300"
                dot={false}
                name="SMA (5)"
              />
            )}

            {/* Volume bars */}
            {indicators.volume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="rgba(75, 192, 192, 0.5)"
                name="Volume"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CandleStickChart;