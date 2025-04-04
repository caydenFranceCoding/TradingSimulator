// src/services/apiService.js
import axios from 'axios';

// You would need to install axios: npm install axios

// Replace with your actual API key
const API_KEY = 'rKQzt8Ei46kXPR2VVQBJDX87ixgf2BQT';

// Base URL for Alpha Vantage API (as an example)
const BASE_URL = 'https://www.alphavantage.co/query';

// Get stock quote data
export const getStockQuote = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });
    return response.data['Global Quote'];
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
};

// Get company overview
export const getCompanyOverview = async (symbol) => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'OVERVIEW',
        symbol,
        apikey: API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching company overview for ${symbol}:`, error);
    throw error;
  }
};

// Get historical data (daily)
export const getHistoricalData = async (symbol, outputSize = 'compact') => {
  try {
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol,
        outputsize: outputSize, // 'compact' or 'full'
        apikey: API_KEY
      }
    });
    return response.data['Time Series (Daily)'];
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error);
    throw error;
  }
};

// Helper function to transform API data to your application's format
export const transformStockData = (symbol, quoteData, overviewData) => {
  if (!quoteData || !overviewData) return null;
  
  return {
    symbol,
    name: overviewData.Name,
    price: parseFloat(quoteData['05. price']),
    previousPrice: parseFloat(quoteData['08. previous close']),
    change: parseFloat(quoteData['09. change']),
    changePercent: parseFloat(quoteData['10. change percent'].replace('%', '')),
    description: overviewData.Description,
    sector: overviewData.Sector,
    industry: overviewData.Industry,
    marketCap: parseFloat(overviewData.MarketCapitalization),
    peRatio: parseFloat(overviewData.PERatio)
  };
};