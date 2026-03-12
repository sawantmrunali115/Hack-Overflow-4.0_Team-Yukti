import React, { useState } from 'react';

const ANIMALS = [
  {
    name: 'Bruno',
    breed: 'Indie Mix',
    age: '2 yrs',
    gender: 'Male',
    location: 'Mumbai',
    status: 'Vaccinated',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
    tags: ['Friendly', 'House-trained'],
  },
  {
    name: 'Mia',
    breed: 'Labrador Mix',
    age: '1 yr',
    gender: 'Female',
    location: 'Bengaluru',
    status: 'Spayed',
    image: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&q=80',
    tags: ['Playful', 'Good with kids'],
  },
  {
    name: 'Tiger',
    breed: 'Street Cat',
    age: '3 yrs',
    gender: 'Male',
    location: 'Pune',
    status: 'Neutered',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80',
    tags: ['Calm', 'Indoor'],
  },
  {
    name: 'Luna',
    breed: 'Beagle Mix',
    age: '8 mos',
    gender: 'Female',
    location: 'Delhi',
    status: 'Vaccinated',
    image: 'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&q=80',
    tags: ['Energetic', 'Loves walks'],
  },
  {
    name: 'Coco',
    breed: 'Persian Mix',
    age: '4 yrs',
    gender: 'Female',
    location: 'Hyderabad',
    status: 'Spayed',
    image: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=400&q=80',
    tags: ['Gentle', 'Lap cat'],
  },
  {
    name: 'Rocky',
    breed: 'Desi Dog',
    age: '5 yrs',
    gender: 'Male',
    location: 'Chennai',
    status: 'Vaccinated',
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
    tags: ['Loyal', 'Guard dog'],
  },
];

const FILTERS = ['All', 'Dogs', 'Cats', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune'];

const DOG_BREEDS = ['Indie Mix', 'Labrador Mix', 'Beagle Mix', 'Desi Dog'];

const Adoption = () => {
  const [active, setActive] = useState('All');

  const filtered = ANIMALS.filter((a) => {
    if (active === 'All') return true;
    if (active === 'Dogs') return DOG_BREEDS.includes(a.breed);
    if (active === 'Cats') return a.breed.toLowerCase().includes('cat') || a.breed.toLowerCase().includes('persian');
    return a.location === active;
  });

  return (
    <section className="adoption-section" id="adopt">
      <div className="adoption-header">
        <span className="adoption-eyebrow">Ready for a Home</span>
        <h2 className="adoption-heading">Meet animals waiting for you</h2>
        <p className="adoption-subheading">
          Every animal listed here has been rescued, treated, and cleared for adoption.
          Find your perfect companion today.
        </p>
      </div>

      {/* Filter chips */}
      <div className="adoption-filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`adoption-filter-btn${active === f ? ' active' : ''}`}
            onClick={() => setActive(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="adoption-grid">
        {filtered.map((animal, i) => (
          <div className="adoption-card" key={i}>
            <div className="adoption-img-wrap">
              <img src={animal.image} alt={animal.name} className="adoption-img" />
              <span className="adoption-status-badge">{animal.status}</span>
              <span className="adoption-gender-badge">{animal.gender}</span>
            </div>
            <div className="adoption-card-body">
              <div className="adoption-card-top">
                <div>
                  <p className="adoption-animal-name">{animal.name}</p>
                  <p className="adoption-animal-meta">{animal.breed} · {animal.age}</p>
                </div>
                <div className="adoption-location">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{animal.location}</span>
                </div>
              </div>
              <div className="adoption-tags">
                {animal.tags.map((tag) => (
                  <span key={tag} className="adoption-tag">{tag}</span>
                ))}
              </div>
              <button className="adoption-btn">Adopt {animal.name} →</button>
            </div>
          </div>
        ))}
      </div>

      <div className="adoption-footer-cta">
        <p>Showing {filtered.length} of {ANIMALS.length} animals available for adoption.</p>
        <button className="adoption-see-all">View All Listings</button>
      </div>
    </section>
  );
};

export default Adoption;
