import React from 'react';

const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Live Location Reporting',
    desc: 'Instantly pin and report a stray animal in distress with your GPS location. No sign-up needed — report in under 30 seconds.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: 'Instant Rescuer Alerts',
    desc: 'Nearby verified volunteers and rescue teams are notified in real-time with case details, photos, and navigation to the spot.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    title: 'Vet Clinic Network',
    desc: 'Access our directory of 340+ partnered vet clinics that provide free or subsidised treatment for rescued strays.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Adoption Matchmaking',
    desc: 'Browse adoptable animals by location, age, and breed. We vet adopters and guide fulfilling adoption journeys.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: 'Real-time Case Tracking',
    desc: 'Follow the full journey of a reported animal — from rescue to recovery and adoption — with live status updates.',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Volunteer Community',
    desc: 'Join 1,500+ active volunteers. Earn badges, track your rescue history, and connect with fellow animal lovers near you.',
  },
];

const Features = () => (
  <section className="features-section" id="features">
    <div className="features-header">
      <span className="features-eyebrow">Platform Features</span>
      <h2 className="features-heading">Everything you need to help strays</h2>
      <p className="features-subheading">
        StrayHELP brings together technology and compassion to make animal rescue
        faster, smarter, and more connected than ever before.
      </p>
    </div>
    <div className="features-grid">
      {FEATURES.map((f, i) => (
        <div className="feature-card" key={i}>
          <div className="feature-icon-wrap">{f.icon}</div>
          <h3 className="feature-title">{f.title}</h3>
          <p className="feature-desc">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Features;
