import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartAsync } from '../redux/cartSlice';
import WishlistButton from './WishlistButton';
import QuickViewModal from './QuickViewModal';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [hovered, setHovered] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Image rotation on hover (desktop only)
  useEffect(() => {
    if (!hovered || isMobile || !product.images || product.images.length <= 1) {
      setCurrentImgIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
    }, 1000); // Autoplay interval between 800ms and 1200ms

    return () => clearInterval(interval);
  }, [hovered, isMobile, product.images]);

  const discountPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size';
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : 'Default';

    dispatch(addToCartAsync({
      productId: product._id,
      quantity: 1,
      size,
      color,
    }));
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  // Stock status text & color
  let stockStatusText = 'In Stock';
  let stockStatusColor = '#34C759';
  if (product.stock <= 0) {
    stockStatusText = 'Sold Out';
    stockStatusColor = 'var(--color-accent)';
  } else if (product.stock <= 5) {
    stockStatusText = `Only ${product.stock} left`;
    stockStatusColor = '#FF9500';
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
        }}
        className="glow-hover product-card-hover-container"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Media view container */}
        <Link to={`/products/${product._id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden', aspectRatio: '4/5' }}>
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => {
              const url = getImageUrl(img);
              const isVisible = hovered && !isMobile ? index === currentImgIndex : index === 0;
              return (
                <motion.img
                  key={url + index}
                  src={url}
                  alt={product.name}
                  loading="lazy"
                  initial={false}
                  animate={{
                    opacity: isVisible ? 1 : 0,
                    scale: hovered && isVisible ? 1.04 : 1
                  }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: isVisible ? 2 : 1,
                    pointerEvents: 'none',
                  }}
                />
              );
            })
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--color-surface)' }} />
          )}

          {/* Top Floating items */}
          <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
            <WishlistButton productId={product._id} />
          </div>

          {product.discount > 0 && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }} className="badge-discount">
              -{product.discount}% OFF
            </div>
          )}

          {/* Hover Action Drawer */}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              right: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              zIndex: 10,
            }}
            className="hover-actions-panel"
          >
            {/* Quick View Button */}
            <button
              onClick={handleQuickViewClick}
              style={{
                backgroundColor: 'rgba(10, 10, 12, 0.85)',
                backdropFilter: 'blur(4px)',
                border: '1px solid var(--color-border)',
                color: '#ffffff',
                padding: '0.55rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontWeight: 800,
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: '0.2s',
              }}
              className="quick-view-btn-card"
            >
              <Eye size={12} />
              Quick View
            </button>

            {/* Quick Add Button */}
            {product.stock > 0 ? (
              <button
                onClick={handleQuickAdd}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#000000',
                  padding: '0.55rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: '0.2s',
                }}
                className="quick-add-btn-card"
              >
                <ShoppingCart size={12} />
                Quick Add
              </button>
            ) : (
              <div style={{
                backgroundColor: 'rgba(10, 10, 12, 0.85)',
                color: 'var(--color-secondary)',
                padding: '0.55rem',
                textAlign: 'center',
                fontSize: '0.65rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                border: '1px solid var(--color-border)',
              }}>
                Sold Out
              </div>
            )}
          </div>
        </Link>

        {/* Info details */}
        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
              {product.brand || 'Happy Store'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: 'var(--color-gold)' }}>
              <Star size={11} fill="var(--color-gold)" stroke="none" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {product.ratings || 4.5}
              </span>
            </div>
          </div>

          <Link to={`/products/${product._id}`} style={{
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            lineHeight: 1.3,
            color: 'var(--color-primary)',
            height: '2.2rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            transition: 'color 0.2s',
          }}
          className="product-card-title-link"
          >
            {product.name}
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {discountPrice ? (
                <>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                    ${discountPrice}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textDecoration: 'line-through' }}>
                    ${product.price}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  ${product.price}
                </span>
              )}
            </div>

            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: stockStatusColor, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {stockStatusText}
            </span>
          </div>
        </div>

        <style>{`
          .product-card-hover-container .hover-actions-panel {
            opacity: 0;
            transform: translateY(10px);
            transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .product-card-hover-container:hover .hover-actions-panel {
            opacity: 1;
            transform: translateY(0);
          }
          .quick-view-btn-card:hover {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .quick-add-btn-card:hover {
            background-color: var(--color-accent) !important;
            color: #ffffff !important;
          }
          .product-card-title-link:hover {
            color: var(--color-accent) !important;
          }
        `}</style>
      </motion.div>

      {/* Render Quick View Modal */}
      <QuickViewModal
        productId={product._id}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
