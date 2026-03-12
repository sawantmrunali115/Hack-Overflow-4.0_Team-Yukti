import React from 'react';

const FOOTER_LINKS = [
  {
    heading: 'Platform',
    links: ['Report an Animal', 'Track a Case', 'Adopt a Pet', 'Vet Directory', 'Volunteer Hub'],
  },
  {
    heading: 'Organization',
    links: ['About Us', 'Our Mission', 'Partners', 'Press Kit', 'Careers'],
  },
  {
    heading: 'Support',
    links: ['Help Centre', 'Contact Us', 'Community Forum', 'Donate', 'Privacy Policy'],
  },
];

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      {/* Brand column */}
      <div className="footer-brand">
        <div className="footer-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>StrayHELP</span>
        </div>
        <p className="footer-tagline">
          A community-powered platform connecting compassionate people with stray animals in need — across India.
        </p>
        <div className="footer-socials">
          {/* Twitter/X */}
          <a href="#" className="footer-social-link" aria-label="Twitter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="footer-social-link" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="footer-social-link" aria-label="LinkedIn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
          {/* YouTube */}
          <a href="#" className="footer-social-link" aria-label="YouTube">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
            </svg>
          </a>
        </div>
      </div>

      {/* Link columns */}
      {FOOTER_LINKS.map((col) => (
        <div className="footer-col" key={col.heading}>
          <h4 className="footer-col-heading">{col.heading}</h4>
          <ul className="footer-col-links">
            {col.links.map((link) => (
              <li key={link}><a href="#" className="footer-link">{link}</a></li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} StrayHELP. Built with compassion for strays across India.</p>
      <p>Made for HackOverflow 4.0</p>
    </div>
  </footer>
);

export default Footer;
