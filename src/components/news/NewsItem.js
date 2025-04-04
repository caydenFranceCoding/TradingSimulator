

const NewsItem = ({ news }) => {
  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Open news article in a new tab
  const openNewsArticle = () => {
    if (news.url) {
      window.open(news.url, '_blank');
    }
  };

  return (
    <div className="news-item" onClick={openNewsArticle} role="button" tabIndex={0}>
      <div className="news-content">
        <h4 className="news-title">{news.title}</h4>
        <div className="news-meta">
          <span className="news-source">{news.source}</span>
          <span className="news-date">{formatDate(news.date)}</span>
        </div>
        <p className="news-snippet">{news.snippet}</p>
        <div className="news-tags">
          {news.relevantSymbols && news.relevantSymbols.map(symbol => (
            <span key={symbol} className="news-tag">{symbol}</span>
          ))}
        </div>
      </div>

      {news.imageUrl && (
        <div className="news-image">
          <img src={news.imageUrl} alt={news.title} />
        </div>
      )}
      <style jsx>{`
        .news-item {
          display: flex;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .news-item:hover {
          background-color: #f9f9f9;
        }
        
        .news-item:last-child {
          border-bottom: none;
        }
        
        .news-content {
          flex: 1;
        }
        
        .news-image {
          width: 120px;
          height: 80px;
          margin-left: 15px;
          flex-shrink: 0;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .news-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .news-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }
        
        .news-meta {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        
        .news-source {
          font-weight: 500;
        }
        
        .news-snippet {
          font-size: 14px;
          line-height: 1.4;
          color: #444;
          margin: 0 0 10px 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .news-tags {
          display: flex;
          gap: 5px;
          flex-wrap: wrap;
        }
        
        .news-tag {
          font-size: 11px;
          background-color: #f0f2f5;
          color: #3498db;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default NewsItem;