import React, { useState } from 'react';
import { Menu, Search, User, Heart, ShoppingBag, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import MegaMenu from './MegaMenu';
import SearchBar from './SearchBar';
import CartDrawer from './CartDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentPath = location.pathname;

  const [isTopBarOpen, setIsTopBarOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.products);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (user?.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      if (window.confirm('LOG OUT OF MEMBERSHIP CIRCLE?')) {
        dispatch(logoutUser());
        navigate('/');
      }
    }
  };

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* TOP BAR */}
        {isTopBarOpen && (
          <div style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
            padding: '0.5rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--color-border)',
          }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              NOW SHOPPING AT MEMBERSHIP PRICES
            </div>
            <button onClick={() => setIsTopBarOpen(false)} style={{ padding: '0.2rem', display: 'flex', alignItems: 'center' }}>
              <X size={14} />
            </button>
          </div>
        )}

        {/* MAIN HEADER */}
        <div className="glass" style={{
          padding: '1.1rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--glass-border)',
        }}>
          {/* LEFT: Hamburger menu + Navigation Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1.5 }}>
            <button onClick={() => setIsSidebarOpen(true)} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <Menu size={24} />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              {[
                { name: 'MEN', path: '/men' },
                { name: 'WOMEN', path: '/women' },
                { name: 'SNEAKERS', path: '/sneakers' }
              ].map((item) => {
                const isActive = (item.path === '/men' && (currentPath === '/' || currentPath.startsWith('/men'))) ||
                                 (item.path === '/women' && currentPath.startsWith('/women')) ||
                                 (item.path === '/sneakers' && currentPath.startsWith('/sneakers'));

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      letterSpacing: '0.1em',
                      color: isActive ? '#FFFFFF' : 'var(--color-secondary)',
                      position: 'relative',
                      padding: '0.5rem 0',
                      transition: 'color var(--transition-fast)',
                    }}
                  >
                    {item.name}
                    {isActive && (
                      <span style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--color-accent)',
                      }} />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CENTER: Logo */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Link to="/" style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--color-primary)',
            }}>
              HAPPY STORE
            </Link>
          </div>

          {/* RIGHT: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem', flex: 1.5 }}>
            {/* Integrated Search Input Box (Desktop) */}
            <div 
              onClick={() => setIsSearchOpen(true)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '20px',
                padding: '0.45rem 1rem',
                border: '1px solid var(--color-border)',
                width: '240px',
                marginRight: '0.5rem',
                cursor: 'pointer',
                transition: 'border-color var(--transition-fast)',
              }}
              className="navbar-search-box"
            >
              <input
                type="text"
                placeholder="What are you looking for?"
                readOnly
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#fff',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  width: '100%',
                  cursor: 'pointer',
                  pointerEvents: 'none',
                }}
              />
              <Search size={15} style={{ color: 'var(--color-secondary)' }} />
            </div>

            {/* Search Icon Button (Mobile Only) */}
            <button 
              onClick={() => setIsSearchOpen(true)} 
              className="navbar-search-icon-btn" 
              style={{ padding: '0.5rem', alignItems: 'center' }}
            >
              <Search size={20} />
            </button>

            {/* Profile */}
            <button onClick={handleProfileClick} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
              <User size={20} />
            </button>

            {/* Wishlist */}
            <button onClick={() => navigate(isAuthenticated ? '/checkout?tab=wishlist' : '/login')} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: 'var(--color-accent)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button onClick={() => setIsCartOpen(true)} style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#000',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  fontSize: '0.6rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {cartCount}
                </span>
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
