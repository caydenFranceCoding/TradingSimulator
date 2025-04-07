// src/components/trading/TradeForm.js
import React, { useState, useContext, useEffect } from 'react';
import { MarketContext } from '../../context/MarketContext';
import { PortfolioContext } from '../../context/PortfolioContext';
import './TradeForm.css';

const TradeForm = ({ symbol }) => {
  const { assets } = useContext(MarketContext);
  const { cash, holdings, executeTrade } = useContext(PortfolioContext);

  // Form state
  const [tradeType, setTradeType] = useState('buy');
  const [orderType, setOrderType] = useState('market');
  const [shares, setShares] = useState(1);
  const [limitPrice, setLimitPrice] = useState(0);
  const [stopPrice, setStopPrice] = useState(0);
  const [timeInForce, setTimeInForce] = useState('day');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const asset = assets[symbol];
  const holding = holdings[symbol];

  // Calculate trading details
  const price = asset ? asset.price : 0;
  const totalCost = price * shares;
  const maxShares = tradeType === 'buy'
    ? Math.floor(cash / price)
    : (holding ? holding.shares : 0);

  // Reset form when symbol or trade type changes
  useEffect(() => {
    setShares(1);
    setOrderType('market');
    setLimitPrice(asset ? asset.price : 0);
    setStopPrice(asset ? asset.price : 0);
    setError('');
    setSuccess('');
  }, [tradeType, symbol, asset]);

  useEffect(() => {
    if (asset) {
      // Initialize limit and stop prices based on current price
      if (tradeType === 'buy') {
        setLimitPrice(Math.round((asset.price * 0.99) * 100) / 100); // 1% below market
        setStopPrice(Math.round((asset.price * 1.01) * 100) / 100); // 1% above market for stop-buy
      } else {
        setLimitPrice(Math.round((asset.price * 1.01) * 100) / 100); // 1% above market
        setStopPrice(Math.round((asset.price * 0.99) * 100) / 100); // 1% below market for stop-loss
      }
    }
  }, [tradeType, asset]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (shares <= 0) {
        throw new Error('Number of shares must be greater than 0');
      }

      // Validate order specifics
      if (orderType === 'limit' && limitPrice <= 0) {
        throw new Error('Limit price must be greater than 0');
      }

      if (orderType === 'stop' && stopPrice <= 0) {
        throw new Error('Stop price must be greater than 0');
      }

      // Check if the user has enough cash (for buy) or shares (for sell)
      if (tradeType === 'buy' && orderType === 'market' && totalCost > cash) {
        throw new Error('Insufficient funds for this trade');
      }

      if (tradeType === 'sell' && (!holding || holding.shares < shares)) {
        throw new Error('You don\'t have enough shares to sell');
      }

      // For market orders, execute immediately
      if (orderType === 'market') {
        executeTrade(symbol, tradeType, shares, price);
        setSuccess(`Successfully ${tradeType === 'buy' ? 'bought' : 'sold'} ${shares} shares of ${symbol} at market price $${price.toFixed(2)}`);
      } else {
        // For limit and stop orders, we would normally add to pending orders
        // Since we're simulating, we'll just show a success message
        const orderPrice = orderType === 'limit' ? limitPrice : stopPrice;
        setSuccess(`${orderType.charAt(0).toUpperCase() + orderType.slice(1)} ${tradeType} order placed for ${shares} shares of ${symbol} at $${orderPrice.toFixed(2)}`);
      }

      setShares(1);
    } catch (err) {
      setError(err.message);
    }
  };

  // Calculate final estimate based on order type
  const getEstimatedTotal = () => {
    if (orderType === 'market') {
      return price * shares;
    } else if (orderType === 'limit') {
      return limitPrice * shares;
    } else if (orderType === 'stop') {
      return stopPrice * shares;
    }
    return 0;
  };

  if (!asset) {
    return <div className="no-asset-selected">Please select an asset to trade</div>;
  }

  return (
    <div className="trade-form-container">
      <h3>Place Order</h3>
      <form onSubmit={handleSubmit} className="trade-form">
        {/* Trade Type Selector */}
        <div className="trade-type-selector">
          <button
            type="button"
            className={`trade-type-btn ${tradeType === 'buy' ? 'active buy' : ''}`}
            onClick={() => setTradeType('buy')}
          >
            Buy
          </button>
          <button
            type="button"
            className={`trade-type-btn ${tradeType === 'sell' ? 'active sell' : ''}`}
            onClick={() => setTradeType('sell')}
            disabled={!holding || holding.shares === 0}
          >
            Sell
          </button>
        </div>

        {/* Order Type */}
        <div className="form-group">
          <label>Order Type</label>
          <div className="order-type-options">
            <div className="radio-option">
              <input
                type="radio"
                id="market"
                name="orderType"
                value="market"
                checked={orderType === 'market'}
                onChange={() => setOrderType('market')}
              />
              <label htmlFor="market">Market</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="limit"
                name="orderType"
                value="limit"
                checked={orderType === 'limit'}
                onChange={() => setOrderType('limit')}
              />
              <label htmlFor="limit">Limit</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="stop"
                name="orderType"
                value="stop"
                checked={orderType === 'stop'}
                onChange={() => setOrderType('stop')}
              />
              <label htmlFor="stop">Stop</label>
            </div>
          </div>
        </div>

        {/* Shares */}
        <div className="form-group">
          <label htmlFor="shares">Shares</label>
          <input
            type="number"
            id="shares"
            value={shares}
            onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 0))}
            min="1"
            max={maxShares}
          />
          <div className="share-presets">
            <button type="button" onClick={() => setShares(Math.min(1, maxShares))}>Min</button>
            <button type="button" onClick={() => setShares(Math.min(5, maxShares))}>5</button>
            <button type="button" onClick={() => setShares(Math.min(10, maxShares))}>10</button>
            <button type="button" onClick={() => setShares(Math.min(100, maxShares))}>100</button>
            <button type="button" onClick={() => setShares(maxShares)}>Max</button>
          </div>
        </div>

        {/* Market Price (always visible) */}
        <div className="form-group">
          <label>Current Market Price</label>
          <input
            type="text"
            value={`$${price.toFixed(2)}`}
            readOnly
            className="read-only-input"
          />
        </div>

        {/* Limit Price (only visible for limit orders) */}
        {orderType === 'limit' && (
          <div className="form-group">
            <label htmlFor="limitPrice">Limit Price</label>
            <input
              type="number"
              id="limitPrice"
              value={limitPrice}
              onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0.01"
            />
            <div className="price-suggestion">
              <span>
                {tradeType === 'buy'
                  ? `Suggested: ${(price * 0.99).toFixed(2)} (1% below market)`
                  : `Suggested: ${(price * 1.01).toFixed(2)} (1% above market)`}
              </span>
            </div>
          </div>
        )}

        {/* Stop Price (only visible for stop orders) */}
        {orderType === 'stop' && (
          <div className="form-group">
            <label htmlFor="stopPrice">Stop Price</label>
            <input
              type="number"
              id="stopPrice"
              value={stopPrice}
              onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0.01"
            />
            <div className="price-suggestion">
              <span>
                {tradeType === 'buy'
                  ? `Suggested: ${(price * 1.01).toFixed(2)} (1% above market)`
                  : `Suggested: ${(price * 0.99).toFixed(2)} (1% below market)`}
              </span>
            </div>
          </div>
        )}

        {/* Time in Force (only for limit/stop orders) */}
        {orderType !== 'market' && (
          <div className="form-group">
            <label>Time in Force</label>
            <select
              value={timeInForce}
              onChange={(e) => setTimeInForce(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="gtc">Good Till Canceled (GTC)</option>
              <option value="ext">Extended Hours</option>
            </select>
          </div>
        )}

        {/* Estimated Total */}
        <div className="form-group">
          <label>Estimated Total</label>
          <input
            type="text"
            value={`$${getEstimatedTotal().toFixed(2)}`}
            readOnly
            className="read-only-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="max-trade-info">
          {tradeType === 'buy' ? (
            <p>Available Cash: ${cash.toFixed(2)} (up to {maxShares} shares)</p>
          ) : (
            <p>Shares Owned: {holding ? holding.shares : 0}</p>
          )}
        </div>

        <button
          type="submit"
          className={`trade-submit-btn ${tradeType}`}
        >
          {tradeType === 'buy' ? 'Buy' : 'Sell'} {shares} {shares === 1 ? 'share' : 'shares'} of {symbol}
        </button>
      </form>
    </div>
  );
};

export default TradeForm;