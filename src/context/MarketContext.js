import React, { createContext, useState, useEffect, useCallback } from 'react';

// create context
export const MarketContext = createContext();

//this is to add the initial assets
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
  //add more assets later
};

// provider component
export const MarketProvider = ({ children }) => {
     const [day, setDay] = useState(1);
     const [assets, setAssets] = useState(initialAssets);
     const [selectedAsset, setSelectedAsset] = useState(Object.keys(initialAssets)[0]);
     const [timeframe, setTimeframe] = useState('1D');

     //advance to nexy day - simulate price changes
    const advanceDay = useCallback(() => {
        setDay(prevDay => prevDay + 1);

        setAssets(prevAssets => {
            const newAssets = { ...prevAssets };

            //update each asset
            Object.keys(newAssets).forEach(symbol => {
                const asset = newAssets[symbol];
                const previousPrice = asset.price;

                //random price movement based on volatility
                const changePercent = (Math.random() - 0.5) * asset.volatility * 2;
                const newPrice = previousPrice * (1 + changePercent / 100);
                const roundedPrice = Math.round(newPrice * 100) / 100;

                //update asset
                newAssets[symbol] = {
                    ...asset,
                    previousPrice,
                    price: roundedPrice,
                    history: [...asset.history, { day: day + 1, price: roundedPrice }]
                };
            });

            return newAssets;
        });
    }, [day]);

    //get chart data for selected timeframe
    const getChartData = useCallback((symbol, timeframe)  => {
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
        getChartData
      }}
    >
      {children}
    </MarketContext.Provider>
  );
};