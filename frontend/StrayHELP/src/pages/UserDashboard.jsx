import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import exifr from 'exifr';
import { getMyPosts, createPost, extractLocation, fetchNGOs } from '../api/posts';
import { clearSession, getStoredUser } from '../api/auth';
import CommunityFeed from '../components/CommunityFeed';
import DashboardTopbar from '../components/DashboardTopbar';
import BreedIdentificationReport from '../components/BreedIdentificationReport';



/* ── Icons ── */
const UploadIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
  </svg>
);
const PinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0d9488" stroke="none">
    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
  </svg>
);
const MailIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
  </svg>
);

const SEVERITY_LEVELS = ['Critical', 'Moderate', 'Minor'];
const SEVERITY_TEXT_COLOR = { Critical: '#dc2626', Moderate: '#d97706', Minor: '#16a34a' };
const MOCK_DISTS = ['2.5 km away', '3.1 km away', '5.8 km away', '7.2 km away'];

const getSeverityImpact = (injurySeverity, idx) => {
  const base = SEVERITY_LEVELS.indexOf(injurySeverity);
  return SEVERITY_LEVELS[Math.min((base === -1 ? 0 : base) + idx, SEVERITY_LEVELS.length - 1)];
};

const safetyTips = [
  { icon: <ShieldIcon />, text: 'Keep a safe distance (2-3 meters) to avoid scaring the animal further.' },
  { icon: <HeartIcon />, text: 'Do not offer food or water unless specifically instructed by a professional rescuer.' },
  { icon: <AlertIcon />, text: 'If the animal is on a busy road, prioritize your own safety first before signalling.' },
  { icon: <InfoIcon />, text: 'Wait in the vicinity if possible, but move to a shaded or safe spot.' },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const user = getStoredUser() || {};
  const initials = (user.first_name || user.given_name || user.name || user.username || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const [activeTab, setActiveTab] = useState('quick-report');
  const [volunteerProfile, setVolunteerProfile] = useState(() => {
    try { return JSON.parse(localStorage.getItem('volunteerProfile')) || null; }
    catch { return null; }
  });

  const dashboardNavItems = [
    { key: 'quick-report', label: 'Quick Report' },
    { key: 'my-cases', label: 'My Cases' },
    { key: 'volunteers', label: 'Volunteers', badge: volunteerProfile ? 'Active' : undefined },
    { key: 'community', label: 'Community' },
    { key: 'adopt', label: 'Adopt' },
  ];
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [location, setLocation] = useState('');
  const [detecting, setDetecting] = useState(false);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [reportResult, setReportResult] = useState(null); // { analysis, post }
  const [nearbyNGOs, setNearbyNGOs] = useState([]);
  const [acceptedNGOs, setAcceptedNGOs] = useState(new Set());

  // Helper: reverse-geocode a lat/lng pair using Nominatim
  const _reverseGeocode = async (lat, lng) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  };

  // Helper: browser geolocation → reverse-geocode
  const _geolocateBrowser = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error('Geolocation unavailable'));
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        (err) => reject(err)
      );
    });

  const handleFile = async (file) => {
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
    setLocation('');
    setDetecting(true);

    // Tier 1: client-side EXIF GPS via exifr
    try {
      const gps = await exifr.gps(file);
      if (gps && gps.latitude != null && gps.longitude != null) {
        const addr = await _reverseGeocode(gps.latitude, gps.longitude);
        setLocation(addr);
        setDetecting(false);
        return;
      }
    } catch { /* exifr failed — try next tier */ }

    // Tier 2: server-side EXIF extraction (PIL — handles more formats)
    try {
      const response = await extractLocation(file);
      if (response.status === 200 && response.data.location) {
        setLocation(response.data.location);
        setDetecting(false);
        return;
      }
    } catch { /* backend returned 204 (no GPS) or network error */ }

    // Tier 3: fall back to browser's Geolocation API
    try {
      const { latitude, longitude } = await _geolocateBrowser();
      const addr = await _reverseGeocode(latitude, longitude);
      setLocation(addr);
    } catch { /* user denied or unavailable — leave field for manual entry */ }

    setDetecting(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAutoDetect = () => {
    setDetecting(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            setLocation(data.display_name || `Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`);
          } catch {
            setLocation(`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`);
          }
          setDetecting(false);
        },
        () => { setDetecting(false); }   // user denied GPS — leave field for manual entry
      );
    } else {
      setDetecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!photoFile) {
      setSubmitError('Please upload a photo of the animal.');
      return;
    }
    if (!location.trim()) {
      setSubmitError('Please enter a location.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await createPost({ photo: photoFile, location, description });
      const aiAnalysis = response.data?.ai_analysis || null;

      // Fetch nearby NGOs in parallel
      let ngos = [];
      try {
        const ngoRes = await fetchNGOs();
        ngos = ngoRes.data || [];
      } catch { /* no NGOs registered yet */ }

      setReportResult({ analysis: aiAnalysis, post: response.data });
      setNearbyNGOs(ngos);
      setAcceptedNGOs(new Set());
      setSubmitted(true);
      setPreview(null);
      setPhotoFile(null);
      setLocation('');
      setDescription('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to submit report. Please try again.';
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ngo-page">
      <DashboardTopbar
        items={dashboardNavItems}
        activeKey={activeTab}
        onItemClick={(key) => {
          if (key === 'adopt') {
            navigate('/adopt');
            return;
          }
          setActiveTab(key);
        }}
        onLogout={handleLogout}
        initials={initials}
        userTitle={user.name || user.given_name || user.username || ''}
      />

      {/* ── Main content ── */}
      <main className="ngo-main">
        {activeTab === 'my-cases' ? (
          <MyCasesView navigate={navigate} />
        ) : activeTab === 'volunteers' ? (
          <VolunteersView profile={volunteerProfile} onSave={p => { setVolunteerProfile(p); localStorage.setItem('volunteerProfile', JSON.stringify(p)); }} />
        ) : activeTab === 'community' ? (
          <CommunityFeed />
        ) : (<>
        {/* Page heading */}
        <div className="ngo-page-heading">
          <div className="ngo-badge">
            <SparkleIcon /> Emergency Response
          </div>
          <h1 className="ngo-title">Quick Report Form</h1>
          <p className="ngo-subtitle">Fill in the details below to alert our community rescuers. Fast reporting saves lives.</p>
        </div>

        <div className="ngo-content-grid">
          {/* ── Left: Form ── */}
          <div className="ngo-form-col">
            <form className="ngo-form" onSubmit={handleSubmit}>

              {/* Photo upload */}
              <div className="ngo-section-card">
                <div className="ngo-section-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Photo of the Animal
                  <span className="ngo-required-badge">REQUIRED</span>
                </div>
                <div
                  className={`ngo-upload-zone ${dragOver ? 'drag-over' : ''} ${preview ? 'has-preview' : ''}`}
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <img src={preview} alt="Preview" className="ngo-upload-preview" />
                  ) : (
                    <>
                      <UploadIcon />
                      <p className="ngo-upload-title">Click to upload or drag &amp; drop</p>
                      <p className="ngo-upload-sub">Support JPG, PNG or capture directly</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="ngo-section-card">
                <div className="ngo-section-label">
                  <PinIcon /> Accurate Location
                </div>
                <div className="ngo-location-row">
                  <div className="ngo-location-input-wrap">
                    <PinIcon />
                    <input
                      type="text"
                      className="ngo-location-input"
                      placeholder="Enter street name, landmark or area..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <button type="button" className="ngo-autodetect-btn" onClick={handleAutoDetect} disabled={detecting}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                    {detecting ? 'Detecting…' : 'Auto-Detect'}
                  </button>
                </div>
              </div>

              {/* Short description */}
              <div className="ngo-section-card">
                <div className="ngo-section-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  Short Description
                </div>
                <textarea
                  className="ngo-textarea"
                  rows={4}
                  placeholder="E.g., Injured leg, unable to walk, near the blue gate..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Contact info */}
              <div className="ngo-section-card">
                <div className="ngo-section-label-row">
                  <div className="ngo-section-label" style={{ marginBottom: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Contact Info <span style={{ color: '#94a3b8', fontWeight: 400 }}>(Optional)</span>
                  </div>
                  <span className="ngo-private-badge">Private</span>
                </div>
                <div className="ngo-contact-row">
                  <input type="text" className="ngo-contact-input" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                  <input type="tel" className="ngo-contact-input" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <p className="ngo-contact-note">Rescuers may call you for specific location details.</p>
              </div>

              {/* Submit */}
              {submitError && (
                <div className="signin-error" style={{ marginBottom: '10px' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {submitError}
                </div>
              )}
              <button type="submit" className={`ngo-submit-btn ${submitted ? 'submitted' : ''}`} disabled={submitting}>
                {submitted ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Alert Sent Successfully!
                  </>
                ) : submitting ? (
                  'Submitting…'
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    Send Alert Now
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Right: Info panel ── */}
          <div className="ngo-info-col">

            {reportResult ? (
              <>
                {/* Breed Identification Report */}
                <BreedIdentificationReport 
                  analysis={reportResult.analysis}
                  post={reportResult.post}
                />

                {/* Nearby Responders */}
                <div className="nearby-responders">
                  <p className="nearby-responders-heading">Nearby Responders</p>
                  {nearbyNGOs.length === 0 ? (
                    <p className="responders-empty">No responders registered in your area yet.</p>
                  ) : (
                    <div className="responders-grid">
                      {nearbyNGOs.slice(0, 4).map((ngo, idx) => {
                        const impact = getSeverityImpact(reportResult.analysis?.injury_severity, idx);
                        return (
                          <div key={ngo.id} className="responder-card">
                            <p className="responder-name">{ngo.ngo_name}</p>
                            <p className="responder-dist">{MOCK_DISTS[idx] || 'Nearby'}</p>
                            {ngo.email && (
                              <div className="responder-contact-row">
                                <MailIcon /><span>{ngo.email}</span>
                              </div>
                            )}
                            <div className="responder-severity-row">
                              <span className="responder-severity-label">Severity Impact:</span>
                              <span className="responder-severity-val" style={{ color: SEVERITY_TEXT_COLOR[impact] || '#64748b', fontWeight: 600 }}>
                                {impact}
                              </span>
                            </div>
                            <div className="responder-actions">
                              <button className="responder-view-btn">View Details</button>
                              <button
                                className="responder-accept-btn"
                                style={acceptedNGOs.has(ngo.id) ? { background: '#0f766e', cursor: 'default' } : {}}
                                onClick={() => setAcceptedNGOs(prev => new Set([...prev, ngo.id]))}
                                disabled={acceptedNGOs.has(ngo.id)}
                              >
                                {acceptedNGOs.has(ngo.id) ? 'Requested ✓' : 'Accept'}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <button
                    className="responders-report-another"
                    onClick={() => { setReportResult(null); setNearbyNGOs([]); setAcceptedNGOs(new Set()); }}
                  >
                    + Report Another Animal
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Safety tips */}
                <div className="ngo-safety-card">
                  <div className="ngo-safety-heading">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    YOUR SAFETY MATTERS
                  </div>
                  <div className="ngo-safety-list">
                    {safetyTips.map((tip, i) => (
                      <div key={i} className="ngo-safety-item">
                        <span className="ngo-safety-icon">{tip.icon}</span>
                        <p className="ngo-safety-text">{tip.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join network CTA */}
                <div className="ngo-join-card">
                  <h3 className="ngo-join-title">Want to join the network?</h3>
                  <p className="ngo-join-sub">We're always looking for volunteer drivers and first-responders in Mumbai.</p>
                  <button className="ngo-join-btn" onClick={() => navigate('/signup')}>
                    Become a Volunteer
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
        </>)}
      </main>
    </div>
  );
};

const MyCasesView = ({ navigate }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [applied, setApplied] = useState({ status: '', from: '', to: '' });
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    setLoadingReports(true);
    getMyPosts()
      .then(res => setReports(res.data))
      .catch(() => setFetchError('Could not load your reports. Please try again.'))
      .finally(() => setLoadingReports(false));
  }, []);

  const filtered = reports.filter(r => {
    const date = r.created_at ? r.created_at.slice(0, 10) : '';
    if (applied.from && date < applied.from) return false;
    if (applied.to   && date > applied.to)   return false;
    return true;
  });

  return (
    <div className="mc-page">
      <div className="mc-top-row">
        <h1 className="mc-title">My Submitted Reports</h1>
        <button className="mc-new-btn" onClick={() => navigate('/user-dashboard')}>Create New Report</button>
      </div>

      {/* Filters */}
      <div className="mc-filter-card">
        <p className="mc-filter-heading">Filter Reports</p>
        <div className="mc-filter-row">
          <div className="mc-filter-field">
            <label>From Date</label>
            <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
          </div>
          <div className="mc-filter-field">
            <label>To Date</label>
            <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
          </div>
          <button className="mc-apply-btn" onClick={() => setApplied({ status: '', from: fromDate, to: toDate })}>Apply Filters</button>
        </div>
      </div>

      {/* Report rows */}
      <div className="mc-list">
        {loadingReports ? (
          <p className="mc-empty">Loading your reports…</p>
        ) : fetchError ? (
          <p className="mc-empty">{fetchError}</p>
        ) : filtered.length === 0 ? (
          <p className="mc-empty">No reports found. Submit your first report!</p>
        ) : filtered.map(r => (
          <div key={r.id} className="mc-row">
            <div className="mc-row-left">
              <span className="mc-report-id">Report #{r.id}</span>
              {r.photo_url && (
                <img src={r.photo_url} alt="Animal" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              )}
              <span className="mc-animal">{r.description || r.tag_area || 'Stray Animal'}</span>
              <span className="mc-date">{r.created_at ? r.created_at.slice(0, 10) : ''}</span>
            </div>
            <div className="mc-row-right">
              <div className="mc-location">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{r.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════
   VOLUNTEERS VIEW
══════════════════════════════════════ */
const SKILLS = ['Animal First Aid', 'Transportation / Driver', 'Foster Care', 'Trap-Neuter-Return', 'Fundraising', 'Photography / Media', 'Veterinary Support', 'Community Outreach'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const VolunteersView = ({ profile, onSave }) => {
  const empty = { fullName: '', email: '', phone: '', city: '', bio: '', skills: [], availability: [], experience: '', transport: 'no', status: 'active' };
  const [form, setForm] = useState(profile || empty);
  const [editing, setEditing] = useState(!profile);
  const [saved, setSaved] = useState(false);

  const toggle = (field, val) => setForm(f => ({
    ...f,
    [field]: f[field].includes(val) ? f[field].filter(v => v !== val) : [...f[field], val],
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  /* ── Saved profile card ── */
  if (!editing && profile) return (
    <div className="vol-page">
      <div className="vol-top-row">
        <div>
          <h1 className="vol-title">Volunteer Profile</h1>
          <p className="vol-subtitle">You are registered as an active volunteer in the StrayHELP network.</p>
        </div>
        <button className="vol-edit-btn" onClick={() => setEditing(true)}>Edit Profile</button>
      </div>

      {saved && (
        <div className="vol-toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Profile saved successfully!
        </div>
      )}

      {/* Status banner */}
      <div className="vol-status-banner">
        <div className="vol-status-left">
          <div className="vol-status-dot" />
          <div>
            <p className="vol-status-label">Volunteer Status</p>
            <p className="vol-status-val">Active &amp; Available</p>
          </div>
        </div>
        <div className="vol-stat-group">
          <div className="vol-stat"><span className="vol-stat-num">0</span><span className="vol-stat-lbl">Rescues</span></div>
          <div className="vol-stat"><span className="vol-stat-num">0</span><span className="vol-stat-lbl">Hours</span></div>
          <div className="vol-stat"><span className="vol-stat-num">0</span><span className="vol-stat-lbl">Reports</span></div>
        </div>
      </div>

      {/* Info grid */}
      <div className="vol-info-grid">
        <div className="vol-info-card">
          <p className="vol-info-heading">Personal Details</p>
          <div className="vol-info-row"><span className="vol-info-lbl">Full Name</span><span className="vol-info-val">{profile.fullName}</span></div>
          <div className="vol-info-row"><span className="vol-info-lbl">Email</span><span className="vol-info-val">{profile.email}</span></div>
          <div className="vol-info-row"><span className="vol-info-lbl">Phone</span><span className="vol-info-val">{profile.phone}</span></div>
          <div className="vol-info-row"><span className="vol-info-lbl">City</span><span className="vol-info-val">{profile.city}</span></div>
          <div className="vol-info-row"><span className="vol-info-lbl">Has Transport</span><span className="vol-info-val">{profile.transport === 'yes' ? 'Yes' : 'No'}</span></div>
        </div>
        <div className="vol-info-card">
          <p className="vol-info-heading">Skills &amp; Availability</p>
          <div className="vol-chips-wrap">{profile.skills.map(s => <span key={s} className="vol-chip vol-chip-teal">{s}</span>)}</div>
          <p className="vol-info-heading" style={{marginTop:'1rem'}}>Available Days</p>
          <div className="vol-chips-wrap">{profile.availability.map(d => <span key={d} className="vol-chip vol-chip-sky">{d}</span>)}</div>
          {profile.bio && <><p className="vol-info-heading" style={{marginTop:'1rem'}}>About</p><p className="vol-bio-text">{profile.bio}</p></>}
        </div>
      </div>
    </div>
  );

  /* ── Registration / edit form ── */
  return (
    <div className="vol-page">
      <div className="vol-top-row">
        <div>
          <h1 className="vol-title">{profile ? 'Edit Volunteer Profile' : 'Become a Volunteer'}</h1>
          <p className="vol-subtitle">Join the StrayHELP rescue network and make a real difference in your community.</p>
        </div>
        {profile && <button className="vol-cancel-btn" onClick={() => setEditing(false)}>Cancel</button>}
      </div>

      <form className="vol-form" onSubmit={handleSubmit}>

        {/* Personal info */}
        <div className="vol-section-card">
          <p className="vol-section-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Personal Information
          </p>
          <div className="vol-field-grid">
            <div className="vol-field">
              <label>Full Name <span className="vol-req">*</span></label>
              <input required placeholder="Jane Doe" value={form.fullName} onChange={e => setForm(f=>({...f,fullName:e.target.value}))} />
            </div>
            <div className="vol-field">
              <label>Email Address <span className="vol-req">*</span></label>
              <input required type="email" placeholder="jane@example.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div className="vol-field">
              <label>Phone Number <span className="vol-req">*</span></label>
              <input required type="tel" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} />
            </div>
            <div className="vol-field">
              <label>City / Area <span className="vol-req">*</span></label>
              <input required placeholder="Mumbai" value={form.city} onChange={e => setForm(f=>({...f,city:e.target.value}))} />
            </div>
          </div>
          <div className="vol-field vol-field-full">
            <label>Brief Bio <span className="vol-optional">(optional)</span></label>
            <textarea rows={3} placeholder="Tell us a little about yourself and why you want to volunteer..." value={form.bio} onChange={e => setForm(f=>({...f,bio:e.target.value}))} />
          </div>
        </div>

        {/* Skills */}
        <div className="vol-section-card">
          <p className="vol-section-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Skills &amp; Expertise
          </p>
          <p className="vol-section-sub">Select all that apply</p>
          <div className="vol-toggle-grid">
            {SKILLS.map(s => (
              <button type="button" key={s} className={`vol-toggle-btn ${form.skills.includes(s) ? 'selected' : ''}`} onClick={() => toggle('skills', s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="vol-section-card">
          <p className="vol-section-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Availability
          </p>
          <p className="vol-section-sub">Which days can you respond to calls?</p>
          <div className="vol-toggle-grid">
            {DAYS.map(d => (
              <button type="button" key={d} className={`vol-toggle-btn ${form.availability.includes(d) ? 'selected' : ''}`} onClick={() => toggle('availability', d)}>{d}</button>
            ))}
          </div>
        </div>

        {/* Experience & transport */}
        <div className="vol-section-card">
          <p className="vol-section-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Additional Details
          </p>
          <div className="vol-field-grid">
            <div className="vol-field">
              <label>Prior Volunteer Experience</label>
              <select value={form.experience} onChange={e => setForm(f=>({...f,experience:e.target.value}))}>
                <option value="">Select experience level</option>
                <option value="none">No prior experience</option>
                <option value="some">Some experience (1-2 years)</option>
                <option value="experienced">Experienced (3+ years)</option>
                <option value="professional">Professional / Vet background</option>
              </select>
            </div>
            <div className="vol-field">
              <label>Do you have personal transport?</label>
              <select value={form.transport} onChange={e => setForm(f=>({...f,transport:e.target.value}))}>
                <option value="yes">Yes — I can transport animals</option>
                <option value="no">No personal transport</option>
                <option value="sometimes">Sometimes available</option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="vol-submit-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          {profile ? 'Save Changes' : 'Register as Volunteer'}
        </button>
      </form>
    </div>
  );
};

export default UserDashboard;
