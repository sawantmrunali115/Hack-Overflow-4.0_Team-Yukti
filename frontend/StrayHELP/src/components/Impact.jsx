import React from 'react';

const IMPACTS = [
  {
    title: 'Rescue & Reporting',
    desc: 'Our platform enables anyone to instantly report a stray animal in distress. With real-time location pinning and photo uploads, rescue teams are alerted within minutes — cutting response time and saving lives across the city.',
  },
  {
    title: 'Medical & Rehabilitation',
    desc: 'Rescued animals are connected to our network of partnered vet clinics for emergency care, vaccinations, and rehabilitation. We coordinate transport, treatment, and recovery so no animal is left without medical support.',
  },
  {
    title: 'Adoption & Community',
    desc: 'Healthy, treated animals are listed for adoption on our platform. We vet adopters, facilitate meet-and-greet sessions, and provide post-adoption support — building a compassionate community one home at a time.',
  },
];

const Impact = () => (
  <section className="impact-section" id="impact">
    <div className="impact-header">
      <span className="impact-eyebrow">Our Impact</span>
      <h2 className="impact-heading">Making a real difference</h2>
      <p className="impact-subheading">
        Every report, rescue, and adoption adds to a growing story of compassion.
        Here's what the StrayHELP community has achieved together.
      </p>
    </div>

    <div className="impact-grid">
      {IMPACTS.map((item, i) => (
        <div className="impact-card" key={i}>
          <p className="impact-card-title">{item.title}</p>
          <p className="impact-card-desc">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Impact;
