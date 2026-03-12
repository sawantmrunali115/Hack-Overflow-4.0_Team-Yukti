import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth, loginUser, saveSession } from '../api/auth';

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.86l6.08-6.08C34.46 3.05 29.5 1 24 1 14.82 1 6.99 6.48 3.44 14.22l7.08 5.5C12.28 13.36 17.68 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.7c-.55 2.94-2.2 5.43-4.67 7.1l7.17 5.57C43.36 37.27 46.5 31.33 46.5 24.5z"/>
    <path fill="#FBBC05" d="M10.52 28.72A14.6 14.6 0 0 1 9.5 24c0-1.64.28-3.22.78-4.72l-7.08-5.5A23.94 23.94 0 0 0 1 24c0 3.87.92 7.53 2.54 10.77l6.98-6.05z"/>
    <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.93l-7.17-5.57c-1.82 1.22-4.15 1.95-6.33 1.95-6.32 0-11.72-3.86-13.48-9.73l-6.98 6.05C6.99 41.52 14.82 47 24 47z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email / password / role form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role, setRole] = useState('');

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        // Send the Google access token to our backend to get JWTs
        const response = await googleAuth(tokenResponse.access_token);
        const data = response.data;
        saveSession(data);
        setUser({
          name: `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.username,
          given_name: data.user.first_name || data.user.username,
          email: data.user.email,
          picture: data.picture || '',
        });
        const dest = data.is_ngo ? '/ngo-dashboard' : '/user-dashboard';
        setTimeout(() => navigate(dest), 1600);
      } catch (e) {
        const msg = e.response?.data?.detail || 'Sign-in failed. Please try again.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in failed. Please try again.'),
  });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!role) { setError('Please select your role.'); return; }
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(email, password);
      const data = response.data;
      saveSession(data);
      setUser({
        name: `${data.user.first_name} ${data.user.last_name}`.trim() || data.user.username,
        given_name: data.user.first_name || data.user.username,
        email: data.user.email,
        picture: '',
      });
      // Prefer server-side is_ngo flag; fall back to the role the user selected
      const dest = (data.is_ngo || role === 'ngo') ? '/ngo-dashboard' : '/user-dashboard';
      setTimeout(() => navigate(dest), 1600);
    } catch (e) {
      const msg = e.response?.data?.detail || 'Invalid email or password.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      {/* ── Left: Dog image panel ── */}
      <div className="signin-left">
        <div className="signin-left-overlay" />
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&auto=format&fit=crop&q=80"
          alt="Happy dog"
          className="signin-left-img"
        />
        <div className="signin-left-content">
          <h2 className="signin-left-heading">
            Every stray deserves<br />a second chance.
          </h2>
          <p className="signin-left-sub">
            Together we've rescued 8,420+ animals across 50+ cities.
          </p>
        </div>
      </div>

      {/* ── Right: Sign-in panel ── */}
      <div className="signin-right">
        {/* Animated blobs */}
        <div className="signin-blob signin-blob-1" />
        <div className="signin-blob signin-blob-2" />

        <div className="signin-card">
          {user ? (
            /* ── Success state ── */
            <div className="signin-success">
              <div className="signin-success-ring">
                <img src={user.picture} alt={user.name} className="signin-success-avatar" />
              </div>
              <svg className="signin-success-check" viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="25" stroke="#0d9488" strokeWidth="2"/>
                <polyline points="14,27 22,35 38,18" stroke="#0d9488" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="signin-success-name">Hey, {user.given_name}! 👋</h2>
              <p className="signin-success-email">{user.email}</p>
              <div className="signin-success-bar">
                <div className="signin-success-bar-fill" />
              </div>
              <p className="signin-success-msg">Taking you back to StrayHELP…</p>
            </div>
          ) : (
            /* ── Sign-in state ── */
            <>
              <Link to="/" className="signin-back">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to home
              </Link>

              <div className="signin-logo-wrap">
                <div className="signin-logo-icon">
                  <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="18" r="18" fill="white" fillOpacity="0.2"/>
                    <svg x="8" y="8" width="20" height="20" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="white"/>
                    </svg>
                  </svg>
                </div>
                <span className="signin-logo-text">StrayHELP</span>
              </div>

              <div className="signin-headline">
                <h1 className="signin-title">Welcome back</h1>
                <p className="signin-subtitle">
                  Sign in to continue your mission of helping stray animals.
                </p>
              </div>

              <button
                className="signin-google-btn"
                onClick={() => login()}
                disabled={loading}
              >
                {loading ? <span className="signin-spinner" /> : <GoogleIcon />}
                <span>{loading ? 'Signing in…' : 'Continue with Google'}</span>
              </button>

              {/* ── Divider ── */}
              <div className="signin-or-divider">
                <span className="signin-or-line" />
                <span className="signin-or-text">or sign in with email</span>
                <span className="signin-or-line" />
              </div>

              {/* ── Email / Password / Role form ── */}
              <form className="signin-email-form" onSubmit={handleEmailLogin}>
                {/* Email */}
                <div className="signin-field">
                  <label className="signin-field-label">Email Address</label>
                  <div className="signin-input-wrap">
                    <svg className="signin-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                    <input
                      type="email"
                      className="signin-text-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="signin-field">
                  <label className="signin-field-label">Password</label>
                  <div className="signin-input-wrap">
                    <svg className="signin-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className="signin-text-input"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => { setPassword(e.target.value); setError(''); }}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="signin-eye-btn"
                      onClick={() => setShowPass(p => !p)}
                      tabIndex={-1}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="signin-field">
                  <label className="signin-field-label">Sign in as</label>
                  <div className="signin-input-wrap">
                    <svg className="signin-input-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <select
                      className="signin-text-input signin-select"
                      value={role}
                      onChange={e => { setRole(e.target.value); setError(''); }}
                      required
                    >
                      <option value="">Select your role…</option>
                      <option value="reporter">Community Reporter</option>
                      <option value="ngo">NGO / Rescue Organisation</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                    <svg className="signin-select-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {error && (
                  <div className="signin-error">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {error}
                  </div>
                )}

                <button type="submit" className="signin-submit-btn" disabled={loading}>
                  {loading ? (
                    <><span className="signin-spinner" />Signing in…</>
                  ) : (
                    <>Sign In →</>
                  )}
                </button>
              </form>

              <p className="signin-footer">
                New to StrayHELP?{' '}
                <Link to="/signup" className="signin-footer-link">Create a free account →</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
