import React, { useState } from 'react';
import './NewsStyles.css';

const NewsItem = ({ news }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`news-item ${expanded ? 'expanded' : ''}`} onClick={toggleExpanded}>
      <div className="news-meta">
        <span className="news-date">{news.date}</span>
        <span className="news-source">{news.source}</span>
        {news.type === 'symbol' && (
          <span className="news-symbol">{news.symbol}</span>
        )}
      </div>
      <h4 className="news-title">{news.title}</h4>
      {expanded && (
        <div className="news-content">
          <p>{news.summary}</p>
          {/* In a real app, this would contain the full article content */}
          <p>This is a simulated news article. In a real trading application, this would contain more detailed information about the market event, analysis, and possibly related data or links.</p>
          <div className="news-actions">
            <button className="btn btn-secondary">Share</button>
            <button className="btn btn-secondary">Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsItem;