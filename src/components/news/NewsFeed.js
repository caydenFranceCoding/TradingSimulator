import React, { useState, useEffect } from 'react';
import NewsItem from './NewsItem';
import { getMarketNews, getStockNews } from '../../services/newsService';

const NewsFeed = ({ filterSymbol = null }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);

             try {
        let newsData;

        if (filterSymbol) {
          // Get news specific to this stock
          newsData = await getStockNews(filterSymbol);
        } else {
          // Get general market news
          newsData = await getMarketNews();
        }

        setNews(newsData);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news. Please try again later.');
        setNews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [filterSymbol]);

  if (loading) {
    return (
      <div className="news-feed news-feed-loading">
        <p>Loading news{filterSymbol ? ` for ${filterSymbol}` : ''}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-feed news-feed-error">
        <p>{error}</p>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="news-feed news-feed-empty">
        <p>No recent news available{filterSymbol ? ` for ${filterSymbol}` : ''}.</p>
      </div>
    );
  }

  return (
    <div className="news-feed">
      <h3 className="news-feed-title">
        {filterSymbol ? `News for ${filterSymbol}` : 'Market News'}
      </h3>
      <div className="news-feed-items">
        {news.map(item => (
          <NewsItem key={item.id} news={item} />
        ))}
      </div>
      <style jsx>{`
        .news-feed {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        
        .news-feed-title {
          margin-top: 0;
          font-size: 18px;
          color: #333;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .news-feed-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .news-feed-empty, .news-feed-loading, .news-feed-error {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          text-align: center;
          color: #666;
        }
        
        .news-feed-error {
          color: #e74c3c;
        }
      `}</style>
    </div>
  );
};

export default NewsFeed;