import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <footer style={{
      backgroundColor: '#0A0A0C',
      borderTop: '1px solid var(--color-border)',
      padding: '5rem 2rem 2rem 2rem',
      marginTop: 'auto',
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '3rem',
        marginBottom: '4rem',
      }}>
        {/* Brand Newsletter Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.15em' }}>HAPPY STORE</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
            Join our mailing list to receive release notifications, private collections, and membership benefits.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '0.5rem',
          }}>
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS"
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                width: '100%',
                padding: '0.25rem 0',
                letterSpacing: '0.05em',
                color: '#fff',
              }}
            />
            <button style={{ padding: '0.25rem' }}>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Customer Support Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Customer Care</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            <li><Link to="/checkout">Checkout & Orders</Link></li>
            <li><a href="#shipping">Shipping & Returns</a></li>
            <li><a href="#size-guide">Size Guides</a></li>
            <li><a href="#contact">Contact Support</a></li>
            <li><a href="#store-locator">Store Locator</a></li>
          </ul>
        </div>

        {/* Categories Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Shop</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            <li><Link to="/men">Men's Apparel</Link></li>
            <li><Link to="/women">Women's Apparel</Link></li>
            <li><Link to="/kids">Kids Collection</Link></li>
            <li><Link to="/sneakers">Sneakers & Kicks</Link></li>
            <li><Link to="/men?subcategory=Accessories">Streetwear Accessories</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Company</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
            <li><a href="#about">Our Story</a></li>
            <li><a href="#sustainability">Sustainability</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{
        borderTop: '1px solid var(--color-border)',
        paddingTop: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem',
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 500 }}>
          © {new Date().getFullYear()} HAPPY STORE. ALL RIGHTS RESERVED.
        </span>

        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--color-secondary)' }}>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="glow-hover" style={{ padding: '0.2rem' }}>
            <InstagramIcon />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="glow-hover" style={{ padding: '0.2rem' }}>
            <TwitterIcon />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" className="glow-hover" style={{ padding: '0.2rem' }}>
            <FacebookIcon />
          </a>
          <a href="mailto:support@happystore.com" className="glow-hover" style={{ padding: '0.2rem' }}>
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
