import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNgoDashboard, markRescued } from '../api/ngo';
import { clearSession, getStoredUser } from '../api/auth';
import CommunityFeed from '../components/CommunityFeed';
import DashboardTopbar from '../components/DashboardTopbar';
import Footer from '../components/Footer';

// ── Priority mapping ──────────────────────────────────────────────────────────
const PRIORITY = {
  Critical: { label: 'HIGH PRIORITY', cls: 'ngod-priority-high' },
  Moderate: { label: 'MEDIUM PRIORITY', cls: 'ngod-priority-medium' },
  Minor:    { label: 'LOW PRIORITY',  cls: 'ngod-priority-low' },
};

const NGO_SECTIONS = [
  { key: 'incoming', label: 'Incoming Reports' },
  { key: 'directory', label: 'Directory' },
  { key: 'community', label: 'Community' },
];

const STATUS_OPTIONS = ['reported', 'ngo accepted', 'enroute', 'rescued', 'recovering'];

const SHOWCASE_OVERRIDES = [
  {
    photo_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80',
    breed: 'Canine — Indian Pariah',
    location: 'Andheri East, near Metro Pillar 45',
    description: 'Visible injury on the front paw. The dog looks weak and has been sitting in the same spot for hours.',
    injury_sev: 'Critical',
  },
  {
    photo_url: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=1000&auto=format&fit=crop&q=80',
    breed: 'Feline — Ginger Tabby',
    location: 'Bandra West, near Chapel Road',
    description: 'A ginger stray cat is limping and avoiding pressure on the back leg. Needs a rescue check soon.',
    injury_sev: 'Moderate',
  },
];

const DIRECTORY_CASES = [
  {
    id: 'SH-9901',
    type: 'Canine',
    breed: 'Indian Pariah',
    status: 'ngo accepted',
    volunteer: 'Arjun Mehta',
    location: 'Andheri East',
    severity: 'High',
    imageUrl: SHOWCASE_OVERRIDES[0].photo_url,
  },
  {
    id: 'SH-9905',
    type: 'Feline',
    breed: 'Ginger Tabby',
    status: 'enroute',
    volunteer: 'Suresh K.',
    location: 'Bandra West',
    severity: 'Medium',
    imageUrl: SHOWCASE_OVERRIDES[1].photo_url,
  },
];

// ── Demo fallback posts (always visible even without login) ───────────────────
const DEMO_POSTS = [
  {
    id: 9981,
    user: { first_name: 'Rahul', last_name: 'Sharma', username: 'rahul.sharma@demo.com' },
    photo_url: SHOWCASE_OVERRIDES[0].photo_url,
    location: 'Andheri East, near Metro Pillar 45',
    description: SHOWCASE_OVERRIDES[0].description,
    injury_sev: SHOWCASE_OVERRIDES[0].injury_sev,
    breed: SHOWCASE_OVERRIDES[0].breed,
    is_rescued: false,
    created_at: '2026-03-12T08:58:00Z',
  },
  {
    id: 9985,
    user: { first_name: 'Priya', last_name: 'K.', username: 'priya.k@demo.com' },
    photo_url: SHOWCASE_OVERRIDES[1].photo_url,
    location: SHOWCASE_OVERRIDES[1].location,
    description: SHOWCASE_OVERRIDES[1].description,
    injury_sev: SHOWCASE_OVERRIDES[1].injury_sev,
    breed: SHOWCASE_OVERRIDES[1].breed,
    is_rescued: false,
    created_at: '2026-03-12T09:35:00Z',
  },
];

function applyShowcaseOverrides(inputPosts) {
  return inputPosts.map((post, index) => {
    const override = SHOWCASE_OVERRIDES[index];
    return override ? { ...post, ...override } : post;
  });
}

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  }).toUpperCase();
}

