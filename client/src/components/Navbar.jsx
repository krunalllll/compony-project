import React, { useState, useEffect } from 'react';
import { Menu, Search, User, Heart, ShoppingBag, X, Globe, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';
import CartDrawer from './CartDrawer';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

const ANNOUNCEMENTS = [
  '⚡ COMPLIMENTARY EXPRESS DISPATCH ON ORDERS OVER $150',
  '🔥 DROP 04 ARCHIVE NOW AVAILABLE // EXCLUSIVE ACCESS',
  '💎 REDEEM CODE "HAPPY20" FOR 20% OFF FIRST PURCHASE',
  '⭐ 4.9/5 RATED BY 15,000+ DISCERNING CLIENTS WORLDWIDE',
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { currency, setCurrency, currencies } = useCurrency();
  const { addToast } = useToast();
  const { toggleTheme, isDark } = useTheme();

  const [isTopBarOpen, setIsTopBarOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.products);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  // Rotate announcement messages
  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut: Ctrl + K or '/' to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen for open-cart-drawer custom event
  useEffect(() => {
    const handleOpenCart = () => setIsCartOpen(true);
    window.addEventListener('open-cart-drawer', handleOpenCart);
    return () => window.removeEventListener('open-cart-drawer', handleOpenCart);
  }, []);

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/profile');
    }
  };

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* INTERACTIVE TOP BAR */}
        {isTopBarOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-bg-alt)',
              fontSize: '0.68rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '0.45rem 1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--color-border)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'background-color var(--transition-smooth)',
            }}
          >
            {/* Interactive Currency Selector */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsCurrencyMenuOpen(!isCurrencyMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'inherit',
                  opacity: 0.85,
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
                title="Select Currency"
              >
                <Globe size={12} />
                <span>{currency}</span>
                <ChevronDown size={11} />
              </button>

              {/* Currency Dropdown Menu */}
              <AnimatePresence>
                {isCurrencyMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '8px',
                      backgroundColor: 'var(--color-bg-alt)',
                      border: '1px solid var(--color-border)',
                      boxShadow: 'var(--shadow-premium)',
                      zIndex: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '120px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    {Object.keys(currencies).map((code) => (
                      <button
                        key={code}
                        onClick={() => {
                          setCurrency(code);
                          setIsCurrencyMenuOpen(false);
                          addToast({
                            title: 'Currency Updated',
                            message: `Prices are now displayed in ${currencies[code].label}`,
                            type: 'info',
                          });
                        }}
                        style={{
                          padding: '0.6rem 0.9rem',
                          textAlign: 'left',
                          fontSize: '0.72rem',
                          fontWeight: currency === code ? 800 : 500,
                          color: currency === code ? 'var(--color-primary)' : 'var(--color-secondary)',
                          backgroundColor: currency === code ? 'var(--color-surface)' : 'transparent',
                          cursor: 'pointer',
                        }}
                      >
                        {currencies[code].label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Rotating Top Announcements with AnimatePresence */}
            <div style={{ flex: 1, textAlign: 'center', overflow: 'hidden', height: '18px', position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={announcementIdx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    width: '100%',
                    top: 0,
                    left: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{ANNOUNCEMENTS[announcementIdx]}</span>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right side controls: Theme Toggle + Close Top Bar button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'inherit',
                  opacity: 0.85,
                  cursor: 'pointer',
                  padding: '2px 4px',
                }}
              >
                {isDark ? <Sun size={13} /> : <Moon size={13} />}
                <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{isDark ? 'LIGHT' : 'DARK'}</span>
              </button>

              <button
                onClick={() => setIsTopBarOpen(false)}
                style={{ padding: '0.2rem', display: 'flex', alignItems: 'center', color: 'inherit', opacity: 0.75, cursor: 'pointer' }}
                title="Dismiss announcement bar"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* MAIN HEADER */}
        <div
          className="glass"
          style={{
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)',
            backgroundColor: 'var(--glass-bg)',
          }}
        >
          {/* LEFT: Hamburger menu + Desktop Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1.5 }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                color: 'var(--color-primary)',
                cursor: 'pointer',
              }}
              title="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
              {[
                { name: 'MEN', path: '/men' },
                { name: 'WOMEN', path: '/women' },
                { name: 'KIDS', path: '/kids' },
                { name: 'SNEAKERS', path: '/sneakers' },
              ].map((item) => {
                const isActive = (item.path === '/men' && currentPath.startsWith('/men')) ||
                                 (item.path === '/women' && currentPath.startsWith('/women')) ||
                                 (item.path === '/kids' && currentPath.startsWith('/kids')) ||
                                 (item.path === '/sneakers' && currentPath.startsWith('/sneakers'));

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: isActive ? 'var(--color-primary)' : 'var(--color-secondary)',
                      position: 'relative',
                      padding: '0.5rem 0',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNavIndicator"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          backgroundColor: 'var(--color-primary)',
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CENTER: Interactive Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Link
              to="/"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.45rem',
                fontWeight: 900,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              HAPPY STORE
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.6rem', flex: 1.5 }}>
            
            {/* Integrated Search Box (Desktop) with Ctrl+K shortcut badge */}
            <div
              onClick={() => setIsSearchOpen(true)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'var(--color-surface)',
                borderRadius: '20px',
                padding: '0.45rem 1rem',
                border: '1px solid var(--color-border)',
                width: '220px',
                marginRight: '0.5rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              className="navbar-search-box glow-hover"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search size={14} style={{ color: 'var(--color-secondary)' }} />
                <span style={{ color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
                  Search catalog...
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  backgroundColor: 'var(--color-bg-alt)',
                  color: 'var(--color-secondary)',
                  padding: '2px 5px',
                  borderRadius: '3px',
                  border: '1px solid var(--color-border)',
                }}
              >
                ⌘K
              </span>
            </div>

            {/* Search Icon Button (Mobile Only) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="navbar-search-icon-btn"
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)' }}
              title="Search"
            >
              <Search size={20} />
            </button>

            {/* Profile */}
            <button
              onClick={handleProfileClick}
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', color: 'var(--color-primary)', position: 'relative' }}
              title={isAuthenticated ? `Profile (${user?.name})` : "Login / Register"}
            >
              <User size={20} />
              {isAuthenticated && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                  }}
                />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/profile?tab=wishlist')}
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative', color: 'var(--color-primary)' }}
              title="View Wishlist"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <motion.span
                  key={wishlistCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: '#E11D48',
                    color: 'white',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Bag / Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative', color: 'var(--color-primary)' }}
              title="View Bag"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-bg-alt)',
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push dynamic layouts below navbar */}
      <div style={{ height: isTopBarOpen ? '106px' : '72px', transition: 'height 0.2s ease' }} />

      <MegaMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
