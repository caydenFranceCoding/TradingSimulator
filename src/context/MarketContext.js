import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create context
export const MarketContext = createContext();

// Initial market data with expanded asset list
const initialAssets = {
  'AAPL': {
    name: 'Apple Inc.',
    price: 175.25,
    previousPrice: 172.50,
    volatility: 2.0,
    volume: 78432651,
    marketCap: 2800000000000,
    high52w: 198.23,
    low52w: 165.28,
    pe: 28.5,
    dividend: 0.92,
    sector: 'Technology',
    history: [{ day: 1, price: 172.50 }, { day: 2, price: 175.25 }],
    description: 'Technology company that designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.'
  },
  'MSFT': {
    name: 'Microsoft Corporation',
    price: 320.40,
    previousPrice: 318.20,
    volatility: 1.8,
    volume: 23549712,
    marketCap: 2450000000000,
    high52w: 365.92,
    low52w: 301.14,
    pe: 32.9,
    dividend: 2.72,
    sector: 'Technology',
    history: [{ day: 1, price: 318.20 }, { day: 2, price: 320.40 }],
    description: 'Technology company that develops, licenses, and supports software, services, devices, and solutions.'
  },
  'GOOGL': {
    name: 'Alphabet Inc.',
    price: 138.29,
    previousPrice: 137.14,
    volatility: 2.2,
    volume: 32659874,
    marketCap: 1750000000000,
    high52w: 142.38,
    low52w: 120.21,
    pe: 25.1,
    dividend: 0,
    sector: 'Technology',
    history: [{ day: 1, price: 137.14 }, { day: 2, price: 138.29 }],
    description: 'Technology company specializing in Internet-related services and products, including online advertising technologies, search engine, cloud computing, software, and hardware.'
  },
  'AMZN': {
    name: 'Amazon.com, Inc.',
    price: 132.65,
    previousPrice: 130.89,
    volatility: 2.5,
    volume: 41023654,
    marketCap: 1370000000000,
    high52w: 145.86,
    low52w: 112.43,
    pe: 41.2,
    dividend: 0,
    sector: 'Consumer Cyclical',
    history: [{ day: 1, price: 130.89 }, { day: 2, price: 132.65 }],
    description: 'E-commerce and cloud computing company offering a wide range of products and services through its websites.'
  },
  'TSLA': {
    name: 'Tesla, Inc.',
    price: 225.35,
    previousPrice: 231.28,
    volatility: 4.0,
    volume: 105673421,
    marketCap: 715000000000,
    high52w: 297.15,
    low52w: 152.46,
    pe: 58.3,
    dividend: 0,
    sector: 'Automotive',
    history: [{ day: 1, price: 231.28 }, { day: 2, price: 225.35 }],
    description: 'Automotive and energy company specializing in electric vehicle manufacturing and clean energy solutions.'
  },
  'JPM': {
    name: 'JPMorgan Chase & Co.',
    price: 159.12,
    previousPrice: 157.95,
    volatility: 1.5,
    volume: 15632489,
    marketCap: 465000000000,
    high52w: 172.34,
    low52w: 135.78,
    pe: 12.1,
    dividend: 4.00,
    sector: 'Financial Services',
    history: [{ day: 1, price: 157.95 }, { day: 2, price: 159.12 }],
    description: 'Global financial services firm and banking institution offering investment banking, financial services for consumers, and asset management.'
  },
  'V': {
    name: 'Visa Inc.',
    price: 248.75,
    previousPrice: 246.23,
    volatility: 1.7,
    volume: 8734215,
    marketCap: 520000000000,
    high52w: 265.37,
    low52w: 227.78,
    pe: 29.4,
    dividend: 1.80,
    sector: 'Financial Services',
    history: [{ day: 1, price: 246.23 }, { day: 2, price: 248.75 }],
    description: 'Global payments technology company that connects consumers, businesses, financial institutions, and governments in more than 200 countries.'
  },
  'COST': {
    name: 'Costco Wholesale Corporation',
    price: 689.97,
    previousPrice: 683.24,
    volatility: 1.3,
    volume: 2345678,
    marketCap: 305000000000,
    high52w: 693.42,
    low52w: 515.76,
    pe: 47.8,
    dividend: 4.08,
    sector: 'Consumer Defensive',
    history: [{ day: 1, price: 683.24 }, { day: 2, price: 689.97 }],
    description: 'Membership warehouse club offering a wide selection of merchandise, including food, automotive supplies, toys, hardware, sporting goods, jewelry, electronics, apparel, and health and beauty aids.'
  },
  'NVDA': {
    name: 'NVIDIA Corporation',
    price: 875.28,
    previousPrice: 860.76,
    volatility: 3.5,
    volume: 45876321,
    marketCap: 2150000000000,
    high52w: 925.68,
    low52w: 342.56,
    pe: 82.4,
    dividend: 0.16,
    sector: 'Technology',
    history: [{ day: 1, price: 860.76 }, { day: 2, price: 875.28 }],
    description: 'Technology company that designs graphics processing units (GPUs) for the gaming and professional markets, as well as system on a chip units (SoCs) for the mobile computing and automotive market.'
  },
  'JNJ': {
    name: 'Johnson & Johnson',
    price: 152.32,
    previousPrice: 151.87,
    volatility: 1.0,
    volume: 7654321,
    marketCap: 395000000000,
    high52w: 175.97,
    low52w: 144.95,
    pe: 16.8,
    dividend: 4.76,
    sector: 'Healthcare',
    history: [{ day: 1, price: 151.87 }, { day: 2, price: 152.32 }],
    description: 'Medical devices, pharmaceutical, and consumer packaged goods manufacturer that develops medical devices, pharmaceuticals, and consumer packaged goods.'
  }
};

