import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw, Lock, Headphones, Star, Tag, Play, Pause, Copy, Check, Plus, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useToast } from '../context/ToastContext';

const Home = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Hero slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Flash Sale Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 36,
    seconds: 48,
  });

  // Coupon copy feedback
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Newsletter feedback
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const slides = [
    {
      title: 'DROP 01 // OVERSIZED CORE',
      subtitle: 'HEAVYWEIGHT APPAREL FOR DAILY UTILITY',
      category: 'MEN',
      link: '/men',
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
      tag: 'SEASON DROP 01',
    },
    {
      title: 'FUTURISTIC STREET UTILITY',
      subtitle: 'REDEFINED APPAREL FEATURING GLASSMORPHIC DETAILS',
      category: 'WOMEN',
      link: '/women',
      image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1600&q=80',
      tag: 'TECHWEAR CAPSULE',
    },
    {
      title: 'APEX SATELLITE KICKS',
      subtitle: 'CHUNKY PLATFORM SOLES AND REINFORCED EVA FOAM',
      category: 'SNEAKERS',
      link: '/sneakers',
      image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1600&q=80',
      tag: 'FOOTWEAR RELEASE',
    },
  ];

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setAllProducts(response.data || []);
        setDisplayedProducts(response.data.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by tab
  useEffect(() => {
    if (activeTab === 'ALL') {
      setDisplayedProducts(allProducts.slice(0, 8));
    } else if (activeTab === 'MEN') {
      setDisplayedProducts(allProducts.filter((p) => p.category === 'Men').slice(0, 8));
    } else if (activeTab === 'WOMEN') {
      setDisplayedProducts(allProducts.filter((p) => p.category === 'Women').slice(0, 8));
    } else if (activeTab === 'SNEAKERS') {
      setDisplayedProducts(allProducts.filter((p) => p.category === 'Sneakers').slice(0, 8));
    } else if (activeTab === 'UNDER_100') {
      setDisplayedProducts(allProducts.filter((p) => p.price < 100).slice(0, 8));
    } else if (activeTab === 'SALE') {
      setDisplayedProducts(allProducts.filter((p) => p.discount > 0).slice(0, 8));
    }
  }, [activeTab, allProducts]);

  // Slideshow auto-play interval
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, isAutoPlaying]);

  // Real-time flash sale countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('HAPPY20');
    setCopiedCoupon(true);
    addToast({
      title: 'Coupon Code Copied!',
      message: 'Code HAPPY20 copied. Apply in your bag for 20% discount!',
      type: 'success',
    });
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    addToast({
      title: 'Subscribed to Apex Drops',
      message: 'Welcome voucher code WELCOME15 unlocked for 15% off!',
      type: 'success',
    });
  };

  const faqItems = [
    {
      q: 'HOW DO HAPPY STORE GARMENTS FIT?',
      a: 'All our streetwear garments feature an authentic heavyweight oversized boxy silhouette with dropped shoulder tailoring. If you prefer a traditional standard fit, select one size smaller than your usual sizing.',
    },
    {
      q: 'ARE THE SNEAKERS 100% AUTHENTIC?',
      a: 'Yes, every pair of sneakers in our inventory undergoes a multi-point physical verification protocol by our footwear specialists before entering our logistics center.',
    },
    {
      q: 'WHAT IS THE APEX MEMBERSHIP CIRCLE?',
      a: 'The Apex Membership Circle is our VIP tier granting members zero-markup pricing directly at production cost, complimentary next-day express delivery, and reserved access to limited drop raffles.',
    },
    {
      q: 'WHAT IS YOUR RETURN POLICY?',
      a: 'We offer an unconditional 30-day return policy on all unworn items with original garment tags intact. Apex VIP members enjoy complimentary home pickup return service.',
    },
  ];

  return (
    <div>
      {/* HERO BANNER SLIDESHOW */}
      <div style={{ position: 'relative', height: '82vh', minHeight: '540px', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.7)), url(${slides[currentSlide].image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Slide Content */}
        <div
          style={{
            position: 'absolute',
            bottom: '12%',
            left: '5%',
            right: '5%',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            maxWidth: '820px',
          }}
        >
          <motion.div
            key={`tag-${currentSlide}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#fff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.4rem 0.85rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sparkles size={11} /> {slides[currentSlide].tag} // EXCLUSIVE
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
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
              color: 'var(--color-secondary)',
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
            style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
          >
            <button
              onClick={() => navigate(slides[currentSlide].link)}
              className="btn-primary"
              style={{ padding: '1rem 2.4rem' }}
            >
              SHOP {slides[currentSlide].category} <ArrowRight size={16} />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('featured-drops-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-secondary"
              style={{ padding: '1rem 2rem' }}
            >
              EXPLORE DROPS
            </button>
          </motion.div>
        </div>

        {/* Interactive Slide Controls & Autoplay Toggle */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '5%',
            zIndex: 15,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {/* Autoplay Play/Pause Button */}
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            title={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          {/* Interactive Slide Progress Indicators */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? '32px' : '10px',
                  height: '4px',
                  backgroundColor: currentSlide === idx ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: '2px',
                }}
              />
            ))}
          </div>

          {/* Slide Numbers */}
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>
            0{currentSlide + 1} / 0{slides.length}
          </span>
        </div>

        {/* Previous / Next Arrows */}
        <button
          onClick={handlePrevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.65rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            zIndex: 15,
            cursor: 'pointer',
          }}
          title="Previous slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            padding: '0.65rem',
            backgroundColor: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            zIndex: 15,
            cursor: 'pointer',
          }}
          title="Next slide"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* INTERACTIVE FLASH SALE & LIVE COUNTDOWN SECTION */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-bg-alt)', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.75rem' }}>
          
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#E11D48', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            <Tag size={15} /> LIMITED TIME FLASH SALE // ENDING SOON
          </span>

          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1.1, color: 'var(--color-primary)' }}>
            UP TO 40% OFF ON SNEAKERS & STREETWEAR
          </h2>

          {/* Interactive Countdown Timer Boxes */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { val: String(timeLeft.days).padStart(2, '0'), label: 'DAYS' },
              { val: String(timeLeft.hours).padStart(2, '0'), label: 'HOURS' },
              { val: String(timeLeft.minutes).padStart(2, '0'), label: 'MINUTES' },
              { val: String(timeLeft.seconds).padStart(2, '0'), label: 'SECONDS' },
            ].map((unit, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '85px',
                  padding: '1rem 0.75rem',
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-card)',
                  borderRadius: '3px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                    fontWeight: 900,
                    color: 'var(--color-primary)',
                    lineHeight: 1,
                  }}
                >
                  {unit.val}
                </span>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.12em', marginTop: '0.35rem' }}>
                  {unit.label}
                </span>
              </div>
            ))}
          </div>

          <p style={{ color: 'var(--color-secondary)', fontSize: '0.88rem', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
            Elevate your streetwear collection with premium heavyweight garments. Apply the exclusive voucher code below at checkout for instant 20% savings.
          </p>

          {/* 1-Click Copy Coupon Widget */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px dashed #E11D48',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(225, 29, 72, 0.05)',
                fontSize: '0.95rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                color: 'var(--color-primary)',
                borderRadius: '3px',
              }}
            >
              CODE: <span style={{ color: '#E11D48' }}>HAPPY20</span>
            </div>

            <button
              onClick={handleCopyCoupon}
              className="btn-secondary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.75rem' }}
            >
              {copiedCoupon ? (
                <>
                  <Check size={14} style={{ color: '#30D158' }} /> COPIED!
                </>
              ) : (
                <>
                  <Copy size={14} /> COPY CODE
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* TRENDING CATEGORIES 3-COLUMN HERO TILES */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} /> CURATED RELEASES
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.4rem' }}>
              EXPLORE OUR ARCHIVE
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              { name: 'MEN', subtitle: 'Heavyweight Boxy Fits', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600', link: '/men' },
              { name: 'WOMEN', subtitle: 'Techwear & Cropped Hoodies', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', link: '/women' },
              { name: 'SNEAKERS', subtitle: 'Custom EVA Midsoles & Platforms', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', link: '/sneakers' },
            ].map((cat, i) => (
              <Link
                to={cat.link}
                key={i}
                style={{
                  height: '420px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'block',
                  border: '1px solid var(--color-border)',
                }}
                className="glow-hover"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75)), url(${cat.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {cat.subtitle}
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                    {cat.name}
                  </h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#FFF', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}>
                    EXPLORE COLLECTION <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DROPS WITH INTERACTIVE CATEGORY TABS */}
      <section id="featured-drops-section" style={{ padding: '4rem 0 6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                CURRENT SEASON '26
              </span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
                NEW ARRIVALS
              </h2>
            </div>

            {/* Interactive Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'ALL DROPS' },
                { id: 'MEN', label: 'MEN' },
                { id: 'WOMEN', label: 'WOMEN' },
                { id: 'SNEAKERS', label: 'SNEAKERS' },
                { id: 'UNDER_100', label: 'UNDER $100' },
                { id: 'SALE', label: 'ON SALE' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    border: '1px solid',
                    borderColor: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                    backgroundColor: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                    color: activeTab === tab.id ? '#000000' : 'var(--color-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>
                SYNCHRONIZING CATALOGUE...
              </span>
            </div>
          ) : displayedProducts.length > 0 ? (
            <motion.div layout className="product-grid">
              <AnimatePresence>
                {displayedProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div style={{ padding: '4rem 1rem', textAlign: 'center', color: 'var(--color-secondary)' }}>
              No garments found matching the selected filter.
            </div>
          )}

          <div style={{ marginTop: '3.5rem', textAlign: 'center' }}>
            <Link to="/men" className="btn-secondary" style={{ padding: '0.9rem 2.8rem' }}>
              VIEW FULL STREETWEAR ARCHIVE <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND VALUES / TRUST BADGES */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Truck size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Free Express Shipping</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Complimentary global shipping on all orders over $150.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <RotateCcw size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>30-Day Easy Returns</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Hassle-free return policy with prepaid shipping labels.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Lock size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>100% Encrypted Checkout</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>State of the art 256-bit encryption protecting payment data.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Headphones size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>24/7 Apex Support</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Dedicated garment specialists available at any hour.</p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ ACCORDION SECTION */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              QUESTIONS & ANSWERS
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.4rem' }}>
              FREQUENTLY ASKED
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqItems.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--color-bg-alt)',
                    border: '1px solid var(--color-border)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: isOpen ? '#E11D48' : 'var(--color-primary)',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{item.q}</span>
                    <Plus
                      size={16}
                      style={{
                        transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ padding: '0 1.5rem 1.25rem 1.5rem', fontSize: '0.82rem', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP CLUB BANNER */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '4rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                THE APEX VIP MEMBERSHIP
              </span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '1rem', lineHeight: 1.05 }}>
              JOIN THE CIRCLE. <br />BUY AT FACTORY COST.
            </h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '1.5rem', fontWeight: 600 }}>
              Unlock raw product costs directly. Members bypass retail markups, receive complimentary express shipping worldwide, enjoy reserved access on sneaker drops, and personal concierge support.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2.2rem' }}>JOIN MEMBERSHIP</Link>
              <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2.2rem' }}>MEMBER LOGIN</Link>
            </div>
          </div>

          {/* Membership Black Card visual */}
          <div
            style={{
              height: '380px',
              backgroundColor: '#000',
              border: '1px solid rgba(212,175,55,0.3)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-15%',
                right: '-15%',
                width: '280px',
                height: '280px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 1,
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 5 }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.1em' }}>HAPPY STORE APEX CLUB</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.12em', marginTop: '0.25rem' }}>BLACK CARD</h4>
              </div>
              <span style={{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '0.25rem 0.5rem', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>VIP</span>
            </div>

            <div style={{ zIndex: 5 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SAVED THIS MONTH</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--color-gold)', marginTop: '0.25rem' }}>$248.60</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem', zIndex: 5 }}>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-secondary)' }}>MEMBER CARD</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', marginTop: '0.2rem' }}>JOHN DOE</div>
              </div>
              <div>
                <div style={{ fontSize: '0.6rem', color: 'var(--color-secondary)', textAlign: 'right' }}>MEMBER ID</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', marginTop: '0.2rem' }}>#HS-49021-VIP</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
