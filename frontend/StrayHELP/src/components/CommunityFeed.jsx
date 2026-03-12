import React from 'react';

const POSTS = [
  {
    id: 1,
    ngo: 'Vana Sanctuary East',
    title: 'Mobile Surgical Unit: 100 Days of Impact',
    date: '12 March 2026',
    summary: 'Our solar-powered mobile unit has successfully performed 140+ on-site procedures across 12 rural districts this quarter, bypassing the need for high-stress transport of injured wildlife.',
    impact: '142 Procedures',
    category: 'Medical Update',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200',
  },
  {
    id: 2,
    ngo: 'SaveOurStrays NGO',
    title: 'Strategic Adoption Milestone in Mumbai Central',
    date: '10 March 2026',
    summary: 'A record-breaking weekend where 24 senior dogs found their forever homes through our Golden Paws initiative, focusing on animals usually overlooked in shelters.',
    impact: '24 Adoptions',
    category: 'Success Story',
    image: 'https://images.unsplash.com/photo-1548191265-cc70d3d45ba1?q=80&w=800',
  },
  {
    id: 3,
    ngo: 'The Ahimsa Collective',
    title: 'Emergency Monsoon Protocols 2026',
    date: '08 March 2026',
    summary: 'Updating our network on flood-risk zones and temporary shelter locations for large bovines. Proactive placement of rescue rafts is now complete across North districts.',
    impact: 'Network Alert',
    category: 'Safety',
    image: 'https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=800',
  },
];

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const ArrowUpRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

export default function CommunityFeed() {
  return (
    <div className="ngod-community-shell">
      <div className="ngod-community-toolbar">
        <div>
          <h2 className="ngod-community-hero-title">
            Sanctuary <span>Dispatches</span>
          </h2>
          <p className="ngod-community-hero-subtitle">
            Updates from our network of NGOs around the country.
          </p>
        </div>
        <div className="ngod-community-toolbar-actions">
          <button type="button" className="ngod-community-filter-btn">
            <FilterIcon /> Filter Feed
          </button>
          <button type="button" className="ngod-community-post-btn">
            <PlusIcon /> Post Update
          </button>
        </div>
      </div>

      <div className="ngod-community-feed ngod-community-feed-large">
        {POSTS.map((post, idx) => (
          <article className="ngod-community-story" key={post.id}>
            <div className={`ngod-community-story-grid${idx % 2 !== 0 ? ' reverse' : ''}`}>
              <div className="ngod-community-story-image-wrap">
                <img src={post.image} alt={post.title} className="ngod-community-story-image" />
                <div className="ngod-community-story-badge">{post.category}</div>
              </div>

              <div className="ngod-community-story-content">
                <div className="ngod-community-story-metahead">
                  <div className="ngod-community-story-icon"><ShieldIcon /></div>
                  <div>
                    <p className="ngod-community-story-ngo">{post.ngo}</p>
                    <p className="ngod-community-story-date">{post.date}</p>
                  </div>
                </div>

                <h3 className="ngod-community-story-title">{post.title}</h3>
                <p className="ngod-community-story-summary">{post.summary}</p>

                <div className="ngod-community-story-footer">
                  <div className="ngod-community-story-impact">
                    <BarChartIcon />
                    <span>{post.impact}</span>
                  </div>
                  <button type="button" className="ngod-community-story-link">
                    View Report <ArrowUpRightIcon />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}