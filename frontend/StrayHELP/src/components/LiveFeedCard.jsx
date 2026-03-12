import React from 'react';

const TrendingUpIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#2dd4bf"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const LiveFeedCard = () => {
  return (
    <div className="live-feed-card">
      {/* Header */}
      <div className="card-header">
        <div className="card-icon">
          <TrendingUpIcon />
        </div>
        <span className="live-badge">LIVE FEED</span>
      </div>

      {/* City & stats */}
      <p className="card-city-label">Injured Stray Animals Cases – MUMBAI</p>

      <div className="card-stat-row">
        <span className="stat-number">1,820</span>
        <div className="stat-change">
          <span className="stat-percent">+24%</span>
          <span className="stat-label-small">Increase Today</span>
        </div>
      </div>

      <hr className="card-divider" />

      {/* India rank */}
      <p className="rank-section-label">India Rank</p>
      <div className="rank-row">
        <div className="rank-info">
          <span className="rank-number">#12</span>
          <span className="rank-desc">Top Active Hub</span>
        </div>
        <div className="active-badge">
          <span className="active-dot" />
          ACTIVE
        </div>
      </div>

      {/* CTA */}
      <button className="btn-dashboard">View Global Dashboard</button>
    </div>
  );
};

export default LiveFeedCard;
