import React, { useState } from 'react';

const PERKS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    text: 'Get notified of strays near your location',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    text: 'Join 1,500+ active rescue volunteers',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    text: 'Track every rescue you contribute to',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#99f6e4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    text: 'Earn badges and recognition for your impact',
  },
];

const CTA = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="cta-section">
      <div className="cta-blob cta-blob-1" />
      <div className="cta-blob cta-blob-2" />

      <div className="cta-inner">
        {/* LEFT — Form */}
        <div className="cta-form-col">
          <div className="cta-form-card">
            <h3 className="cta-form-title">Become a Volunteer</h3>
            <p className="cta-form-subtitle">Fill in your details and we'll get you started right away.</p>

            {submitted ? (
              <div className="cta-success">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <p>Thanks for signing up! We'll reach out soon.</p>
              </div>
            ) : (
              <form className="cta-form" onSubmit={handleSubmit}>
                <div className="cta-form-row">
                  <div className="cta-field">
                    <label>First Name</label>
                    <input type="text" placeholder="Priya" required />
                  </div>
                  <div className="cta-field">
                    <label>Last Name</label>
                    <input type="text" placeholder="Sharma" required />
                  </div>
                </div>
                <div className="cta-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="priya@email.com" required />
                </div>
                <div className="cta-field">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 98765 43210" />
                </div>
                <div className="cta-field">
                  <label>City</label>
                  <input type="text" placeholder="Mumbai" required />
                </div>
                <div className="cta-field">
                  <label>How would you like to help?</label>
                  <select required>
                    <option value="">Select an option</option>
                    <option>Rescue & Transport</option>
                    <option>Medical Assistance</option>
                    <option>Foster Care</option>
                    <option>Adoption Coordination</option>
                    <option>Awareness & Outreach</option>
                  </select>
                </div>
                <button type="submit" className="cta-submit-btn">Join as Volunteer →</button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT — Info */}
        <div className="cta-info-col">
          <span className="cta-eyebrow">Join the Movement</span>
          <h2 className="cta-heading">
            Every second matters for a{' '}
            <span className="cta-highlight">stray in need.</span>
          </h2>
          <p className="cta-subtext">
            Thousands of stray animals across India need urgent help every day.
            Volunteers like you are the backbone of every successful rescue.
            Sign up and make your compassion count.
          </p>

          <ul className="cta-perks">
            {PERKS.map((p, i) => (
              <li key={i} className="cta-perk">
                <span className="cta-perk-icon">{p.icon}</span>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>

          <div className="cta-stats-row">
            <div className="cta-stat">
              <span className="cta-stat-value">1,500+</span>
              <span className="cta-stat-label">Volunteers</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat-value">8,400+</span>
              <span className="cta-stat-label">Animals Rescued</span>
            </div>
            <div className="cta-stat-divider" />
            <div className="cta-stat">
              <span className="cta-stat-value">50+</span>
              <span className="cta-stat-label">Cities</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
