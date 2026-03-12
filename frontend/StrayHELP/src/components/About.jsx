import React from 'react';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const POINTS = [
  'Rapid emergency rescue response within minutes',
  'Verified shelter & vet network across 50+ cities',
  'Community-driven adoption & foster programs',
  'Free medical care for injured street animals',
];

const About = () => (
  <section className="about-section" id="about">
    <div className="about-container">

      {/* ── LEFT: text ── */}
      <div className="about-text">
        <span className="about-eyebrow">About Us</span>
        <h2 className="about-heading">
          Every stray animal<br />
          deserves a <span className="about-heading-accent">second chance.</span>
        </h2>
        <p className="about-body">
          StrayHELP connects compassionate citizens, verified rescuers, and
          animal welfare organisations on a single platform. Whether you spot
          an injured dog on the road or want to open your home to a foster
          animal, we make it effortless to take action and track outcomes.
        </p>

        <ul className="about-points">
          {POINTS.map((pt, i) => (
            <li key={i} className="about-point">
              <span className="about-point-icon"><CheckIcon /></span>
              {pt}
            </li>
          ))}
        </ul>


      </div>

      {/* ── RIGHT: floating circles ── */}
      <div className="about-images">
        <div className="dog-circle dog-circle-lg">
          <img
            src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80"
            alt="Rescued stray dog"
          />
          <span className="dog-tag">Rescued ✓</span>
        </div>

        <div className="about-images-row">
          <div className="dog-circle dog-circle-md">
            <img
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&q=80"
              alt="Happy adopted dog"
            />
            <span className="dog-tag">Adopted ♥</span>
          </div>
          <div className="dog-circle dog-circle-md">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=300&q=80"
              alt="Dog getting medical care"
            />
            <span className="dog-tag">Treated ✦</span>
          </div>
        </div>

        <div className="blob blob-teal" aria-hidden="true" />
        <div className="blob blob-orange" aria-hidden="true" />
      </div>

    </div>
  </section>
);

export default About;
