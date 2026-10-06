import React, { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Footer = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
    addToast({
      title: 'Welcome to Apex Circle!',
      message: 'Use code WELCOME15 for 15% off your first purchase',
      type: 'success',
    });
  };

  return (
    <footer
      style={{
        backgroundColor: '#0A0A0C',
        color: '#FFFFFF',
        borderTop: '1px solid var(--color-border)',
        padding: '5rem 2rem 2rem 2rem',
        marginTop: 'auto',
      }}
    >
      <div
        className="container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem',
        }}
      >
        {/* Brand Newsletter Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.35rem', letterSpacing: '0.15em' }}>
            HAPPY STORE
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
            Join our private drop notification system to receive exclusive drop links, private collections, and membership benefits.
          </p>

          {submitted ? (
            <div
              style={{
                padding: '0.85rem 1rem',
                backgroundColor: 'rgba(52, 199, 89, 0.1)',
                border: '1px solid #34C759',
                color: '#34C759',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Check size={16} />
              <span>Voucher Unlocked: <strong>WELCOME15</strong> (15% OFF)</span>
            </div>
          ) : (
            <form
              onSubmit={handleNewsletter}
              style={{
                display: 'flex',
                alignItems: 'center',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '0.5rem',
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER EMAIL FOR 15% VOUCHER"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  width: '100%',
                  padding: '0.25rem 0',
                  letterSpacing: '0.05em',
                  color: '#fff',
                  outline: 'none',
                }}
              />
              <button type="submit" style={{ padding: '0.25rem', color: '#FFF', cursor: 'pointer' }} title="Subscribe">
                <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>

        {/* Customer Support Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Customer Care
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            <li><Link to="/profile?tab=orders" style={{ transition: 'color 0.2s' }}>Orders & Tracking</Link></li>
            <li><Link to="/men" style={{ transition: 'color 0.2s' }}>Shipping & Dispatch</Link></li>
            <li><Link to="/men" style={{ transition: 'color 0.2s' }}>Returns & Exchanges</Link></li>
            <li><a href="mailto:support@happystore.com" style={{ transition: 'color 0.2s' }}>24/7 Concierge Support</a></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Shop Collections
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            <li><Link to="/men" style={{ transition: 'color 0.2s' }}>Men's Oversized Essentials</Link></li>
            <li><Link to="/women" style={{ transition: 'color 0.2s' }}>Women's Techwear</Link></li>
            <li><Link to="/sneakers" style={{ transition: 'color 0.2s' }}>Platform Sneakers & Slides</Link></li>
            <li><Link to="/kids" style={{ transition: 'color 0.2s' }}>Kids Streetwear Sets</Link></li>
          </ul>
        </div>

        {/* Company Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Apex Collective
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            <li><Link to="/signup" style={{ color: 'var(--color-gold)', fontWeight: 800 }}>Join Black Card VIP</Link></li>
            <li><a href="#about" style={{ transition: 'color 0.2s' }}>Our Craft & Heritage</a></li>
            <li><a href="#sustainability" style={{ transition: 'color 0.2s' }}>Organic Cotton Standards</a></li>
            <li><a href="#terms" style={{ transition: 'color 0.2s' }}>Terms & Authenticity Guarantee</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 500 }}>
          © {new Date().getFullYear()} HAPPY STORE. ALL RIGHTS RESERVED.
        </span>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--color-secondary)' }}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="glow-hover" style={{ padding: '0.2rem', color: '#FFF' }}>
            <InstagramIcon />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="glow-hover" style={{ padding: '0.2rem', color: '#FFF' }}>
            <TwitterIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="glow-hover" style={{ padding: '0.2rem', color: '#FFF' }}>
            <FacebookIcon />
          </a>
          <a href="mailto:support@happystore.com" className="glow-hover" style={{ padding: '0.2rem', color: '#FFF' }}>
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
