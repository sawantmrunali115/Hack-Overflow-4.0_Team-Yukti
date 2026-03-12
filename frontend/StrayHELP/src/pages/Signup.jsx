import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, saveSession } from '../api/auth';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '', city: '', role: '', password: '', confirm: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await registerUser(form);
      saveSession(response.data);
      if (form.role === 'NGO / Organization') {
        navigate('/ngo-dashboard');
      } else {
        navigate('/user-dashboard');
      }
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const messages = Object.values(data).flat().join(' ');
        setError(messages || 'Registration failed. Please try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      {/* ── Left: image panel ── */}
      <div className="signin-left">
        <div className="signin-left-overlay" />
        <img
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&auto=format&fit=crop&q=80"
          alt="Dogs running"
          className="signin-left-img"
        />
        <div className="signin-left-content">
          <h2 className="signin-left-heading">
            Join thousands helping<br />stray animals thrive.
          </h2>
          <p className="signin-left-sub">
            Report, rescue, and adopt — make a real impact across 50+ cities.
          </p>
        </div>
      </div>

      {/* ── Right: sign-up panel ── */}
      <div className="signin-right signup-right">
        <div className="signin-blob signin-blob-1" />
        <div className="signin-blob signin-blob-2" />

        <div className="signin-card signup-card">
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
            <h1 className="signin-title">Create account</h1>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-row">
              <div className="signup-field">
                <label>First Name</label>
                <input type="text" name="firstName" placeholder="Priya" value={form.firstName} onChange={handleChange} required />
              </div>
              <div className="signup-field">
                <label>Last Name</label>
                <input type="text" name="lastName" placeholder="Sharma" value={form.lastName} onChange={handleChange} required />
              </div>
            </div>

            <div className="signup-field">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@email.com" value={form.email} onChange={handleChange} required />
            </div>

            <div className="signup-row">
              <div className="signup-field">
                <label>Phone</label>
                <input type="tel" name="phone" placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} />
              </div>
              <div className="signup-field">
                <label>City</label>
                <input type="text" name="city" placeholder="Mumbai" value={form.city} onChange={handleChange} required />
              </div>
            </div>

            <div className="signup-field">
              <label>I want to join as</label>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">Select a role</option>
                <option>Rescue Volunteer</option>
                <option>Animal Adopter</option>
                <option>NGO / Organization</option>
                <option>Veterinarian</option>
                <option>Community Reporter</option>
              </select>
            </div>

            <div className="signup-row">
              <div className="signup-field">
                <label>Password</label>
                <div className="signup-pass-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button type="button" className="signup-eye-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div className="signup-field">
                <label>Confirm Password</label>
                <input type="password" name="confirm" placeholder="Re-enter password" value={form.confirm} onChange={handleChange} required />
              </div>
            </div>

            <button type="submit" className="signup-submit-btn" disabled={loading}>
              {loading ? 'Creating Account…' : 'Create Account'}
            </button>
            {error && (
              <div className="signin-error" style={{ marginTop: '12px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
          </form>

          <div className="signin-divider" />

          <p className="signin-footer">
            Already have an account?{' '}
            <Link to="/login" className="signin-footer-link">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
