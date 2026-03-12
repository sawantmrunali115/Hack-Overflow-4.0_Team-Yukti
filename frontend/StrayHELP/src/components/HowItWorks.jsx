import React from 'react';

const MapPinIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ClockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const STEPS = [
  {
    icon: <MapPinIcon />,
    title: 'Report & Pin',
    desc: 'Spot an animal in need, snap a photo, and pin the location on our live map.',
  },
  {
    icon: <ClockIcon />,
    title: 'Rescuer Alert',
    desc: "Nearby verified NGO's receive an instant notification with all emergency details.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: 'Medical & Rescue',
    desc: 'The animal is picked up, treated at a partner clinic, and saves the lives of the animal.',
  },
];

const HowItWorks = () => (
  <section className="hiw-section" id="how-it-works">
    <div className="hiw-header">
      <span className="hiw-eyebrow">Simple & Fast</span>
      <h2 className="hiw-heading">How StrayHELP works</h2>
      <p className="hiw-subheading">
        From spotting an animal in need to finding it a loving home <br/>
        our simple process makes helping effortless.
      </p>
    </div>

    <div className="hiw-steps">
      {STEPS.map((s, i) => (
        <React.Fragment key={i}>
          {/* Each step column: icon box + text below */}
          <div className="hiw-step-col">
            <div className="hiw-icon-box">{s.icon}</div>
            <h3 className="hiw-card-title">{s.title}</h3>
            <p className="hiw-card-desc">{s.desc}</p>
          </div>
          {/* Dashed connector between columns */}
          {i < STEPS.length - 1 && (
            <div className="hiw-dashed-line" aria-hidden="true" />
          )}
        </React.Fragment>
      ))}
    </div>
  </section>
);

export default HowItWorks;

