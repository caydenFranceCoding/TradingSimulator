// src/context/PortfolioContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import { MarketContext } from './MarketContext';

// Create context
export const PortfolioContext = createContext();

// Provider component
export const PortfolioProvider = ({ children }) => {
  const { assets, day } = useContext(MarketContext);

  // Initial portfolio state
  const [cash, setCash] = useState(10000);
  const [holdings, setHoldings] = useState({});
  const [transactions, setTransactions] = useState([]);

  // Calculate total portfolio value
  const calculatePortfolioValue = useCallback(() => {
    let holdingsValue = 0;

    Object.keys(holdings).forEach(symbol => {
      const asset = assets[symbol];
      if (asset) {
        holdingsValue += holdings[symbol].shares * asset.price;
      }
    });

    return {
      cash,
      holdingsValue,
      totalValue: cash + holdingsValue
    };
  }, [cash, holdings, assets]);

  // Execute a trade (buy or sell)
  const executeTrade = useCallback((symbol, tradeType, shares) => {
    const asset = assets[symbol];

    if (!asset) {
      throw new Error('Invalid asset symbol');
    }

    const price = asset.price;
    const totalCost = price * shares;

    if (tradeType === 'buy') {
      // Check if user has enough cash
      if (totalCost > cash) {
        throw new Error('Insufficient funds');
      }

      // Update cash
      setCash(prevCash => prevCash - totalCost);

      // Update holdings
      setHoldings(prevHoldings => {
        const newHoldings = { ...prevHoldings };

        if (!newHoldings[symbol]) {
          // First purchase of this asset
          newHoldings[symbol] = {
            shares,
            avgPrice: price
          };
        } else {
          // Already own some shares of this asset - update average price
          const currentValue = newHoldings[symbol].shares * newHoldings[symbol].avgPrice;
          const newValue = currentValue + totalCost;
          const newShares = newHoldings[symbol].shares + shares;

          newHoldings[symbol] = {
            shares: newShares,
            avgPrice: newValue / newShares
          };
        }

        return newHoldings;
      });

    } else if (tradeType === 'sell') {
      // Check if user has enough shares
      if (!holdings[symbol] || holdings[symbol].shares < shares) {
        throw new Error('Insufficient shares');
      }

      // Update cash
      setCash(prevCash => prevCash + totalCost);

      // Update holdings
      setHoldings(prevHoldings => {
        const newHoldings = { ...prevHoldings };

        // Reduce share count
        newHoldings[symbol].shares -= shares;

        // Remove asset from holdings if no shares left
        if (newHoldings[symbol].shares === 0) {
          delete newHoldings[symbol];
        }

        return newHoldings;
      });
    }

    // Record transaction
    setTransactions(prevTransactions => [
      ...prevTransactions,
      {
        day,
        symbol,
        type: tradeType,
        shares,
        price,
        total: totalCost,
        timestamp: new Date().toISOString()
      }
    ]);

    return true;
  }, [assets, cash, holdings, day]);

  return (
    <PortfolioContext.Provider
      value={{
        cash,
        holdings,
        transactions,
        calculatePortfolioValue,
        executeTrade
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};