function formatReporter(user) {
  if (!user) return 'UNKNOWN REPORTER';
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ').toUpperCase();
  return name || (user.username ? user.username.toUpperCase() : 'UNKNOWN');
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const AlertDotIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <circle cx="4" cy="4" r="4" />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────────
export default function NgoDashboard() {
  const navigate = useNavigate();
  const [ngo, setNgo] = useState(null);
  const [currentPage, setCurrentPage] = useState('incoming');
  // Start with demo posts so cards are visible immediately
  const [posts, setPosts] = useState(applyShowcaseOverrides(DEMO_POSTS));
  const [directoryCases, setDirectoryCases] = useState(DIRECTORY_CASES);
  const [loading, setLoading] = useState(false);
  const [handled, setHandled] = useState({});
  const [savedCaseId, setSavedCaseId] = useState('');

  const storedUser = getStoredUser();

  const loadDashboard = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // No token — show demo cards, no redirect
      setPosts(applyShowcaseOverrides(DEMO_POSTS));
      return;
    }

    setLoading(true);
    fetchNgoDashboard()
      .then(res => {
        setNgo(res.data.ngo);
        const livePosts = res.data.posts.filter(p => !p.is_rescued);
        setPosts(livePosts);
      })
      .catch(() => {
        // If API fails (not NGO user, 401, etc.) — keep showing demo cards
        setPosts(applyShowcaseOverrides(DEMO_POSTS));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return undefined;

    const intervalId = window.setInterval(() => {
      loadDashboard();
    }, 10000);

    return () => window.clearInterval(intervalId);
  }, [loadDashboard]);

  const handleAccept = async (postId) => {
    setHandled(prev => ({ ...prev, [postId]: 'accepted' }));
    try {
      await markRescued(postId);
    } catch (e) {
      console.error('Accept failed', e);
    }
    // Remove card after brief delay so user sees the confirmed state
    setTimeout(() => {
      setPosts(prev => prev.filter(p => p.id !== postId));
      setHandled(prev => { const n = { ...prev }; delete n[postId]; return n; });
    }, 1100);
  };

  const handleDecline = (postId) => {
    setHandled(prev => ({ ...prev, [postId]: 'declined' }));
    setTimeout(() => {
      setPosts(prev => prev.filter(p => p.id !== postId));
      setHandled(prev => { const n = { ...prev }; delete n[postId]; return n; });
    }, 1100);
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const handleDirectoryChange = (caseId, field, value) => {
    setDirectoryCases((prev) => prev.map((item) => (
      item.id === caseId ? { ...item, [field]: value } : item
    )));
  };

  const handleSaveDirectoryCase = (caseId) => {
    setSavedCaseId(caseId);
    window.setTimeout(() => setSavedCaseId(''), 1400);
  };

  const pageCopy = {
    incoming: {
      eyebrow: 'LIVE ALERTS',
      titleA: 'INCOMING',
      titleB: 'REPORTS',
      subtitle: 'New rescue requests nearby. Every report is urgent—step in and make a difference right now.',
    },
    directory: {
      eyebrow: 'NETWORK MAP',
      titleA: 'NGO',
      titleB: 'DIRECTORY',
      subtitle: 'Quick access to rescue partners and local organizations operating across your active areas.',
    },
    community: {
      eyebrow: 'TEAM COORDINATION',
      titleA: 'NGO',
      titleB: 'COMMUNITY',
      subtitle: 'Keep rescue organizations, volunteers, and temporary foster networks aligned on active cases.',
    },
  };

  const activeCopy = pageCopy[currentPage];
  const initials = (storedUser.first_name || storedUser.given_name || storedUser.name || storedUser.username || 'N')
    .split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase();

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="ngod-page">
      <DashboardTopbar
        items={NGO_SECTIONS}
        activeKey={currentPage}
        onItemClick={setCurrentPage}
        onLogout={handleLogout}
        initials={initials}
        userTitle={storedUser.name || storedUser.username || ngo?.ngo_name || 'NGO User'}
      />

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <main className="ngod-main">

        {/* Hero */}
        <div className="ngod-hero">
          <span className="ngod-eyebrow">
            <AlertDotIcon />
            {activeCopy.eyebrow}
          </span>
          <h1 className="ngod-heading">
            <span className="ngod-heading-teal">{activeCopy.titleA}</span>{' '}
            <span className="ngod-heading-orange">{activeCopy.titleB}</span>
          </h1>
          <p className="ngod-subtitle">
            {activeCopy.subtitle}
          </p>
          {ngo?.tag_area && currentPage === 'incoming' && (
            <p className="ngod-area-note">
              Showing active reports in: <strong>{ngo.tag_area}</strong>
              &nbsp;·&nbsp;
              <span className="ngod-pending-count">{posts.length} pending</span>
            </p>
          )}
        </div>

        {/* Live loading overlay */}
        {loading && (
          <div className="ngod-loading-inline">
            <div className="ngod-spinner-sm" /> Refreshing live data…
          </div>
        )}

        {currentPage === 'incoming' && posts.length > 0 && (
          <div className="ngod-cards-grid">
            {posts.map(post => {
              const pInfo = PRIORITY[post.injury_sev] || { label: 'UNCLASSIFIED', cls: 'ngod-priority-unknown' };
              const caseId = `SH-${String(post.id).padStart(4, '0')}`;
              const reporterName = formatReporter(post.user);
              const reportTime = formatTime(post.created_at);
              // Breed stored as "Canine — Indian Pariah" → split for two-tone display
              const breedParts = post.breed ? post.breed.split(' — ') : [];
              const animalType = breedParts[0]?.toUpperCase() || null;
              const breedName  = breedParts[1]?.toUpperCase() || null;
              const isHandled = handled[post.id];

              return (
                <div
                  key={post.id}
                  className={`ngod-card${isHandled === 'accepted' ? ' ngod-card-accepted' : ''}${isHandled === 'declined' ? ' ngod-card-declined' : ''}`}
                >
                  {/* Photo area */}
                  <div className="ngod-card-img-wrap">
                    {post.photo_url ? (
                      <img
                        src={post.photo_url}
                        alt="Animal in distress"
                        className="ngod-card-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="ngod-card-no-photo">
                        <span>📷</span>
                        <span>No Photo</span>
                      </div>
                    )}
                    {/* Overlay badges */}
                    <span className="ngod-case-id-badge">{caseId}</span>
                    <span className={`ngod-priority-badge ${pInfo.cls}`}>
                      {pInfo.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="ngod-card-body">

                    {/* Animal info */}
                    <div className="ngod-animal-row">
                      {animalType ? (
                        <>
                          <span className="ngod-animal-type">{animalType}</span>
                          {breedName && (
                            <>
                              <span className="ngod-animal-dash"> &mdash; </span>
                              <span className="ngod-animal-breed">{breedName}</span>
                            </>
                          )}
                        </>
                      ) : (
                        <span className="ngod-animal-type ngod-breed-unknown">ANIMAL REPORT</span>
                      )}
                    </div>

                    {/* Reporter line */}
                    <p className="ngod-reporter-line">
                      BY {reporterName} AT {reportTime}
                    </p>

                    {/* Divider */}
                    <div className="ngod-card-divider" />

                    {/* Incident description */}
                    {post.description && (
                      <div className="ngod-incident-block">
                        <span className="ngod-incident-label">INCIDENT REPORT</span>
                        <p className="ngod-incident-quote">"{post.description}"</p>
                      </div>
                    )}

                    {/* Location */}
                    {post.location && (
                      <div className="ngod-location-chip">
                        <PinIcon />
                        <span className="ngod-location-text">{post.location}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="ngod-actions">
                      <button
                        className="ngod-decline-btn"
                        onClick={() => handleDecline(post.id)}
                        disabled={!!isHandled}
                      >
                        {isHandled === 'declined' ? 'DECLINED' : 'DECLINE'}
                      </button>
                      <button
                        className="ngod-accept-btn"
                        onClick={() => handleAccept(post.id)}
                        disabled={!!isHandled}
                      >
                        {isHandled === 'accepted' ? '✓ ACCEPTED' : 'ACCEPT CASE'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {currentPage === 'incoming' && posts.length === 0 && !loading && (
          <div className="ngod-loading-inline">
            No active reports yet. New community reports will appear here automatically.
          </div>
        )}

        {currentPage === 'directory' && (
          <div className="ngod-directory-grid">
            {directoryCases.map((rescue) => (
              <article className="ngod-directory-card" key={rescue.id}>
                <div className="ngod-directory-image-wrap">
                  <img src={rescue.imageUrl} alt={rescue.type} className="ngod-directory-image" />
                  <div className="ngod-directory-image-badge">{rescue.type}</div>
                  <div className="ngod-directory-image-footer">
                    <p className="ngod-directory-case-id">{rescue.id}</p>
                    <h3 className="ngod-directory-breed">{rescue.breed}</h3>
                    <p className="ngod-directory-location">{rescue.location}</p>
                  </div>
                </div>

                <div className="ngod-directory-content">
                  <div>
                    <label className="ngod-directory-label">Rescue Status</label>
                    <select
                      className="ngod-directory-select"
                      value={rescue.status}
                      onChange={(e) => handleDirectoryChange(rescue.id, 'status', e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="ngod-directory-label">Assigned Rescuer</label>
                    <input
                      type="text"
                      value={rescue.volunteer}
                      className="ngod-directory-input"
                      placeholder="Assign rescuer"
                      onChange={(e) => handleDirectoryChange(rescue.id, 'volunteer', e.target.value)}
                    />
                  </div>

                  <div className="ngod-directory-priority-box">
                    <p className="ngod-directory-priority-label">Priority Level</p>
                    <p className="ngod-directory-priority-value">{rescue.severity}</p>
                  </div>

                  <button
                    type="button"
                    className="ngod-directory-save-btn"
                    onClick={() => handleSaveDirectoryCase(rescue.id)}
                  >
                    {savedCaseId === rescue.id ? 'Changes Saved' : 'Save Changes'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {currentPage === 'community' && (
          <CommunityFeed />
        )}
      </main>
      <Footer />
    </div>
  );
}
