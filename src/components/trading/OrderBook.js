import React, { useContext, useEffect, useState } from 'react';
import { MarketContext } from '../../context/MarketContext';
import './OrderBook.css';

const OrderBook = ({ symbol }) => {
  const { assets } = useContext(MarketContext);
  const [asks, setAsks] = useState([]);
  const [bids, setBids] = useState([]);
  const [spreadPercent, setSpreadPercent] = useState(0);

  // Generate mock order book data based on current price
  useEffect(() => {
    if (symbol && assets[symbol]) {
      const asset = assets[symbol];
      const currentPrice = asset.price;
      const volatility = asset.volatility;

      // Generate mock asks (sell orders)
      const generatedAsks = [];
      for (let i = 1; i <= 10; i++) {
        const priceOffset = (i * 0.05 * volatility);
        const price = currentPrice * (1 + priceOffset);
        const size = Math.floor(Math.random() * 1000) + 100;

        generatedAsks.push({
          price: Math.round(price * 100) / 100,
          size,
          total: Math.round(price * size * 100) / 100
        });
      }

      // Generate mock bids (buy orders)
      const generatedBids = [];
      for (let i = 1; i <= 10; i++) {
        const priceOffset = (i * 0.05 * volatility);
        const price = currentPrice * (1 - priceOffset);
        const size = Math.floor(Math.random() * 1000) + 100;

        generatedBids.push({
          price: Math.round(price * 100) / 100,
          size,
          total: Math.round(price * size * 100) / 100
        });
      }

      // Sort asks by price (ascending)
      generatedAsks.sort((a, b) => a.price - b.price);

      // Sort bids by price (descending)
      generatedBids.sort((a, b) => b.price - a.price);

      // Calculate spread percentage
      const lowestAsk = generatedAsks[0].price;
      const highestBid = generatedBids[0].price;
      const spread = lowestAsk - highestBid;
      const spreadPercentValue = (spread / lowestAsk) * 100;

      setAsks(generatedAsks);
      setBids(generatedBids);
      setSpreadPercent(spreadPercentValue);
    }
  }, [symbol, assets]);

  // Format price for display
  const formatPrice = (price) => {
    return price.toFixed(2);
  };

  // Format size for display
  const formatSize = (size) => {
    return size.toLocaleString();
  };

  // Calculate max size for visualization
  const maxSize = Math.max(
    ...asks.map(ask => ask.size),
    ...bids.map(bid => bid.size)
  );

  if (!symbol || !assets[symbol] || asks.length === 0 || bids.length === 0) {
    return <div className="loading-order-book">Loading order book...</div>;
  }

  return (
    <div className="order-book">
      <div className="order-book-header">
        <h3>Order Book</h3>
        <div className="spread-info">
          Spread: ${(asks[0].price - bids[0].price).toFixed(2)} ({spreadPercent.toFixed(2)}%)
        </div>
      </div>

      <div className="order-book-content">
        <div className="column-headers">
          <div className="price-header">Price</div>
          <div className="size-header">Size</div>
          <div className="total-header">Total</div>
        </div>

        <div className="asks-container">
          {asks.map((ask, index) => (
            <div key={`ask-${index}`} className="order-row ask-row">
              <div
                className="size-visualization"
                style={{ width: `${(ask.size / maxSize) * 100}%` }}
              ></div>
              <div className="price ask-price">${formatPrice(ask.price)}</div>
              <div className="size">{formatSize(ask.size)}</div>
              <div className="total">${ask.total.toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div className="current-price-indicator">
          <div className="price-label">${formatPrice(assets[symbol].price)}</div>
        </div>

        <div className="bids-container">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="order-row bid-row">
              <div
                className="size-visualization"
                style={{ width: `${(bid.size / maxSize) * 100}%` }}
              ></div>
              <div className="price bid-price">${formatPrice(bid.price)}</div>
              <div className="size">{formatSize(bid.size)}</div>
              <div className="total">${bid.total.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;