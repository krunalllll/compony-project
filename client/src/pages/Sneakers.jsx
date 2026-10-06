import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw, Lock, Star } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryPage from '../components/CategoryPage';

const Sneakers = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const showCatalog = searchParams.get('catalog') === 'true' || searchParams.get('subcategory') || searchParams.get('brand');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'SATELLITE APEX KICKS',
      subtitle: 'REINFORCED SOLES & HIGH-BREATHABILITY AIR MESH',
      category: 'SATELLITE',
      link: '/sneakers?catalog=true',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'VULCANISED VINTAGE',
      subtitle: 'RETRO CANVAS & PREMIUM SUEDE LOW-TOPS',
      category: 'RETRO',
      link: '/sneakers?catalog=true',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'NEON CYBER RUNNERS',
      subtitle: 'CHUNKY MIDSOLES & ENERGETIC COLOR RELEASES',
      category: 'CYBER',
      link: '/sneakers?catalog=true',
      image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  useEffect(() => {
    if (showCatalog) return;
    const fetchSneakersProducts = async () => {
      try {
        const response = await api.get('/products');
        // Filter only Sneakers category products
        const sneakerProds = response.data.filter(prod => prod.category && prod.category.toLowerCase() === 'sneakers');
        setProducts(sneakerProds);
        setLoading(false);
      } catch (error) {
        console.error('Error loading sneaker products:', error);
        setLoading(false);
      }
    };
    fetchSneakersProducts();
  }, [showCatalog]);

  useEffect(() => {
    if (showCatalog) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, showCatalog]);

  if (showCatalog) {
    return <CategoryPage defaultCategory="Sneakers" />;
  }

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      {/* 1. HERO SLIDER */}
      <div style={{ position: 'relative', height: '75vh', minHeight: '480px', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.65)), url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 40%',
            }}
          />
        </AnimatePresence>

        {/* Slide Content */}
        <div style={{
          position: 'absolute',
          bottom: '12%',
          left: '5%',
          right: '5%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '1rem',
          maxWidth: '800px',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span style={{
              backgroundColor: 'var(--color-accent)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.35rem 0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              KICKS DIVISION // HAPPY STORE
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            {slides[currentSlide].title}
          </motion.h1>

          <motion.p
            key={`sub-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              fontSize: 'clamp(0.85rem, 1.8vw, 1.05rem)',
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            {slides[currentSlide].subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ marginTop: '0.5rem' }}
          >
            <button onClick={() => navigate(slides[currentSlide].link)} className="btn-primary" style={{ padding: '1rem 2.2rem' }}>
              DISCOVER DROPS <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Slide Controls */}
        <button onClick={handlePrevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', padding: '0.6rem', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', zIndex: 15 }}>
          <ChevronLeft size={18} />
        </button>
        <button onClick={handleNextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', padding: '0.6rem', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', zIndex: 15 }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* 2. CATEGORY SECTION (Souled Store style) */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              SNEAKER LAB
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              SHOP BY STYLE
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem 1.5rem',
          }}>
            {[
              { name: 'RUNNERS', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', link: '/sneakers?catalog=true' },
              { name: 'RETRO CANVAS', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800', link: '/sneakers?catalog=true' },
              { name: 'CHUNKY EVA', img: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800', link: '/sneakers?catalog=true' },
              { name: 'LEATHER KICKS', img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800', link: '/sneakers?catalog=true' },
              { name: 'HIGH-TOPS', img: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800', link: '/sneakers?catalog=true' },
              { name: 'SLIP-ONS', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800', link: '/sneakers?catalog=true' },
            ].map((cat, i) => (
              <Link to={cat.link} key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: 'inherit',
              }}>
                <div style={{
                  height: '420px',
                  width: '100%',
                  overflow: 'hidden',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-alt)',
                }}>
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    src={cat.img}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
                <h3 style={{
                  textAlign: 'center',
                  marginTop: '1.2rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--color-primary)',
                }}>
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SNEAKER BANNER 1 (Weekend Raffles) */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0C0C10', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.06) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 1,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.2rem', color: '#FFFFFF' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em' }}>
            <Sparkles size={14} /> VIP SNEAKER RELEASES
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, color: '#FFFFFF' }}>
            WEEKEND APEX RAFFLES OPEN
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.85rem', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
            Enter exclusive raffle draws to purchase highly limited edition retro colorways and collab designs at cost pricing. Verified accounts only.
          </p>
          <div style={{ display: 'inline-flex', padding: '0.75rem 2.2rem', border: '1px dashed var(--color-gold)', backgroundColor: 'rgba(212, 175, 55, 0.03)', color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            RAFFLE CODE: <span style={{ marginLeft: '0.3rem', color: '#fff' }}>APEXKICKS</span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/profile?tab=wishlist" className="btn-primary" style={{ padding: '0.9rem 2.2rem' }}>ENTER RAFFLE DRAWS</Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED SNEAKERS LIST */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em' }}>CURRENT SEASON</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>TRENDING KICKS</h2>
            </div>
            <Link to="/sneakers?catalog=true" style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em', borderBottom: '1px solid var(--color-primary)', paddingBottom: '0.25rem' }}>
              SHOP ALL SNEAKERS
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-secondary)' }}>LOADING SNEAKERS...</span>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 5. SNEAKER CLEANING BANNER 2 */}
      <section style={{
        height: '420px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.85)), url("https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 60%',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{ maxWidth: '550px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem', color: '#FFFFFF' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>KICKS CARE CAMPAIGN</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05, color: '#FFFFFF' }}>SNEAKER CLEANING & MAINTENANCE</h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 500 }}>
              Learn how to keep your premium suede, leather, and mesh kicks clean and fresh. Read our expert guides on protective sprays, brush techniques, and sole restoration.
            </p>
            <a href="#care" className="btn-primary" style={{ padding: '0.9rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              READ CARE GUIDE <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* 6. TRUST VALUES SECTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <ShieldCheck size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>100% Authentic Verified</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Every single pair of kicks undergoes strict authentication protocols.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Truck size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Double-Boxed Shipping</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Shipped with reinforcing packaging to protect original designer shoeboxes.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <RotateCcw size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>30-Day Easy Exchange</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Need a different size? Enjoy worry-free resizing support.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Lock size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Secure Payments</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Top-tier encryption protecting your transactions.</p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              FEEDBACK
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              SNEAKERHEAD REVIEWS
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                quote: "The chunky EVA foam midsole is extremely comfortable. Feels like walking on clouds. Highly recommend!",
                author: "Alex G.",
                rating: 5,
                title: "Maximum comfort"
              },
              {
                quote: "Arrived in double-boxed packaging. Original shoebox was perfectly intact. Happy Store is my new go-to for kicks.",
                author: "Jordan K.",
                rating: 5,
                title: "Perfect packaging & fast shipping"
              },
              {
                quote: "Verified authentic retro kicks. They fit perfectly true to size. Support team assisted with sizing details before order.",
                author: "Tariq M.",
                rating: 5,
                title: "100% authentic and premium"
              }
            ].map((review, i) => (
              <div key={i} style={{ backgroundColor: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.8rem' }}>
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="var(--color-gold)" stroke="none" />
                    ))}
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{review.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.6, fontWeight: 500 }}>"{review.quote}"</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    {review.author[0]}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>{review.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sneakers;
