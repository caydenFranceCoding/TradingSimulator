// src/services/newsService.js
import axios from 'axios';

// Configure your API key and base URL
const NEWS_API_KEY = '2f36e4ba1efce747fbb19e604c626ec982bc6218'; // Replace with your actual API key
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

/**
 * Get general market news
 */
export const getMarketNews = async (pageSize = 10) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        q: 'stock market OR finance OR economy',
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize
      }
    });

    return transformNewsResponse(response.data);
  } catch (error) {
    console.error('Error fetching market news:', error);
    throw error;
  }
};

/**
 * Get news for a specific stock symbol
 */
export const getStockNews = async (symbol, pageSize = 10) => {
  if (!symbol) {
    throw new Error('Symbol is required');
  }

  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        q: `${symbol} stock OR ${symbol} company`,
        apiKey: NEWS_API_KEY,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize
      }
    });

    return transformNewsResponse(response.data, symbol);
  } catch (error) {
    console.error(`Error fetching news for ${symbol}:`, error);
    throw error;
  }
};

/**
 * Transform API response to our application format
 */
const transformNewsResponse = (apiResponse, defaultSymbol = null) => {
  if (!apiResponse || !apiResponse.articles) {
    return [];
  }

  return apiResponse.articles.map((article, index) => ({
    id: index,
    title: article.title,
    source: article.source.name,
    date: article.publishedAt,
    snippet: article.description,
    url: article.url,
    imageUrl: article.urlToImage,
    // Extract potential symbols from the title and content
    relevantSymbols: defaultSymbol ? [defaultSymbol] : extractSymbolsFromText(article.title + ' ' + (article.description || ''))
  }));
};

/**
 * Extract potential stock symbols from text
 */
const extractSymbolsFromText = (text) => {
  // Common stock symbols to check for
  const commonSymbols = ['AAPL', 'MSFT', 'GOOGL', 'GOOG', 'AMZN', 'META', 'FB', 'TSLA', 'NVDA', 'JPM', 'BAC', 'WMT', 'XOM'];

  // Check if any of these symbols appear in the text
  const matches = commonSymbols.filter(symbol => text.includes(symbol));

  // Return found symbols or a default
  return matches.length > 0 ? matches : ['MARKET'];
};