// Market indices data
const initialIndices = {
  'SPY': {
    name: 'S&P 500 Index',
    price: 4523.87,
    previousPrice: 4505.62,
    volatility: 1.0,
    description: 'Tracks the performance of 500 large companies listed on stock exchanges in the United States.',
    history: [{ day: 1, price: 4505.62 }, { day: 2, price: 4523.87 }]
  },
  'QQQ': {
    name: 'Nasdaq-100 Index',
    price: 17823.45,
    previousPrice: 17798.21,
    volatility: 1.2,
    description: 'Tracks the performance of 100 of the largest non-financial companies listed on the Nasdaq stock exchange.',
    history: [{ day: 1, price: 17798.21 }, { day: 2, price: 17823.45 }]
  },
  'DIA': {
    name: 'Dow Jones Industrial Average',
    price: 38432.16,
    previousPrice: 38356.84,
    volatility: 0.8,
    description: 'Tracks the performance of 30 large, publicly-owned blue-chip companies trading on the New York Stock Exchange and the Nasdaq.',
    history: [{ day: 1, price: 38356.84 }, { day: 2, price: 38432.16 }]
  }
};

// Provider component
export const MarketProvider = ({ children }) => {
  const [day, setDay] = useState(1);
  const [assets, setAssets] = useState(initialAssets);
  const [indices, setIndices] = useState(initialIndices);
  const [selectedAsset, setSelectedAsset] = useState(Object.keys(initialAssets)[0]);
  const [timeframe, setTimeframe] = useState('1D');
  const [marketTrend, setMarketTrend] = useState(0); // overall market direction: -1 (bearish), 0 (neutral), 1 (bullish)

  // Function to simulate market conditions
  const simulateMarketConditions = useCallback(() => {
    // Randomly determine market direction with some bias for continuation
    const randomFactor = Math.random();
    let newTrend = marketTrend;

    if (randomFactor < 0.2) {
      // 20% chance to shift bearish
      newTrend = -1;
    } else if (randomFactor > 0.8) {
      // 20% chance to shift bullish
      newTrend = 1;
    } else if (randomFactor > 0.45 && randomFactor < 0.55) {
      // 10% chance to shift neutral
      newTrend = 0;
    }

    setMarketTrend(newTrend);
    return newTrend;
  }, [marketTrend]);

  // Advance to next day - simulate price changes with more realistic market simulation
  const advanceDay = useCallback(() => {
    setDay(prevDay => prevDay + 1);

    // Simulate overall market conditions
    const currentMarketTrend = simulateMarketConditions();
    const marketDirectionBias = currentMarketTrend * 0.5; // -0.5 to 0.5 bias based on market trend

    // First update indices (market as a whole)
    setIndices(prevIndices => {
      const newIndices = { ...prevIndices };

      Object.keys(newIndices).forEach(symbol => {
        const index = newIndices[symbol];
        const previousPrice = index.price;

        // Base change with market bias
        const baseChangePercent = (Math.random() - 0.5 + marketDirectionBias) * index.volatility;
        const newPrice = previousPrice * (1 + baseChangePercent / 100);
        const roundedPrice = Math.round(newPrice * 100) / 100;

        // Update index
        newIndices[symbol] = {
          ...index,
          previousPrice,
          price: roundedPrice,
          history: [...index.history, { day: day + 1, price: roundedPrice }]
        };
      });

      return newIndices;
    });

    // Then update individual assets with correlation to indices and sector-based movements
    setAssets(prevAssets => {
      const newAssets = { ...prevAssets };

      // Group assets by sector to simulate sector rotation
      const sectors = {};
      Object.keys(newAssets).forEach(symbol => {
        const sector = newAssets[symbol].sector;
        if (!sectors[sector]) {
          sectors[sector] = [];
        }
        sectors[sector].push(symbol);
      });

      // Generate sector biases
      const sectorBiases = {};
      Object.keys(sectors).forEach(sector => {
        // Random sector performance with some correlation to market trend
        sectorBiases[sector] = (Math.random() - 0.5 + marketDirectionBias * 0.7) * 0.6;
      });

      // Update each asset
      Object.keys(newAssets).forEach(symbol => {
        const asset = newAssets[symbol];
        const previousPrice = asset.price;
        const sector = asset.sector;

        // Calculate price movement components
        const marketComponent = marketDirectionBias * 0.4;
        const sectorComponent = sectorBiases[sector];
        const stockSpecificComponent = (Math.random() - 0.5) * asset.volatility;

        // Combined movement
        const changePercent = marketComponent + sectorComponent + stockSpecificComponent;
        const newPrice = previousPrice * (1 + changePercent / 100);
        const roundedPrice = Math.max(0.01, Math.round(newPrice * 100) / 100); // Ensure price is never negative

        // Update volume - higher volatility typically means higher volume
        const volumeChange = 1 + (Math.random() - 0.5 + Math.abs(changePercent) * 0.1);
        const newVolume = Math.floor(asset.volume * volumeChange);

        // Update asset
        newAssets[symbol] = {
          ...asset,
          previousPrice,
          price: roundedPrice,
          volume: newVolume,
          history: [...asset.history, { day: day + 1, price: roundedPrice }]
        };
      });

      return newAssets;
    });
  }, [day, simulateMarketConditions]);

  // Get chart data for selected timeframe
  const getChartData = useCallback((symbol, timeframe) => {
    const data = assets[symbol]?.history || indices[symbol]?.history;
    if (!data) return [];

    // Filter data based on timeframe
    switch (timeframe) {
      case '1D':
        return data.slice(-2); // Last 2 days
      case '1W':
        return data.slice(-7); // Last 7 days
      case '1M':
        return data.slice(-30); // Last 30 days
      case '3M':
        return data.slice(-90); // Last 90 days
      case '1Y':
        return data.slice(-365); // Last 365 days
      case 'ALL':
      default:
        return data;
    }
  }, [assets, indices]);

  // Get market movers (biggest gainers and losers)
  const getMarketMovers = useCallback(() => {
    const allSymbols = Object.keys(assets);

    // Calculate percentage changes
    const symbolsWithChanges = allSymbols.map(symbol => {
      const asset = assets[symbol];
      const change = ((asset.price - asset.previousPrice) / asset.previousPrice) * 100;
      return { symbol, change };
    });

    // Sort by change percentage
    const sorted = [...symbolsWithChanges].sort((a, b) => b.change - a.change);

    return {
      gainers: sorted.slice(0, 5),
      losers: sorted.slice(-5).reverse()
    };
  }, [assets]);

  // Get all available sectors
  const getSectors = useCallback(() => {
    const sectors = new Set();
    Object.values(assets).forEach(asset => {
      if (asset.sector) {
        sectors.add(asset.sector);
      }
    });
    return Array.from(sectors);
  }, [assets]);

  // Filter assets by sector
  const filterAssetsBySector = useCallback((sector) => {
    return Object.keys(assets).filter(symbol => assets[symbol].sector === sector);
  }, [assets]);

  return (
    <MarketContext.Provider
      value={{
        day,
        assets,
        indices,
        selectedAsset,
        setSelectedAsset,
        timeframe,
        setTimeframe,
        marketTrend,
        advanceDay,
        getChartData,
        getMarketMovers,
        getSectors,
        filterAssetsBySector
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};

export default MarketProvider;