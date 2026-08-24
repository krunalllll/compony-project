import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw, Lock, Headphones, Star, Tag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'DROP 01 // OVERSIZED CORE',
      subtitle: 'HEAVYWEIGHT APPAREL FOR DAILY UTILITY',
      category: 'MEN',
      link: '/men',
      image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'FUTURISTIC STREET UTILITY',
      subtitle: 'REDEFINED APPAREL FEATURING GLASSMORPHIC DETAILS',
      category: 'WOMEN',
      link: '/women',
      image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'APEX SATELLITE KICKS',
      subtitle: 'CHUNKY HEELS AND REINFORCED SOLES',
      category: 'SNEAKERS',
      link: '/sneakers',
      image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.get('/products');
        setNewArrivals(response.data.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error loading products:', error);
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div>
      {/* Hero Banner Slideshow */}
      <div style={{ position: 'relative', height: '80vh', minHeight: '520px', width: '100%', overflow: 'hidden', backgroundColor: '#000' }}>
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
              backgroundPosition: 'center',
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
              SEASON DROP // EXCLUSIVE ACCESS
            </span>
          </motion.div>

          <motion.h1
            key={`title-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 5vw, 4rem)',
              fontWeight: 800,
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
            style={{ marginTop: '0.5rem' }}
          >
            <button onClick={() => navigate(slides[currentSlide].link)} className="btn-primary" style={{ padding: '1rem 2.2rem' }}>
              SHOP {slides[currentSlide].category} <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>

        {/* Slide navigation controls */}
        <button onClick={handlePrevSlide} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', padding: '0.6rem', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', zIndex: 15 }}>
          <ChevronLeft size={18} />
        </button>
        <button onClick={handleNextSlide} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', padding: '0.6rem', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', zIndex: 15 }}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Trending categories grid */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Sparkles size={12} /> EXPLORE OUR RELEASES
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              TRENDING CATEGORIES
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { name: 'MEN', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600', link: '/men' },
              { name: 'WOMEN', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600', link: '/women' },
              { name: 'SNEAKERS', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', link: '/sneakers' },
            ].map((cat, i) => (
              <Link to={cat.link} key={i} style={{
                height: '420px',
                position: 'relative',
                overflow: 'hidden',
                display: 'block',
                border: '1px solid var(--color-border)',
              }} className="glow-hover">
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
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</h3>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--color-secondary)' }}>VIEW DROP →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Men's Shop By Category Grid */}
      <section style={{ padding: '4rem 0 6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              MEN'S WARDROBE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              SHOP MEN'S CATEGORIES
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem 1.5rem',
          }}>
            {[
              { name: 'T-SHIRTS', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800', link: '/men?subcategory=T%20Shirts' },
              { name: 'SHIRTS', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800', link: '/men?subcategory=Shirts' },
              { name: 'POLOS', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800', link: '/men?subcategory=Polos' },
              { name: 'JEANS', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', link: '/men?subcategory=Jeans' },
              { name: 'PANTS', img: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', link: '/men?subcategory=Cargo' },
              { name: 'JOGGERS', img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800', link: '/men?subcategory=Joggers' },
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
                  color: '#FFF',
                }}>
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Values / Trust Badges */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Truck size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Free Express Shipping</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Gratis shipping on all orders over $150 worldwide.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <RotateCcw size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>30-Day Easy Returns</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Hassle-free return policy. Satisfaction guaranteed.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Lock size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>100% Secure Checkout</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Your transactions are fully encrypted and protected.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '50%', color: 'var(--color-accent)' }}>
              <Headphones size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>24/7 Customer Care</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Reach out to our experts any time for premium support.</p>
          </div>
        </div>
      </section>

      {/* Promo / Flash Sale Banner */}
      <section style={{ padding: '5rem 0', backgroundColor: '#000', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 78, 80, 0.08) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 1,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            <Tag size={14} /> LIMITED TIME FLASH SALE
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '0.02em', textTransform: 'uppercase', lineHeight: 1.1 }}>
            UP TO 40% OFF ON PREMIUM SNEAKERS & APPAREL
          </h2>
          <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
            Elevate your streetwear game with premium drops. Enjoy exclusive discounts on our collection. Use code below at checkout.
          </p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            border: '1px dashed var(--color-accent)',
            padding: '0.75rem 2rem',
            backgroundColor: 'rgba(255, 78, 80, 0.04)',
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '0.1em',
          }}>
            CODE: <span style={{ color: 'var(--color-accent)' }}>HAPPY20</span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/sneakers" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>
              SHOP FLASH SALE NOW
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals list */}
      <section style={{ padding: '5rem 0 6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em' }}>CURRENT SEASON</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>NEW ARRIVALS</h2>
            </div>
            <Link to="/men" style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em', borderBottom: '1px solid #fff', paddingBottom: '0.25rem' }}>
              SHOP ALL DROP
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>LOADING NEW ARRIVALS...</span>
            </div>
          ) : (
            <div className="product-grid">
              {newArrivals.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials / Customer Reviews */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              REVIEWS
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              WHAT OUR COMMUNITY SAYS
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {[
              {
                quote: "The quality of the oversized tees is outstanding. The heavyweight cotton holds up perfectly after multiple washes.",
                author: "Marcus V.",
                rating: 5,
                title: "Incredible Quality Apparels"
              },
              {
                quote: "Happy Store sneakers are absolute heat! Fast shipping, excellent packaging, and 100% authentic stuff.",
                author: "Sarah L.",
                rating: 5,
                title: "Legit kicks and fast delivery"
              },
              {
                quote: "Their customer support team helped me exchange sizes in less than 24 hours. Exceptionally helpful team!",
                author: "David K.",
                rating: 5,
                title: "Top-tier Customer Support"
              }
            ].map((review, i) => (
              <div key={i} style={{
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.5rem',
              }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.8rem' }}>
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="var(--color-gold)" stroke="none" />
                    ))}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{review.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.6, fontWeight: 500 }}>"{review.quote}"</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem' }}>
                    {review.author[0]}
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fff' }}>{review.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Banner */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg-alt)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '4rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)' }}>
              <ShieldCheck size={20} />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>THE MEMBERSHIP CLUB</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '1rem', lineHeight: 1.05 }}>
              JOIN THE CIRCLE. <br />BUY AT COST PRICE.
            </h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginTop: '1.5rem', fontWeight: 600 }}>
              Unlock product costs directly. Members bypass traditional markups, receive priority next-day shipping gratis, enjoy access limits on special sneaker raffles, and personal support.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
              <Link to="/signup" className="btn-primary" style={{ padding: '1rem 2rem' }}>JOIN MEMBERSHIP</Link>
              <Link to="/login" className="btn-secondary" style={{ padding: '1rem 2rem' }}>LOGIN</Link>
            </div>
          </div>

          {/* Membership Card preview */}
          <div style={{
            height: '380px',
            backgroundColor: '#000',
            border: '1px solid rgba(212,175,55,0.25)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)',
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '-15%',
              right: '-15%',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(0,0,0,0) 70%)',
              zIndex: 1,
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 5 }}>
              <div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.1em' }}>HAPPY STORE APEX CLUB</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '0.12em', marginTop: '0.25rem' }}>BLACK CARD</h4>
              </div>
              <span style={{ border: '1px solid var(--color-gold)', color: 'var(--color-gold)', padding: '0.25rem 0.5rem', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>VIP</span>
            </div>

            <div style={{ zIndex: 5 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>SAVED THIS MONTH</div>
              <div style={{ fontSize: '3rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-gold)', marginTop: '0.25rem' }}>$248.60</div>
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
