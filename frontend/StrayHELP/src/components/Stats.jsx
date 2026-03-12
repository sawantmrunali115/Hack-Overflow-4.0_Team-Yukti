import React from 'react';

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const HeartIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ChatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const STATS = [
  { icon: <ShieldIcon />, value: '8,420+', label: 'SUCCESSFUL RESCUES' },
  { icon: <HeartIcon />,  value: '3,150',  label: 'LOVING ADOPTIONS'   },
  { icon: <ChatIcon />,   value: '12K+',   label: 'MEDICAL TREATMENTS' },
  { icon: <UsersIcon />,  value: '1,500',  label: 'VOLUNTEERS NETWORK' },
];

const Stats = () => (
  <section className="stats-section">
    {/* decorative paw watermarks */}
    <span className="paw paw-1" aria-hidden="true">🐾</span>
    <span className="paw paw-2" aria-hidden="true">🐾</span>
    <span className="paw paw-3" aria-hidden="true">🐾</span>
    <span className="paw paw-4" aria-hidden="true">🐾</span>

    <div className="stats-grid">
      {STATS.map((s, i) => (
        <div className="stat-item" key={i}>
          <div className="stat-icon-wrap">{s.icon}</div>
          <p className="stat-value">{s.value}</p>
          <p className="stat-name">{s.label}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Stats;
