import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, ChevronUp, LogOut, ShieldCheck, HelpCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [accordionOpen, setAccordionOpen] = useState(null);

  const toggleAccordion = (section) => {
    if (accordionOpen === section) {
      setAccordionOpen(null);
    } else {
      setAccordionOpen(section);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
    navigate('/');
  };

  const handleLinkClick = () => {
    onClose();
  };

  const currentCategory = (currentPath.startsWith('/women')) ? 'women' : (currentPath.startsWith('/sneakers')) ? 'sneakers' : 'men';

  const shopAllCategories = {
    TOPWEAR: [
      { name: 'T Shirts', path: `/${currentCategory}?subcategory=T%20Shirts` },
      { name: 'Shirts', path: `/${currentCategory}?subcategory=Shirts` },
      { name: 'Polos', path: `/${currentCategory}?subcategory=Polos` },
      { name: 'Hoodies', path: `/${currentCategory}?subcategory=Hoodies` },
      { name: 'Jackets', path: `/${currentCategory}?subcategory=Jackets` },
    ],
    BOTTOMWEAR: [
      { name: 'Jeans', path: `/${currentCategory}?subcategory=Jeans` },
      { name: 'Cargo', path: `/${currentCategory}?subcategory=Cargo` },
      { name: 'Joggers', path: `/${currentCategory}?subcategory=Joggers` },
      { name: 'Shorts', path: `/${currentCategory}?subcategory=Shorts` },
    ],
    FOOTWEAR: [
      { name: 'Sneakers', path: '/sneakers' },
      { name: 'Slides', path: `/sneakers?subcategory=Slides` },
    ],
    ACCESSORIES: [
      { name: 'Caps', path: `/${currentCategory}?subcategory=Caps` },
      { name: 'Bags', path: `/${currentCategory}?subcategory=Bags` },
      { name: 'Socks', path: `/${currentCategory}?subcategory=Socks` },
      { name: 'Watches', path: `/${currentCategory}?subcategory=Watches` },
    ],
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(5px)',
              zIndex: 1050,
            }}
          />

          {/* Sliding Drawer Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '380px',
              backgroundColor: 'var(--color-bg-alt)',
              borderRight: '1px solid var(--color-border)',
              zIndex: 1100,
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.1em', fontSize: '1.25rem' }}>HAPPY STORE</span>
              <button onClick={onClose} style={{ padding: '0.5rem', color: 'var(--color-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Profile Panel */}
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)' }}>
              {isAuthenticated && user ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img
                      src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
                      alt={user.name}
                      style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.05em' }}>{user.name.toUpperCase()}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
                        <span className="badge-member">BLACK CARD</span>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(212, 175, 55, 0.06)',
                    border: '1px solid rgba(212, 175, 55, 0.15)',
                    padding: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <ShieldCheck size={14} style={{ color: 'var(--color-gold)' }} />
                    <span style={{ color: 'var(--color-gold)', letterSpacing: '0.05em' }}>VIP PRICE MEMBERSHIP ACTIVE</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%' }}>
                    {user.role === 'admin' && (
                      <Link to="/admin-dashboard" onClick={handleLinkClick} className="btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', flex: 1, color: '#fff', textTransform: 'uppercase', fontWeight: 800, textAlign: 'center' }}>
                        Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', flex: user.role === 'admin' ? 0.5 : 1, textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      <LogOut size={14} /> LOGOUT
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginBottom: '1.25rem', fontWeight: 600, letterSpacing: '0.03em', lineHeight: 1.4 }}>
                    LOG IN TO EXPERIENCE EXCLUSIVE PRICING AND ACCESS RECENT WISHLISTS.
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/login" onClick={handleLinkClick} className="btn-primary" style={{ flex: 1, padding: '0.7rem 0', fontSize: '0.7rem' }}>
                      LOGIN
                    </Link>
                    <Link to="/signup" onClick={handleLinkClick} className="btn-secondary" style={{ flex: 1, padding: '0.7rem 0', fontSize: '0.7rem' }}>
                      SIGN UP
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Main Pages: Horizontal Navigation inside Sidebar */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--color-border)',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}>
              {['MEN', 'WOMEN', 'SNEAKERS'].map((cat) => {
                const catPath = cat === 'SNEAKERS' ? '/sneakers' : `/${cat.toLowerCase()}`;
                const isActive = (catPath === '/men' && (currentPath === '/' || currentPath.startsWith('/men'))) ||
                                 (catPath === '/women' && currentPath.startsWith('/women')) ||
                                 (catPath === '/sneakers' && currentPath.startsWith('/sneakers'));
                return (
                  <Link
                    key={cat}
                    to={catPath}
                    onClick={handleLinkClick}
                    style={{
                      flex: 1,
                      padding: '1.2rem 0',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      color: isActive ? 'var(--color-accent)' : 'var(--color-secondary)',
                      borderBottom: isActive ? '3px solid var(--color-accent)' : 'none',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            {/* Accordion Menu */}
            <div style={{ borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
              <div style={{ padding: '0.5rem 1.5rem 0.75rem 1.5rem', fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>
                SHOP ALL CATEGORIES
              </div>

              {Object.keys(shopAllCategories).map((section) => (
                <div key={section} style={{ display: 'flex', flexDirection: 'column' }}>
                  <button
                    onClick={() => toggleAccordion(section)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.85rem 1.5rem',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <span>{section}</span>
                    {accordionOpen === section ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  <AnimatePresence>
                    {accordionOpen === section && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}
                      >
                        <div style={{ padding: '0.5rem 1.5rem 1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {shopAllCategories[section].map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              onClick={handleLinkClick}
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--color-secondary)',
                                padding: '0.2rem 0',
                                fontWeight: 600,
                              }}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Additional Sections */}
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {['NEW ARRIVALS', 'TRENDING NOW', 'STREETWEAR MEMBERSHIP', 'GIFT CARDS'].map((linkText) => (
                <Link
                  key={linkText}
                  to="/men"
                  onClick={handleLinkClick}
                  style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-secondary)', letterSpacing: '0.05em' }}
                >
                  {linkText}
                </Link>
              ))}
            </div>

            {/* Drawer Footer */}
            <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.75rem' }}>
              <HelpCircle size={14} />
              <span>Need help? Contact support 24/7</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
