import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, RotateCcw, Lock, Headphones, Star, Tag, Eye } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryPage from '../components/CategoryPage';

const Women = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const showCatalog = searchParams.get('catalog') === 'true' || searchParams.get('subcategory') || searchParams.get('brand');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'COZY UTILITY KNITS',
      subtitle: 'HEAVYWEIGHT COTTON & BRUSHED FLEECE DROPS',
      category: 'KNITWEAR',
      link: '/women?subcategory=Knit',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'FUTURISTIC STREETWEAR',
      subtitle: 'REDEFINED CROPS AND METALLIC STRETCH PANTS',
      category: 'CROPS',
      link: '/women?subcategory=Crop',
      image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80',
    },
    {
      title: 'SUMMER CORES 2026',
      subtitle: 'LINEN UTILITY SHORTS & ORGANIC COTTON TEES',
      category: 'SUMMER',
      link: '/women?subcategory=T%20Shirts',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
    },
  ];

  useEffect(() => {
    if (showCatalog) return;
    const fetchWomenProducts = async () => {
      try {
        const response = await api.get('/products');
        // Filter only Women category products
        const womenProds = response.data.filter(prod => prod.category && prod.category.toLowerCase() === 'women');
        setProducts(womenProds.slice(0, 4));
        setLoading(false);
      } catch (error) {
        console.error('Error loading women products:', error);
        setLoading(false);
      }
    };
    fetchWomenProducts();
  }, [showCatalog]);

  useEffect(() => {
    if (showCatalog) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, showCatalog]);

  if (showCatalog) {
    return <CategoryPage defaultCategory="Women" />;
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
              backgroundPosition: 'center 20%',
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
              WOMEN COLLECTION // HAPPY STORE
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
              SHOP COLLECTION <ArrowRight size={16} />
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
              WOMEN'S WARDROBE
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              SHOP BY CATEGORY
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem 1.5rem',
          }}>
            {[
              { name: 'T-SHIRTS', img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800', link: '/women?subcategory=T%20Shirts' },
              { name: 'CROP TOPS', img: 'https://images.unsplash.com/photo-1534126511673-b6899657816a?w=800', link: '/women?subcategory=Crop' },
              { name: 'SHIRTS', img: 'https://images.unsplash.com/photo-1507206130060-90ee72646f0c?w=800', link: '/women?subcategory=Shirts' },
              { name: 'JACKETS', img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', link: '/women?subcategory=Jackets' },
              { name: 'CARGO PANTS', img: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800', link: '/women?subcategory=Cargo' },
              { name: 'KNITWEAR', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800', link: '/women?subcategory=Knit' },
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

      {/* 3. PROMO BANNER 1 (Buy 2 Get 1) */}
      <section style={{ padding: '5rem 0', backgroundColor: '#0A0A0C', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 78, 80, 0.08) 0%, rgba(0,0,0,0) 70%)',
          zIndex: 1,
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.2rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em' }}>
            <Tag size={14} /> EXCLUSIVE SHOPPER OFFER
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1 }}>
            BUY 2 GET 1 FREE ON ALL WOMEN CROPS & TEES
          </h2>
          <p style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', maxWidth: '600px', lineHeight: 1.6, fontWeight: 500 }}>
            Stock up on seasonal essentials. Mix and match graphic tees, basic crops, and tank tops. Free shipping automatically applies.
          </p>
          <div style={{ display: 'inline-flex', padding: '0.75rem 2.2rem', border: '1px dashed var(--color-accent)', backgroundColor: 'rgba(255, 78, 80, 0.05)', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.1em' }}>
            CODE: <span style={{ color: 'var(--color-accent)', marginLeft: '0.3rem' }}>WOMENBOGO</span>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <Link to="/women?catalog=true" className="btn-primary" style={{ padding: '0.9rem 2.2rem' }}>SHOP OFFER CORES</Link>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em' }}>HOT RELEASES</span>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>TRENDING NOW</h2>
            </div>
            <Link to="/women?catalog=true" style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em', borderBottom: '1px solid #fff', paddingBottom: '0.25rem' }}>
              VIEW CATALOGUE
            </Link>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-secondary)' }}>LOADING PRODUCTS...</span>
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

      {/* 5. LIFESTYLE BANNER 2 (Explore Lookbook) */}
      <section style={{
        height: '420px',
        width: '100%',
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        display: 'flex',
        alignItems: 'center',
        borderTop: '1px solid var(--color-border)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div className="container">
          <div style={{ maxWidth: '550px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1.2rem' }}>
            <span style={{ color: 'var(--color-gold)', fontWeight: 800, fontSize: '0.7rem', letterSpacing: '0.25em', textTransform: 'uppercase' }}>SEASONAL LOOKBOOK</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.05 }}>FUTURE UTILITY STREETWEAR</h2>
            <p style={{ color: 'var(--color-secondary)', fontSize: '0.85rem', lineHeight: 1.6, fontWeight: 500 }}>
              Discover our Summer 2026 styling campaign. Heavy tech cargo pairings, structured vests, and breathable fabrics configured for daily city walks.
            </p>
            <Link to="/women?catalog=true" className="btn-primary" style={{ padding: '0.9rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              EXPLORE COLLECTION <ArrowRight size={16} />
            </Link>
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
              <Truck size={28} />
            </div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Free Sizing Exchange</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Wrong fit? We exchange sizing absolutely free of cost.</p>
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
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Premium Sizing Guide</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>Detailed dimensions chart on each product for the perfect fit.</p>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section style={{ padding: '5.5rem 0', backgroundColor: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--color-accent)', fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              COMMUNITY
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>
              FIT & REVIEWS
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                quote: "The cropped utility jacket fits like a glove. It has this incredible technical nylon structure that feels very high-end.",
                author: "Elena R.",
                rating: 5,
                title: "Tech cropped styling"
              },
              {
                quote: "Oversized graphic tees are super soft and have a heavyweight drape. Highly recommend Happy Store for street styling.",
                author: "Chloe M.",
                rating: 5,
                title: "Best oversized fit ever"
              },
              {
                quote: "Super convenient return process! I swapped sizes for my cargo pants, and the new pair arrived in 2 days.",
                author: "Jessica T.",
                rating: 5,
                title: "Fast exchange & friendly care"
              }
            ].map((review, i) => (
              <div key={i} style={{ backgroundColor: 'var(--color-bg-alt)', border: '1px solid var(--color-border)', padding: '2rem', display: 'flex', flexDirection: 'column', justifycontent: 'space-between', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.8rem' }}>
                    {[...Array(review.rating)].map((_, idx) => (
                      <Star key={idx} size={14} fill="var(--color-gold)" stroke="none" />
                    ))}
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{review.title}</h4>
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
    </div>
  );
};

export default Women;
