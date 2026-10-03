import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Heart, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { addToCartAsync } from '../redux/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync } from '../redux/wishlistSlice';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

const QuickViewModal = ({ productId, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const wishlistProducts = useSelector((state) => state.wishlist.products);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const isWishlisted = wishlistProducts.some((item) => (item._id || item) === productId);

  useEffect(() => {
    if (!productId || !isOpen) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${productId}`);
        setProduct(response.data);
        if (response.data.images && response.data.images.length > 0) {
          setActiveImage(getImageUrl(response.data.images[0]));
        }
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        if (response.data.colors && response.data.colors.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
        setQuantity(1);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quick view details:', error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, isOpen]);

  // Lock scroll
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

  if (!isOpen) return null;

  const discountPrice = product?.discount > 0 
    ? (product.price * (1 - product.discount / 100))
    : null;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const size = selectedSize || 'Free Size';
    const color = selectedColor || 'Default';

    await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      size,
      color,
      product,
    }));

    setAddingToCart(false);
    onClose();

    addToast({
      title: 'Added to Bag',
      message: `${product.name} (${size})`,
      type: 'cart',
      image: activeImage,
      actionText: 'View Bag',
      onAction: () => {
        window.dispatchEvent(new CustomEvent('open-cart-drawer'));
      },
    });
  };

  const handleBuyNow = async () => {
    const size = selectedSize || 'Free Size';
    const color = selectedColor || 'Default';

    await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      size,
      color,
      product,
    }));
    onClose();
    navigate('/checkout?checkout=true');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(product._id));
      addToast({
        title: 'Removed from Wishlist',
        message: `${product.name} removed`,
        type: 'info',
      });
    } else {
      dispatch(addToWishlistAsync(product));
      addToast({
        title: 'Saved to Wishlist',
        message: `${product.name} saved`,
        type: 'wishlist',
      });
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2500,
          padding: '1.5rem',
        }}
      >
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.75 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#000000',
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Modal Box */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '850px',
            backgroundColor: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-premium)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          className="hide-scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              color: 'var(--color-secondary)',
              zIndex: 15,
              padding: '0.25rem',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.color = 'var(--color-primary)')}
            onMouseLeave={(e) => (e.target.style.color = 'var(--color-secondary)')}
          >
            <X size={20} />
          </button>

          {loading ? (
            <div style={{ padding: '5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>
                FETCHING GARMENT SPECIFICS...
              </span>
            </div>
          ) : product ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
              
              {/* Left Side: Images Gallery */}
              <div style={{ flex: '1 1 380px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderRight: '1px solid var(--color-border)' }}>
                <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
                  <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {product.discount > 0 && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 5 }} className="badge-discount">
                      -{product.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                  <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }} className="hide-scrollbar">
                    {product.images.map((img, idx) => {
                      const url = getImageUrl(img);
                      return (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(url)}
                          style={{
                            width: '60px',
                            height: '75px',
                            overflow: 'hidden',
                            border: '1px solid',
                            borderColor: activeImage === url ? 'var(--color-primary)' : 'var(--color-border)',
                            opacity: activeImage === url ? 1 : 0.5,
                            transition: '0.2s',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          <img src={url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Side: Product Details */}
              <div style={{ flex: '1 1 380px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-accent)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    {product.brand} // {product.category}
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '0.25rem', lineHeight: 1.2 }}>
                    {product.name}
                  </h2>

                  {/* Ratings */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
                    <div style={{ display: 'flex', color: 'var(--color-gold)' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} fill={i < Math.round(product.ratings || 4.5) ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {product.ratings || 4.5} ({product.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '0.75rem 0' }}>
                  {discountPrice ? (
                    <>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                        {formatPrice(discountPrice)}
                      </span>
                      <span style={{ fontSize: '1.1rem', color: 'var(--color-secondary)', textDecoration: 'line-through' }}>
                        {formatPrice(product.price)}
                      </span>
                    </>
                  ) : (
                    <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{formatPrice(product.price)}</span>
                  )}
                </div>

                {/* Short Description */}
                <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.5, fontWeight: 500 }}>
                  {product.description}
                </p>

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>Color</span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            border: '1px solid',
                            borderColor: selectedColor === color ? 'var(--color-primary)' : 'var(--color-border)',
                            backgroundColor: selectedColor === color ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                            color: 'var(--color-primary)',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>Size</span>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          style={{
                            width: '38px',
                            height: '38px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            border: '1px solid',
                            borderColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)',
                            backgroundColor: selectedSize === size ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Qty</span>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)' }}>
                      <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}>-</button>
                      <span style={{ width: '25px', textAlign: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{quantity}</span>
                      <button onClick={() => setQuantity((q) => q + 1)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.7rem', fontWeight: 700 }}>
                    <span style={{ color: 'var(--color-secondary)' }}>AVAILABILITY: </span>
                    <span style={{ color: product.stock > 0 ? '#34C759' : 'var(--color-accent)' }}>
                      {product.stock > 0 ? `${product.stock} Units In Stock` : 'SOLD OUT'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0 || addingToCart}
                      className="btn-primary"
                      style={{ flex: 1, padding: '0.85rem 0', fontSize: '0.75rem' }}
                    >
                      <ShoppingCart size={14} />
                      {product.stock <= 0 ? 'OUT OF STOCK' : addingToCart ? 'ADDING...' : 'ADD TO BAG'}
                    </button>

                    <button
                      onClick={handleWishlistToggle}
                      className="btn-secondary"
                      style={{ padding: '0.85rem', color: isWishlisted ? 'var(--color-accent)' : 'var(--color-primary)', borderColor: isWishlisted ? 'var(--color-accent)' : 'var(--color-border)', cursor: 'pointer' }}
                    >
                      <Heart size={16} fill={isWishlisted ? 'var(--color-accent)' : 'none'} />
                    </button>
                  </div>

                  {product.stock > 0 && (
                    <button
                      onClick={handleBuyNow}
                      className="btn-accent"
                      style={{ width: '100%', padding: '0.85rem 0', fontSize: '0.75rem' }}
                    >
                      BUY IT NOW
                    </button>
                  )}
                </div>

              </div>

            </div>
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center' }}>Error loading product information.</div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
