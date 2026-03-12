import React from 'react';
import { Link } from 'react-router-dom';

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const HeartLogo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

export default function DashboardTopbar({
  items,
  activeKey,
  onItemClick,
  onLogout,
  initials,
  userTitle,
}) {
  return (
    <header className="ngo-header">
      <Link to="/" className="ngo-header-brand">
        <div className="ngo-header-logo"><HeartLogo /></div>
        <span>StrayHELP</span>
      </Link>

      <nav className="ngo-header-nav" aria-label="Dashboard navigation">
        {items.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`ngo-nav-item ${activeKey === item.key ? 'ngo-nav-active' : ''}`}
            onClick={() => onItemClick(item.key)}
          >
            {item.label}
            {item.badge ? <span className="vol-nav-badge">{item.badge}</span> : null}
          </button>
        ))}
      </nav>

      <div className="ngo-header-actions">
        <button type="button" className="ngo-notif-btn" aria-label="Notifications">
          <BellIcon />
          <span className="ngo-notif-dot" />
        </button>
        <div className="ngo-avatar" title={userTitle || ''}>{initials}</div>
        <button type="button" className="ngo-logout-btn" onClick={onLogout}>Log out</button>
      </div>
    </header>
  );
}