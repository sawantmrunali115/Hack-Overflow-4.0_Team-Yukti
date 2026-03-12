import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Turning compassion<br />
            into action for<br />
            <span className="hero-title-highlight">Stray Animals.</span>
          </h1>

          <p className="hero-subtitle">
            A community-powered platform where people come together
            to rescue, care for, and support stray animals in need.
          </p>

          <div className="hero-buttons">
            <button className="btn-report">Report Injured Animal</button>
            <button className="btn-community">Join the community</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
