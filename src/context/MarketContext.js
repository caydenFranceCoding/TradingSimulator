// src/context/MarketContext.js - Updated version
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getStockQuote, getCompanyOverview, transformStockData } from '../services/apiService';

// Create context
export const MarketContext = createContext();

// List of stock symbols to track
const TRACKED_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM'];

// Initial assets with placeholder data
const initialAssets = {
  'AAPL': {
    name: 'Apple Inc.',
    price: 175.25,
    previousPrice: 172.50,
    volatility: 2.0,
    history: [{day: 1, price: 172.50}, {day: 2, price: 175.25}],
    description: 'Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.'
  },
  'MSFT': {
    name: 'Microsoft Corporation',
    price: 320.40,
    previousPrice: 318.20,
    volatility: 1.8,
    history: [{day: 1, price: 318.20}, {day: 2, price: 320.40}],
    description: 'Technology company that develops, licenses, and supports software, services, devices, and solutions.'
  }
  // More assets can be added later
};

// Provider component
export const MarketProvider = ({ children }) => {
  const [day, setDay] = useState(1);
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState(Object.keys(initialAssets)[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch real market data
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Create a new assets object
      const newAssets = { ...assets };

      // Fetch data for each tracked symbol
      for (const symbol of TRACKED_SYMBOLS) {
        // If we're fetching data for the first time and it's not in assets yet
        if (!newAssets[symbol]) {
          newAssets[symbol] = {
            name: symbol,
            price: 0,
            previousPrice: 0,
            volatility: 2.0,
            history: [],
            description: 'Loading...'
          };
        }

        // Get quote and company data
        const quoteData = await getStockQuote(symbol);
        const companyData = await getCompanyOverview(symbol);

        // Transform data for our app format
        if (quoteData && companyData) {
          const stockData = transformStockData(symbol, quoteData, companyData);

          // Update asset data
          if (stockData) {
            const currentPrice = stockData.price;
            const previousPrice = newAssets[symbol].price || currentPrice;

            newAssets[symbol] = {
              ...newAssets[symbol],
              name: stockData.name,
              previousPrice: previousPrice,
              price: currentPrice,
              description: stockData.description,
              // Add more fields as needed
              history: [
                ...newAssets[symbol].history,
                { day: day, price: currentPrice }
              ]
            };
          }
        }
      }

      setAssets(newAssets);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to load market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [assets, day]);

  // Fetch data on initial load
  useEffect(() => {
    // Comment this out during development to avoid API rate limits
    // fetchMarketData();

    // For development, we'll use the initialAssets
    console.log('Using mock data (comment out for real API calls)');
  }, []);

  // Advance to next day - now including API data refresh
  const advanceDay = useCallback(() => {
    setDay(prevDay => prevDay + 1);

    // For production, uncomment this to get real data:
    // fetchMarketData();

    // For development/demo, use simulated price changes:
    setAssets(prevAssets => {
      const newAssets = { ...prevAssets };

      // Update each asset
      Object.keys(newAssets).forEach(symbol => {
        const asset = newAssets[symbol];
        const previousPrice = asset.price;

        // Random price movement based on volatility
        const changePercent = (Math.random() - 0.5) * asset.volatility * 2;
        const newPrice = previousPrice * (1 + changePercent / 100);
        const roundedPrice = Math.round(newPrice * 100) / 100;

        // Update asset
        newAssets[symbol] = {
          ...asset,
          previousPrice,
          price: roundedPrice,
          history: [...asset.history, { day: day + 1, price: roundedPrice }]
        };
      });

      return newAssets;
    });
  }, [day, fetchMarketData]);

  // Get chart data for selected timeframe
  const getChartData = useCallback((symbol, timeframe) => {
    const asset = assets[symbol];
    if (!asset) return [];

    return asset.history;
  }, [assets]);

  return (
    <MarketContext.Provider
      value={{
        day,
        assets,
        selectedAsset,
        setSelectedAsset,
        timeframe,
        setTimeframe,
        advanceDay,
        getChartData,
        loading,
        error
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};