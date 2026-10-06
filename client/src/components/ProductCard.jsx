import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../redux/cartSlice';
import WishlistButton from './WishlistButton';
import QuickViewModal from './QuickViewModal';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

// Color mapping for swatches
const getColorHex = (name) => {
  const map = {
    'Slate Black': '#1C1C1E',
    'Off-White': '#F2F2F7',
    'Acid Grey': '#8E8E93',
    'Olive Drab': '#4A5320',
    'Midnight Black': '#0B0C10',
    'Desert Sand': '#C2B280',
    'Cyber Pink': '#FF2D55',
    'Matte Black': '#121212',
    'Chalk White': '#FAF9F6',
    'Solar Flare Yellow': '#FFD60A',
    'Carbon Grey': '#3A3A3C',
    'Sunset Amber': '#FF9500',
    'Charcoal Grey': '#2C2C2E',
    'Neon White': '#FFFFFF',
    'Triple Black': '#000000',
    'Desert Sandstone': '#D2B48C',
    'Obsidian Black': '#0B0B0E',
    'Stone Wash Grey': '#636366',
    'Deep Indigo Blue': '#1B263B',
  };
  return map[name] || '#555555';
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const [hovered, setHovered] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [activeColor, setActiveColor] = useState(product?.colors?.[0] || '');

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
      return;
    }

    const interval = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % product.images.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [hovered, isMobile, product.images]);

  const discountPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100))
    : null;

  const handleQuickAdd = async (e, chosenSize = null) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const size = chosenSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Free Size');
    const color = activeColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');

    await dispatch(addToCartAsync({
      productId: product._id,
      quantity: 1,
      size,
      color,
      product,
    }));

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);

    const firstImg = product.images && product.images.length > 0 ? getImageUrl(product.images[0]) : null;
    addToast({
      title: 'Added to Bag',
      message: `${product.name} (Size: ${size})`,
      type: 'cart',
      image: firstImg,
      actionText: 'View Bag',
      onAction: () => {
        window.dispatchEvent(new CustomEvent('open-cart-drawer'));
      },
    });
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
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--color-bg-alt)',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
        }}
        className="glow-hover product-card-hover-container"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setCurrentImgIndex(0);
        }}
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
                    scale: hovered && isVisible ? 1.05 : 1,
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
            <WishlistButton productId={product._id} product={product} />
          </div>

          {product.discount > 0 && (
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10 }} className="badge-discount">
              -{product.discount}% OFF
            </div>
          )}

          {/* Quick Size Selection Pill strip on Hover */}
          {hovered && product.stock > 0 && product.sizes && product.sizes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              style={{
                position: 'absolute',
                top: '50px',
                left: '12px',
                right: '12px',
                zIndex: 12,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                backgroundColor: 'var(--color-bg-alt)',
                boxShadow: 'var(--shadow-premium)',
                padding: '8px',
                border: '1px solid var(--color-border)',
                borderRadius: '3px',
              }}
            >
              <span style={{ width: '100%', fontSize: '0.62rem', color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2px' }}>
                Quick Add Size:
              </span>
              {product.sizes.slice(0, 5).map((sz) => (
                <button
                  key={sz}
                  onClick={(e) => handleQuickAdd(e, sz)}
                  style={{
                    padding: '3px 8px',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '2px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                    e.currentTarget.style.color = 'var(--color-bg-alt)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--color-surface)';
                    e.currentTarget.style.color = 'var(--color-primary)';
                  }}
                >
                  {sz}
                </button>
              ))}
            </motion.div>
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
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-primary)',
                padding: '0.6rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                fontWeight: 800,
                fontSize: '0.68rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                boxShadow: 'var(--shadow-card)',
                borderRadius: '3px',
                transition: '0.2s',
              }}
              className="quick-view-btn-card"
            >
              <Eye size={13} />
              Quick View
            </button>

            {/* Quick Add Button */}
            {product.stock > 0 ? (
              <button
                onClick={(e) => handleQuickAdd(e)}
                style={{
                  backgroundColor: addedSuccess ? '#10B981' : 'var(--color-primary)',
                  color: 'var(--color-bg-alt)',
                  padding: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid var(--color-primary)',
                  borderRadius: '3px',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'background-color 0.2s, color 0.2s',
                }}
                className="quick-add-btn-card"
              >
                {addedSuccess ? (
                  <>
                    <Check size={13} /> Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingCart size={13} /> Quick Add
                  </>
                )}
              </button>
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--color-bg-alt)',
                  color: 'var(--color-secondary)',
                  padding: '0.55rem',
                  textAlign: 'center',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid var(--color-border)',
                }}
              >
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-gold)' }}>
              <Star size={11} fill="var(--color-gold)" stroke="none" />
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {product.ratings || 4.5}
              </span>
            </div>
          </div>

          <Link
            to={`/products/${product._id}`}
            style={{
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

          {/* Interactive Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              {product.colors.slice(0, 4).map((c) => (
                <button
                  key={c}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveColor(c);
                  }}
                  title={c}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: getColorHex(c),
                    border: activeColor === c ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    boxShadow: activeColor === c ? '0 0 4px var(--color-accent)' : 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              ))}
              {product.colors.length > 4 && (
                <span style={{ fontSize: '0.6rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.35rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {discountPrice ? (
                <>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                    {formatPrice(discountPrice)}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', textDecoration: 'line-through' }}>
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                  {formatPrice(product.price)}
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
            background-color: var(--color-surface-hover) !important;
            color: var(--color-primary) !important;
            border-color: var(--color-primary) !important;
          }
          .quick-add-btn-card:hover {
            opacity: 0.9;
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
