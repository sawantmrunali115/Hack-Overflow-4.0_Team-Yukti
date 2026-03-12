import React, { useState } from 'react';

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Volunteer Rescuer · Mumbai',
    avatar: 'PS',
    text: "I used StrayHELP to report an injured dog I found near my office. Within 20 minutes a rescuer showed up. The real-time updates kept me informed the whole time. It felt incredible to actually help.",
    color: '#0d9488',
  },
  {
    name: 'Rohan Mehra',
    role: 'Adopter · Bengaluru',
    avatar: 'RM',
    text: "Found my cat Milo through StrayHELP's adoption listings. The platform was transparent about his medical history and the team supported us even after adoption. Best decision we ever made.",
    color: '#f97316',
  },
  {
    name: 'Dr. Anjali Nair',
    role: 'Partner Veterinarian · Pune',
    avatar: 'AN',
    text: "As a partnered vet clinic, StrayHELP makes coordinating rescue care seamless. We receive detailed case notes before animals arrive. The system is well-designed and genuinely saves lives.",
    color: '#0d9488',
  },
  {
    name: 'Sameer Kapoor',
    role: 'NGO Coordinator · Delhi',
    avatar: 'SK',
    text: "Our rescue NGO has tripled its response capacity since integrating with StrayHELP. The volunteer network and alert system are unmatched — we now cover 3x more ground with the same team.",
    color: '#f97316',
  },
  {
    name: 'Nisha Patel',
    role: 'Community Member · Ahmedabad',
    avatar: 'NP',
    text: "I was always worried about stray animals in my neighbourhood but didn't know how to help. StrayHELP gave me a simple way to act. I've now reported 12 cases and two have been adopted!",
    color: '#0d9488',
  },
  {
    name: 'Arjun Desai',
    role: 'Rescue Volunteer · Hyderabad',
    avatar: 'AD',
    text: "The case tracking is phenomenal. You can follow an animal from the moment it's reported to when it finds a home. That closure is what keeps me volunteering every weekend.",
    color: '#f97316',
  },
];

// Group into pairs — each slide shows 2 cards
const SLIDES = [];
for (let i = 0; i < TESTIMONIALS.length; i += 2) {
  SLIDES.push(TESTIMONIALS.slice(i, i + 2));
}

const TestimonialCard = ({ t }) => (
  <div className="testimonial-card">
    <svg className="testimonial-quote-icon" width="32" height="32" viewBox="0 0 24 24" fill="#0d9488" opacity="0.12">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
    <p className="testimonial-text">"{t.text}"</p>
    <div className="testimonial-author">
      <div className="testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
      <div>
        <p className="testimonial-name">{t.name}</p>
        <p className="testimonial-role">{t.role}</p>
      </div>
    </div>
  </div>
);

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-header">
        <span className="testimonials-eyebrow">Community Stories</span>
        <h2 className="testimonials-heading">Voices behind every rescue</h2>
        <p className="testimonials-subheading">
          Real stories from the volunteers, adopters, vets, and community members
          who make every rescue possible.
        </p>
      </div>

      <div className="testimonials-carousel">
        {/* Prev button */}
        <button className="testimonials-arrow testimonials-arrow-prev" onClick={prev} aria-label="Previous">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Slide */}
        <div className="testimonials-slide">
          {SLIDES[current].map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>

        {/* Next button */}
        <button className="testimonials-arrow testimonials-arrow-next" onClick={next} aria-label="Next">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Dots */}
      <div className="testimonials-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`testimonials-dot${current === i ? ' active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
