import React, { useState, useContext, useEffect } from 'react';
import { MarketContext } from '../../context/MarketContext';
import NewsItem from './NewsItem';
import './NewsStyles.css';

const NewsFeed = ({ symbol }) => {
  const { day, assets } = useContext(MarketContext);
  const [news, setNews] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'market', 'symbol'

  // Generate mock news data based on the current market day and selected symbol
  useEffect(() => {
    // General market news
    const marketNews = [
      {
        id: `market-${day}-1`,
        title: `Market Update: Major Indices ${Math.random() > 0.5 ? 'Rise' : 'Fall'} as Investors React to Latest Economic Data`,
        date: `Day ${day}`,
        source: 'Market Watch',
        summary: 'Investors are processing the latest economic indicators and adjusting their portfolios accordingly.',
        type: 'market'
      },
      {
        id: `market-${day}-2`,
        title: `Fed Chair Comments on Interest Rate Outlook`,
        date: `Day ${day}`,
        source: 'Financial Times',
        summary: 'The Federal Reserve chair provided insights on the future direction of monetary policy.',
        type: 'market'
      },
      {
        id: `market-${day}-3`,
        title: `Global Markets: International Trade Tensions Impact Stocks`,
        date: `Day ${day}`,
        source: 'Global Finance',
        summary: 'Ongoing diplomatic negotiations are affecting investor sentiment across global markets.',
        type: 'market'
      }
    ];

    // Symbol-specific news (if a symbol is selected)
    let symbolNews = [];
    if (symbol && assets[symbol]) {
      const asset = assets[symbol];
      const priceChange = asset.price - asset.previousPrice;
      const direction = priceChange >= 0 ? 'up' : 'down';
      const percent = Math.abs((priceChange / asset.previousPrice) * 100).toFixed(2);

      symbolNews = [
        {
          id: `${symbol}-${day}-1`,
          title: `${asset.name} (${symbol}) ${direction === 'up' ? 'Climbs' : 'Drops'} ${percent}% in Active Trading`,
          date: `Day ${day}`,
          source: 'Stock Insights',
          summary: `${asset.name} shares ${direction === 'up' ? 'rose' : 'fell'} significantly today amid ${Math.random() > 0.5 ? 'high' : 'moderate'} trading volume.`,
          type: 'symbol',
          symbol: symbol
        },
        {
          id: `${symbol}-${day}-2`,
          title: `Analyst Updates Price Target for ${symbol}`,
          date: `Day ${day}`,
          source: 'Equity Research',
          summary: `Several analysts have adjusted their outlook for ${asset.name} based on recent company developments.`,
          type: 'symbol',
          symbol: symbol
        }
      ];
    }

    const combinedNews = [...marketNews, ...symbolNews];
    setNews(combinedNews);
  }, [day, symbol, assets]);

  const filteredNews = news.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'market') return item.type === 'market';
    if (filter === 'symbol') return item.type === 'symbol' && item.symbol === symbol;
    return true;
  });

  return (
    <div className="news-feed">
      <div className="news-header">
        <h3>Market News</h3>
        <div className="news-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All News
          </button>
          <button
            className={`filter-btn ${filter === 'market' ? 'active' : ''}`}
            onClick={() => setFilter('market')}
          >
            Market
          </button>
          {symbol && (
            <button
              className={`filter-btn ${filter === 'symbol' ? 'active' : ''}`}
              onClick={() => setFilter('symbol')}
            >
              {symbol}
            </button>
          )}
        </div>
      </div>
      <div className="news-list">
        {filteredNews.length > 0 ? (
          filteredNews.map(item => (
            <NewsItem key={item.id} news={item} />
          ))
        ) : (
          <div className="no-news">No news available for the selected filter.</div>
        )}
      </div>
    </div>
  );
};

export default NewsFeed;