import react, { useState, useContext, useEffect } from "react";
import { MarketContext } from "../../context/MarketContext";
import { PortfolioContext } from "../../context/PortfolioContext";
import './Trading.css';
import PriceChart from '../charts/PriceChart';


const Trading = () => {
    const { assets, selectedAsset, setSelectedAsset } = useContext(MarketContext);
    const { cash, holdings, executeTrade } = useContext(PortfolioContext);

    const [tradeType, setTradeType] = useState('buy');
    const [shares, setShares] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const asset = assets[selectedAsset];
    const holding =holdings[selectedAsset];

    //calculate the trading details
    const price = asset ? asset.price : 0
    const totalCost = price * shares;
    const maxShares = tradeType === 'buy'
        ? Math.floor(cash / price)
        : (holding ? holding.shares : 0);

    useEffect(() => {
        // this object is going to reset the shares when trade type or selected asset change
        setShares(1);
        setError('');
        setSuccess('');
    }, [tradeType, selectedAsset]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (shares <= 0) {
                throw new Error('Number of shares must be greater than 0, you moron HAHA');
            }

            if (tradeType === 'buy' && totalCost > cash) {
                throw new Error('you broke mf LMAO')
            }

            if (tradeType === 'sell' && !(holding || holding.shares < shares)) {
                throw new Error('you dont have enough shares to sell brotha');
            }

            executeTrade(selectedAsset, tradeType, shares);
            setSuccess(`succefully ${tradeType === 'buy' ? 'bought' : 'sold'} ${shares} shares of ${selectedAsset}`);
            setShares(1);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
    <div className="trading-page">
      <div className="trading-container">
        <div className="market-panel">
          <h2>Market</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for assets..."
              className="search-input"
            />
          </div>
          <div className="asset-list">
            <table>
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(assets).map(symbol => {
                  const asset = assets[symbol];
                  const priceChange = asset.price - asset.previousPrice;
                  const priceChangePercent = (priceChange / asset.previousPrice) * 100;

                  return (
                    <tr
                      key={symbol}
                      className={selectedAsset === symbol ? 'selected-asset' : ''}
                      onClick={() => setSelectedAsset(symbol)}
                    >
                      <td><strong>{symbol}</strong></td>
                      <td>{asset.name}</td>
                      <td>${asset.price.toFixed(2)}</td>
                      <td className={priceChange >= 0 ? 'positive' : 'negative'}>
                        {priceChange >= 0 ? '+' : ''}
                        ${priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="trade-panel">
          <h2>Trade {selectedAsset}</h2>
          {asset && (
            <>
              <div className="asset-details">
                <h3>{asset.name}</h3>
                <div className="asset-price">
                  <span className="current-price">${asset.price.toFixed(2)}</span>
                  <span className={asset.price >= asset.previousPrice ? 'positive' : 'negative'}>
                    {asset.price >= asset.previousPrice ? '+' : ''}
                    ${(asset.price - asset.previousPrice).toFixed(2)}
                    ({((asset.price - asset.previousPrice) / asset.previousPrice * 100).toFixed(2)}%)
                  </span>
                </div>
                  <PriceChart symbol={selectedAsset} />
                <p className="asset-description">{asset.description}</p>
              </div>

              <div className="your-position">
                <h4>Your Position</h4>
                {holding ? (
                  <div className="position-details">
                    <div className="position-item">
                      <span className="label">Shares:</span>
                      <span className="value">{holding.shares}</span>
                    </div>
                    <div className="position-item">
                      <span className="label">Avg Price:</span>
                      <span className="value">${holding.avgPrice.toFixed(2)}</span>
                    </div>
                    <div className="position-item">
                      <span className="label">Current Value:</span>
                      <span className="value">${(holding.shares * asset.price).toFixed(2)}</span>
                    </div>
                    <div className="position-item">
                      <span className="label">P/L:</span>
                      <span className={`value ${(holding.shares * asset.price) - (holding.shares * holding.avgPrice) >= 0 ? 'positive' : 'negative'}`}>
                        ${((holding.shares * asset.price) - (holding.shares * holding.avgPrice)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p>You don't have any shares of {selectedAsset}</p>
                )}
              </div>

              <form className="trade-form" onSubmit={handleSubmit}>
                <div className="trade-type-selector">
                  <button
                    type="button"
                    className={`trade-type-btn ${tradeType === 'buy' ? 'active' : ''}`}
                    onClick={() => setTradeType('buy')}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    className={`trade-type-btn ${tradeType === 'sell' ? 'active' : ''}`}
                    onClick={() => setTradeType('sell')}
                    disabled={!holding || holding.shares === 0}
                  >
                    Sell
                  </button>
                </div>

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
                </div>

                <div className="form-group">
                  <label htmlFor="price">Market Price</label>
                  <input
                    type="text"
                    id="price"
                    value={`$${price.toFixed(2)}`}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="total">Estimated Total</label>
                  <input
                    type="text"
                    id="total"
                    value={`$${totalCost.toFixed(2)}`}
                    readOnly
                  />
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="max-trade-info">
                  {tradeType === 'buy' ? (
                    <p>You can buy up to {maxShares} shares with your available cash (${cash.toFixed(2)})</p>
                  ) : (
                    <p>You can sell up to {maxShares} shares from your holdings</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`trade-submit-btn ${tradeType === 'buy' ? 'buy' : 'sell'}`}
                >
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {shares} {shares === 1 ? 'share' : 'shares'} of {selectedAsset}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trading;