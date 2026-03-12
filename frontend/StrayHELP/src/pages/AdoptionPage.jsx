import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

/* ── Mock data ── */
const ANIMALS = [
  { id: 1,  name: 'Luna',   species: 'Dogs',  age: 'Adult (2y-7y)',  ageLabel: '2 years',  size: 'Medium', location: 'Bandra, Mumbai',  tags: ['Vaccinated', 'Friendly'],     desc: 'Luna was found near a construction site with a broken leg. She is now fully recovered and looking for a loving home.',
    img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&auto=format&fit=crop&q=70' },
  { id: 2,  name: 'Milo',   species: 'Cats',  age: 'Baby (0-6m)',   ageLabel: '6 months', size: 'Small',  location: 'Colaba, Mumbai',  tags: ['Playful', 'Indoor Only'],     desc: 'Milo is a resilient kitten who survived the heavy rains. He\'s looking for a warm lap and a cozy corner.',
    img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=500&auto=format&fit=crop&q=70' },
  { id: 3,  name: 'Bruno',  species: 'Dogs',  age: 'Senior (7y+)',  ageLabel: '4 years',  size: 'Large',  location: 'Andheri, Mumbai', tags: ['Protective', 'Trained'],       desc: 'Bruno spent years as a guard dog but is actually a gentle giant. He needs a house with a small yard.',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop&q=70' },
  { id: 4,  name: 'Daisy',  species: 'Dogs',  age: 'Young (6m-2y)', ageLabel: '3 years',  size: 'Medium', location: 'Juhu, Mumbai',    tags: ['Calm', 'House-trained'],       desc: 'Daisy was rescued from a high-traffic highway. She is shy at first but becomes your best friend once she trusts you.',
    img: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&auto=format&fit=crop&q=70' },
  { id: 5,  name: 'Oliver', species: 'Cats',  age: 'Adult (2y-7y)', ageLabel: '1 year',   size: 'Medium', location: 'Powai, Mumbai',   tags: ['Affectionate', 'Ginger'],      desc: 'Oliver is a majestic ginger cat found at a local park. He has a loud purr and a very affectionate personality.',
    img: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=500&auto=format&fit=crop&q=70' },
  { id: 6,  name: 'Bella',  species: 'Dogs',  age: 'Baby (0-6m)',   ageLabel: '5 months', size: 'Small',  location: 'Worli, Mumbai',   tags: ['Energetic', 'Puppy'],           desc: 'Bella is a bundle of energy! She was found in a box outside a clinic. She needs an active family.',
    img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500&auto=format&fit=crop&q=70' },
  { id: 7,  name: 'Simba',  species: 'Cats',  age: 'Young (6m-2y)', ageLabel: '8 months', size: 'Small',  location: 'Bandra, Mumbai',  tags: ['Curious', 'Vaccinated'],       desc: 'Simba is a curious tabby who loves to explore. He was rescued from a drainage pipe during monsoon season.',
    img: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&auto=format&fit=crop&q=70' },
  { id: 8,  name: 'Max',    species: 'Dogs',  age: 'Senior (7y+)',  ageLabel: '7 years',  size: 'Large',  location: 'Malad, Mumbai',   tags: ['Calm', 'Senior'],              desc: 'Max is a loyal senior dog who just wants to spend his golden years in a quiet, loving home.',
    img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=500&auto=format&fit=crop&q=70' },
  { id: 9,  name: 'Coco',   species: 'Birds', age: 'Adult (2y-7y)', ageLabel: '3 years',  size: 'Small',  location: 'Thane, Mumbai',   tags: ['Vocal', 'Friendly'],           desc: 'Coco is a cheerful parakeet who was rescued from an abandoned flat. He loves music and mimicking sounds.',
    img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=500&auto=format&fit=crop&q=70' },
  { id: 10, name: 'Nemo',   species: 'Other', age: 'Young (6m-2y)', ageLabel: '1 year',   size: 'Small',  location: 'Colaba, Mumbai',  tags: ['Gentle', 'Unique'],            desc: 'Nemo is a friendly rabbit who loves to hop around. He was left behind when his owners moved away.',
    img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=500&auto=format&fit=crop&q=70' },
  { id: 11, name: 'Ruby',   species: 'Dogs',  age: 'Young (6m-2y)', ageLabel: '1.5 years',size: 'Medium', location: 'Andheri, Mumbai', tags: ['Playful', 'Vaccinated'],       desc: 'Ruby is a cheerful mixed-breed who was found on Marine Drive. She gets along well with other animals.',
    img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&auto=format&fit=crop&q=70' },
  { id: 12, name: 'Whisker',species: 'Cats',  age: 'Senior (7y+)',  ageLabel: '9 years',  size: 'Medium', location: 'Bandra, Mumbai',  tags: ['Quiet', 'Lap Cat'],            desc: 'Whisker is a serene senior cat who asks for nothing more than a warm blanket and gentle petting.',
    img: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=500&auto=format&fit=crop&q=70' },
];

const PAGE_SIZE = 6;

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#ef4444' : 'none'} stroke={filled ? '#ef4444' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const FilterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="16" y2="6"/><line x1="6" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/>
  </svg>
);
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

/* ── Collapsible filter section ── */
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="adp-filter-section">
      <button className="adp-filter-section-btn" onClick={() => setOpen(o => !o)}>
        <span>{title}</span>
        <ChevronIcon open={open} />
      </button>
      {open && <div className="adp-filter-section-body">{children}</div>}
    </div>
  );
};

/* ── Main page ── */
const AdoptionPage = () => {
  const navigate = useNavigate();

  /* filter state */
  const [search, setSearch] = useState('');
  const [species, setSpecies] = useState([]);
  const [ages, setAges] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [location, setLocation] = useState('');
  const [sortBy, setSortBy] = useState('Recently Saved');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [saved, setSaved] = useState([]);

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const resetAll = () => { setSpecies([]); setAges([]); setSizes([]); setLocation(''); setSearch(''); setPage(1); };

  /* filter + sort */
  const filtered = useMemo(() => {
    let list = ANIMALS.filter(a => {
      if (species.length && !species.includes(a.species)) return false;
      if (ages.length   && !ages.includes(a.age))         return false;
      if (sizes.length  && !sizes.includes(a.size))       return false;
      if (location      && !a.location.toLowerCase().includes(location.toLowerCase())) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!a.name.toLowerCase().includes(q) && !a.species.toLowerCase().includes(q) && !a.desc.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    if (sortBy === 'Name A-Z') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [species, ages, sizes, location, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilters = [
    ...species.map(s => ({ label: s, clear: () => { setSpecies(sp => sp.filter(v => v !== s)); setPage(1); } })),
    ...ages.map(a    => ({ label: a.split(' ')[0], clear: () => { setAges(ag => ag.filter(v => v !== a)); setPage(1); } })),
    ...sizes.map(s   => ({ label: s, clear: () => { setSizes(sz => sz.filter(v => v !== s)); setPage(1); } })),
    ...(location ? [{ label: location, clear: () => { setLocation(''); setPage(1); } }] : []),
  ];

  const goPage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

  return (
    <div className="adp-root">
      {/* ── Top navbar ── */}
      <header className="adp-header">
        <Link to="/" className="adp-header-brand">
          <div className="adp-header-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <span>StrayHELP</span>
        </Link>
        <nav className="adp-header-nav">
          <span className="adp-nav-item" onClick={() => navigate('/user-dashboard')}>Dashboard</span>
          <span className="adp-nav-item adp-nav-active">Adopt</span>
        </nav>
        <button className="adp-back-btn" onClick={() => navigate('/user-dashboard')}>← Back to Dashboard</button>
      </header>

      <div className="adp-layout">
        {/* ══ LEFT SIDEBAR ══ */}
        <aside className="adp-sidebar">
          <div className="adp-sidebar-top">
            <span className="adp-sidebar-title"><FilterIcon /> Filters</span>
            <button className="adp-reset-btn" onClick={resetAll}>Reset All</button>
          </div>

          <FilterSection title="Species">
            {['Dogs', 'Cats', 'Birds', 'Other'].map(s => (
              <label key={s} className="adp-check-label">
                <input type="checkbox" checked={species.includes(s)} onChange={() => { toggleArr(species, setSpecies, s); setPage(1); }} />
                {s}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Age Group">
            {['Baby (0-6m)', 'Young (6m-2y)', 'Adult (2y-7y)', 'Senior (7y+)'].map(a => (
              <label key={a} className="adp-check-label">
                <input type="checkbox" checked={ages.includes(a)} onChange={() => { toggleArr(ages, setAges, a); setPage(1); }} />
                {a}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Size">
            {['Small', 'Medium', 'Large'].map(s => (
              <label key={s} className="adp-check-label">
                <input type="checkbox" checked={sizes.includes(s)} onChange={() => { toggleArr(sizes, setSizes, s); setPage(1); }} />
                {s}
              </label>
            ))}
          </FilterSection>

          <FilterSection title="Location">
            <input
              type="text"
              className="adp-location-input"
              placeholder="e.g. Bandra, Mumbai"
              value={location}
              onChange={e => { setLocation(e.target.value); setPage(1); }}
            />
          </FilterSection>

        </aside>

        {/* ══ MAIN CONTENT ══ */}
        <main className="adp-main">
          {/* Search + sort + view toggle */}
          <div className="adp-toolbar">
            <div className="adp-search-wrap">
              <SearchIcon />
              <input
                className="adp-search"
                placeholder="Search by name, breed, or story..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="adp-toolbar-right">
              <label className="adp-sort-label">Sort by:</label>
              <select className="adp-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option>Recently Saved</option>
                <option>Name A-Z</option>
              </select>
              <button className={`adp-view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><GridIcon /></button>
              <button className={`adp-view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}><ListIcon /></button>
            </div>
          </div>

          {/* Results info + active filter chips */}
          <div className="adp-results-row">
            <p className="adp-results-count">
              Showing <strong>{(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}</strong> of <strong>{filtered.length}</strong> animals waiting for homes
            </p>
            {activeFilters.length > 0 && (
              <div className="adp-active-chips">
                {activeFilters.map((f, i) => (
                  <button key={i} className="adp-active-chip" onClick={f.clear}>
                    {f.label} <span>×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Animal grid / list */}
          {paginated.length === 0 ? (
            <div className="adp-empty">
              <p>No animals found matching your filters.</p>
              <button className="adp-reset-link" onClick={resetAll}>Clear all filters</button>
            </div>
          ) : (
            <div className={`adp-cards ${viewMode === 'list' ? 'adp-cards-list' : ''}`}>
              {paginated.map(a => (
                <div key={a.id} className="adp-card">
                  {/* Photo */}
                  <div className="adp-card-img-wrap">
                    <img src={a.img} alt={a.name} className="adp-card-img" />
                    <button
                      className={`adp-heart-btn ${saved.includes(a.id) ? 'saved' : ''}`}
                      onClick={() => setSaved(s => s.includes(a.id) ? s.filter(i => i !== a.id) : [...s, a.id])}
                    >
                      <HeartIcon filled={saved.includes(a.id)} />
                    </button>
                    <div className="adp-card-img-footer">
                      <span className="adp-card-name">{a.name}</span>
                      <div className="adp-card-location">
                        <PinIcon />{a.location}
                      </div>
                      <span className="adp-card-age-badge">{a.ageLabel}</span>
                    </div>
                  </div>
                  {/* Body */}
                  <div className="adp-card-body">
                    <div className="adp-card-tags">
                      {a.tags.map(t => <span key={t} className="adp-tag">{t}</span>)}
                    </div>
                    <p className="adp-card-desc">{a.desc}</p>
                    <button className="adp-adopt-btn">
                      Adopt {a.name}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="adp-pagination">
              <button className="adp-page-btn" onClick={() => goPage(page - 1)} disabled={page === 1}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p =>
                p <= 4 || p === totalPages ? (
                  <button key={p} className={`adp-page-num ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>{p}</button>
                ) : p === 5 ? <span key="dots" className="adp-page-dots">…</span> : null
              )}
              <button className="adp-page-btn" onClick={() => goPage(page + 1)} disabled={page === totalPages}>Next</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdoptionPage;
