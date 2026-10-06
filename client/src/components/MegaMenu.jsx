import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, HelpCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';

// Subcomponents
import CategoryTabs from './CategoryTabs';
import ImageCarousel from './ImageCarousel';
import CategoryCard from './CategoryCard';
import MenuAccordion from './MenuAccordion';

const PlayStoreIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M5.25 2.25c-.2 0-.39.04-.56.12l12.44 12.44 2.62-2.62c.49-.49.49-1.28 0-1.77L6.25 2.62a1.24 1.24 0 0 0-1-.37zM4 3.75v16.5c0 .28.09.53.25.75L13.5 12 4 2.5c-.16.22-.25.47-.25.75zM14.56 13.06l-2.62 2.62 6.81 6.81c.36.36.85.56 1.37.56.2 0 .39-.04.56-.12L14.56 13.06zM6.25 21.38c.36.09.74.04 1.06-.12l13.5-7.75c.49-.28.75-.78.75-1.31L7.31 21.5c-.32.16-.7.21-1.06.12v-.24z"/>
  </svg>
);

const AppStoreIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93 0.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
  </svg>
);

// Static Menu Data Structure
const menuData = {
  MEN: {
    cards: [
      { title: "Anime", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Anime" },
      { title: "Vikings", image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Vikings" },
      { title: "Hot Merch", image: "https://images.unsplash.com/photo-1566207274740-0f8cf6b7d5a5?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Merch" },
      { title: "Marvel", image: "https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Marvel" },
      { title: "Retro", image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Retro" }
    ],
    summerCollection: [
      { title: "Summer Shirts", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Shirts" },
      { title: "T-Shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=T%20Shirts" },
      { title: "Cotton Linen", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Linen" },
      { title: "Polos", image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Polos" },
      { title: "Easy Pants", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=150&q=80", path: "/men?subcategory=Cargo" }
    ],
    accordion: [
      {
        title: "Shop All",
        items: [
          { name: "All Men Apparel", path: "/men" },
          { name: "New Arrivals", path: "/men?category=new" }
        ]
      },
      {
        title: "Topwear",
        items: [
          { name: "T-Shirts", path: "/men?subcategory=T%20Shirts" },
          { name: "Shirts", path: "/men?subcategory=Shirts" },
          { name: "Polos", path: "/men?subcategory=Polos" },
          { name: "Hoodies", path: "/men?subcategory=Hoodies" },
          { name: "Jackets", path: "/men?subcategory=Jackets" }
        ]
      },
      {
        title: "Bottomwear",
        items: [
          { name: "Jeans", path: "/men?subcategory=Jeans" },
          { name: "Cargo Pants", path: "/men?subcategory=Cargo" },
          { name: "Joggers", path: "/men?subcategory=Joggers" },
          { name: "Shorts", path: "/men?subcategory=Shorts" }
        ]
      },
      {
        title: "Accessories",
        items: [
          { name: "Caps & Hats", path: "/men?subcategory=Caps" },
          { name: "Bags & Backpacks", path: "/men?subcategory=Bags" }
        ]
      }
    ]
  },
  WOMEN: {
    cards: [
      { title: "Cyberpunk", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Cyber" },
      { title: "Oversized", image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Oversized" },
      { title: "Crop Tops", image: "https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Crop" },
      { title: "Athleisure", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Active" },
      { title: "Cargo", image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Cargo" }
    ],
    summerCollection: [
      { title: "Summer Dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Dresses" },
      { title: "Graphic Tees", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=T%20Shirts" },
      { title: "Linen Shorts", image: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Shorts" },
      { title: "Knit Tops", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Knit" },
      { title: "Wide-leg Pants", image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?auto=format&fit=crop&w=150&q=80", path: "/women?subcategory=Pants" }
    ],
    accordion: [
      {
        title: "Shop All",
        items: [
          { name: "All Women Apparel", path: "/women" },
          { name: "New Arrivals", path: "/women?category=new" }
        ]
      },
      {
        title: "Topwear",
        items: [
          { name: "T-Shirts", path: "/women?subcategory=T%20Shirts" },
          { name: "Shirts", path: "/women?subcategory=Shirts" },
          { name: "Knit Tops", path: "/women?subcategory=Knit" },
          { name: "Jackets & Coats", path: "/women?subcategory=Jackets" }
        ]
      },
      {
        title: "Bottomwear",
        items: [
          { name: "Pants & Trousers", path: "/women?subcategory=Pants" },
          { name: "Cargo", path: "/women?subcategory=Cargo" },
          { name: "Shorts & Skirts", path: "/women?subcategory=Shorts" }
        ]
      },
      {
        title: "Accessories",
        items: [
          { name: "Bags", path: "/women?subcategory=Bags" },
          { name: "Caps", path: "/women?subcategory=Caps" }
        ]
      }
    ]
  },
  KIDS: {
    cards: [
      { title: "Superheroes", image: "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Superheroes" },
      { title: "Cartoons", image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Cartoons" },
      { title: "Mini Hoodies", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Hoodies" },
      { title: "Activewear", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Active" },
      { title: "Sneakers", image: "https://images.unsplash.com/photo-1514989940723-e8e5163ccbe8?auto=format&fit=crop&w=150&q=80", path: "/sneakers" }
    ],
    summerCollection: [
      { title: "Cotton Sets", image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Sets" },
      { title: "Play Tees", image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=T%20Shirts" },
      { title: "Linen Shorts", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Shorts" },
      { title: "Denim", image: "https://images.unsplash.com/photo-1471286174243-e7a4d9ab6548?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Denim" },
      { title: "Hats", image: "https://images.unsplash.com/photo-1553561376-79c13be06979?auto=format&fit=crop&w=150&q=80", path: "/kids?subcategory=Caps" }
    ],
    accordion: [
      {
        title: "Shop All",
        items: [
          { name: "All Kids Wear", path: "/kids" }
        ]
      },
      {
        title: "Apparel",
        items: [
          { name: "T-Shirts", path: "/kids?subcategory=T%20Shirts" },
          { name: "Hoodies & Sweaters", path: "/kids?subcategory=Hoodies" },
          { name: "Shorts", path: "/kids?subcategory=Shorts" },
          { name: "Denim Wear", path: "/kids?subcategory=Denim" }
        ]
      }
    ]
  },
  SNEAKERS: {
    cards: [
      { title: "Retro Runner", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Retro" },
      { title: "High-tops", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=High" },
      { title: "Skate Kicks", image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Skate" },
      { title: "Slides", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Slides" },
      { title: "Platform", image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Platform" }
    ],
    summerCollection: [
      { title: "Canvas Lows", image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Canvas" },
      { title: "Breathable Runners", image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=150&q=80", path: "/sneakers" },
      { title: "Neon Slides", image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Slides" },
      { title: "Slip-ons", image: "https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Slipons" },
      { title: "Street Court", image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=150&q=80", path: "/sneakers?subcategory=Court" }
    ],
    accordion: [
      {
        title: "Shop All",
        items: [
          { name: "All Footwear", path: "/sneakers" }
        ]
      },
      {
        title: "Footwear Categories",
        items: [
          { name: "Sneakers & Court Kicks", path: "/sneakers" },
          { name: "Slides & Slippers", path: "/sneakers?subcategory=Slides" }
        ]
      }
    ]
  }
};

const MegaMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  // Tab states: MEN | WOMEN | KIDS | SNEAKERS
  const categoriesList = ['MEN', 'WOMEN', 'KIDS', 'SNEAKERS'];
  const getTabFromPath = (path) => {
    if (path.startsWith('/women')) return 'WOMEN';
    if (path.startsWith('/kids')) return 'KIDS';
    if (path.startsWith('/sneakers')) return 'SNEAKERS';
    return 'MEN';
  };

  const [prevPath, setPrevPath] = useState(location.pathname);
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(location.pathname));

  if (prevPath !== location.pathname) {
    setPrevPath(location.pathname);
    setActiveTab(getTabFromPath(location.pathname));
  }

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    onClose();
    navigate('/');
  };

  const handleLinkClick = () => {
    onClose();
  };

  const activeData = menuData[activeTab] || menuData.MEN;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              backdropFilter: 'blur(4px)',
              zIndex: 1500,
            }}
          />

          {/* Sliding Mega Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'var(--color-bg-alt)',
              borderRight: '1px solid var(--color-border)',
              zIndex: 1600,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-premium)',
            }}
          >
            {/* Header section (Fixed height, includes Promo) */}
            <div style={{ flexShrink: 0, position: 'relative' }}>
              
              {/* Top Banner Control: Close Button & Logo */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.15em', fontSize: '1.25rem', color: 'var(--color-primary)' }}>HAPPY STORE</span>
                <button onClick={onClose} style={{ padding: '0.5rem', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Membership Promo Card */}
              <div style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--color-surface)',
                borderBottom: '1px solid var(--color-border)',
              }}>
                {isAuthenticated && user ? (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '0.75rem' }}>
                      <img
                        src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                        alt={user.name}
                        style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.05em', color: 'var(--color-primary)' }}>{user.name.toUpperCase()}</div>
                        <span className="membership-text" style={{ fontSize: '0.62rem', letterSpacing: '0.05em', display: 'inline-block', marginTop: '0.1rem' }}>APEX VIP MEMBER</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', marginTop: '0.75rem' }}>
                      <Link to="/profile" onClick={handleLinkClick} className="btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.68rem', flex: 1, textTransform: 'uppercase', fontWeight: 800, textAlign: 'center', borderRadius: '4px' }}>
                        MY PROFILE
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin-dashboard" onClick={handleLinkClick} className="btn-accent" style={{ padding: '0.45rem 0.75rem', fontSize: '0.68rem', flex: 1, color: 'var(--color-bg-alt)', textTransform: 'uppercase', fontWeight: 800, textAlign: 'center', borderRadius: '4px' }}>
                          ADMIN
                        </Link>
                      )}
                      <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.68rem', flex: 0.8, textTransform: 'uppercase', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', borderRadius: '4px' }}>
                        <LogOut size={12} /> LOGOUT
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>APEX CLUB ACCESS</span>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <a href="#playstore" style={{ color: 'var(--color-secondary)' }}><PlayStoreIcon /></a>
                        <a href="#appstore" style={{ color: 'var(--color-secondary)' }}><AppStoreIcon /></a>
                      </div>
                    </div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.02em' }}>YOU ARE NOT A MEMBER</h3>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', marginTop: '0.25rem', fontWeight: 500, lineHeight: 1.4 }}>
                      Join the apex collective to redeem cashback credits and VIP pricing privileges.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem' }}>
                      <Link to="/login" onClick={handleLinkClick} className="btn-primary" style={{ flex: 1, padding: '0.55rem 0', fontSize: '0.7rem', textAlign: 'center', borderRadius: '4px' }}>
                        LOG IN
                      </Link>
                      <Link to="/signup" onClick={handleLinkClick} className="btn-secondary" style={{ flex: 1, padding: '0.55rem 0', fontSize: '0.7rem', textAlign: 'center', borderRadius: '4px' }}>
                        SIGN UP
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Horizontal Category Navigation Tabs */}
              <CategoryTabs
                categories={categoriesList}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Scrollable drawer body */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '2.5rem' }} className="hide-scrollbar">
              
              {/* Category Card Horizontal Slider */}
              <div style={{ padding: '1.25rem 1rem 0.5rem 1rem' }}>
                <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.85rem', paddingLeft: '0.5rem' }}>
                  POPULAR CURATIONS
                </h4>
                <ImageCarousel>
                  {activeData.cards.map((card, idx) => (
                    <CategoryCard
                      key={idx}
                      title={card.title}
                      image={card.image}
                      path={card.path}
                      onClick={handleLinkClick}
                    />
                  ))}
                </ImageCarousel>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', margin: '1rem 0' }} />

              {/* Summer Collection Section */}
              <div style={{ padding: '0 1rem 1.25rem 1rem' }}>
                <h4 style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.85rem', paddingLeft: '0.5rem' }}>
                  SUMMER '26 HIGHLIGHTS
                </h4>
                <ImageCarousel>
                  {activeData.summerCollection.map((card, idx) => (
                    <CategoryCard
                      key={idx}
                      title={card.title}
                      image={card.image}
                      path={card.path}
                      onClick={handleLinkClick}
                    />
                  ))}
                </ImageCarousel>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--color-border)', marginBottom: '0.5rem' }} />

              {/* Expandable Accordions */}
              <div>
                {activeData.accordion.map((section, idx) => (
                  <MenuAccordion
                    key={idx}
                    title={section.title}
                    items={section.items}
                    onLinkClick={handleLinkClick}
                  />
                ))}
              </div>

              {/* Support footer helper link */}
              <div style={{ padding: '2rem 1.5rem 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 500 }}>
                <HelpCircle size={14} />
                <span>Customer Care Helpline available 24/7</span>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
