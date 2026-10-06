import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, Tag, Check, ArrowRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItemAsync, removeCartItemAsync } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useToast } from '../context/ToastContext';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const cartItems = useSelector((state) => state.cart.items);

  // Promo code state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountPercent, discountAmount }
  const [couponError, setCouponError] = useState('');

  // Raw Subtotal Amount
  const subtotal = cartItems.reduce((acc, item) => {
    if (!item.productId) return acc;
    const finalPrice = item.productId.discount > 0 
      ? item.productId.price * (1 - item.productId.discount / 100)
      : item.productId.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  // Calculate discount from coupon
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(appliedCoupon.value, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  // Free shipping threshold ($150)
  const shippingThreshold = 150;
  const progressPercent = Math.min((subtotal / shippingThreshold) * 100, 100);

  // Delivery estimation (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const handleQtyChange = (item, diff) => {
    const newQty = item.quantity + diff;
    if (newQty < 1) return;
    dispatch(updateCartItemAsync({
      productId: item.productId._id || item.productId,
      size: item.size,
      color: item.color,
      quantity: newQty,
    }));
  };

  const handleRemoveItem = (item) => {
    dispatch(removeCartItemAsync({
      productId: item.productId._id || item.productId,
      size: item.size,
      color: item.color,
    }));
    addToast({
      title: 'Item Removed',
      message: `${item.productId?.name || 'Garment'} removed from bag`,
      type: 'info',
    });
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    setCouponError('');

    if (code === 'HAPPY20') {
      setAppliedCoupon({ code: 'HAPPY20', type: 'percent', value: 20, label: '20% OFF' });
      setCouponCode('');
      addToast({
        title: 'Coupon Applied!',
        message: 'HAPPY20 gives you 20% off your entire order',
        type: 'success',
      });
    } else if (code === 'APEX10') {
      setAppliedCoupon({ code: 'APEX10', type: 'flat', value: 10, label: '$10 OFF' });
      setCouponCode('');
      addToast({
        title: 'Coupon Applied!',
        message: 'APEX10 discount of $10 deducted',
        type: 'success',
      });
    } else {
      setCouponError('Invalid coupon code. Try HAPPY20 or APEX10.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout?checkout=true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              zIndex: 2100,
            }}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '430px',
              backgroundColor: 'var(--color-bg-alt)',
              borderLeft: '1px solid var(--color-border)',
              zIndex: 2200,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-premium)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <ShoppingBag size={18} style={{ color: 'var(--color-accent)' }} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Your Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  padding: '0.4rem',
                  color: 'var(--color-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Interactive Free Shipping Indicator */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: '1rem 1.5rem',
                  borderBottom: '1px solid var(--color-border)',
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  {subtotal >= shippingThreshold ? (
                    <span style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Sparkles size={13} /> FREE EXPRESS SHIPPING UNLOCKED!
                    </span>
                  ) : (
                    <span>
                      ADD <strong style={{ color: 'var(--color-accent)' }}>{formatPrice(shippingThreshold - subtotal)}</strong> MORE FOR FREE SHIPPING
                    </span>
                  )}
                  <span style={{ color: 'var(--color-secondary)' }}>
                    {formatPrice(subtotal)} / {formatPrice(shippingThreshold)}
                  </span>
                </div>
                <div style={{ height: '5px', backgroundColor: 'var(--color-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      height: '100%',
                      background: subtotal >= shippingThreshold
                        ? 'linear-gradient(90deg, #E6C875, #D4AF37)'
                        : 'linear-gradient(90deg, #FF6B6B, #FF3B30)',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem', color: 'var(--color-secondary)', marginTop: '0.5rem' }}>
                  <Truck size={13} style={{ color: 'var(--color-gold)' }} />
                  <span>Est. Express Delivery: <strong>{formattedDelivery}</strong></span>
                </div>
              </div>
            )}

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }} className="hide-scrollbar">
              {cartItems.length === 0 ? (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    color: 'var(--color-secondary)',
                    textAlign: 'center',
                    padding: '2rem',
                  }}
                >
                  <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShoppingBag size={34} style={{ color: 'var(--color-secondary)' }} />
                  </div>
                  <div>
                    <h3 style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
                      Your Bag is Empty
                    </h3>
                    <p style={{ fontSize: '0.78rem', lineHeight: 1.4 }}>Discover our latest oversized essentials and sneakers.</p>
                  </div>
                  <button onClick={onClose} className="btn-primary" style={{ fontSize: '0.75rem', marginTop: '0.5rem', padding: '0.75rem 1.8rem' }}>
                    EXPLORE COLLECTION
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {cartItems.map((item, idx) => {
                    const product = item.productId;
                    if (!product) return null;
                    const finalPrice = product.discount > 0 
                      ? product.price * (1 - product.discount / 100)
                      : product.price;

                    const imgUrl = product.images && product.images[0] 
                      ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) 
                      : '';

                    return (
                      <motion.div
                        key={item._id || idx}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        style={{
                          display: 'flex',
                          gap: '1rem',
                          paddingBottom: '1.25rem',
                          borderBottom: '1px solid var(--color-border)',
                        }}
                      >
                        <div style={{ width: '80px', height: '100px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                          <img
                            src={imgUrl}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4
                                style={{
                                  fontSize: '0.82rem',
                                  fontWeight: 800,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.02em',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  paddingRight: '0.5rem',
                                  lineHeight: 1.25,
                                }}
                              >
                                {product.name}
                              </h4>
                              <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                                {formatPrice(finalPrice * item.quantity)}
                              </span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--color-secondary)', marginTop: '0.35rem', fontWeight: 700 }}>
                              <span>SIZE: <strong style={{ color: 'var(--color-primary)' }}>{item.size}</strong></span>
                              {item.color && <span>COLOR: <strong style={{ color: 'var(--color-primary)' }}>{item.color}</strong></span>}
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg)',
                              }}
                            >
                              <button
                                onClick={() => handleQtyChange(item, -1)}
                                disabled={item.quantity <= 1}
                                style={{ padding: '0.3rem 0.6rem', color: item.quantity <= 1 ? 'var(--color-secondary)' : 'var(--color-primary)' }}
                              >
                                <Minus size={11} />
                              </button>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQtyChange(item, 1)}
                                style={{ padding: '0.3rem 0.6rem', color: 'var(--color-primary)' }}
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            <button
                              onClick={() => handleRemoveItem(item)}
                              title="Remove item"
                              style={{
                                color: 'var(--color-secondary)',
                                padding: '0.35rem',
                                cursor: 'pointer',
                                transition: 'color 0.2s',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-accent)')}
                              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-secondary)')}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions & Interactive Coupon Section */}
            {cartItems.length > 0 && (
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                {/* Coupon Code Input & Chips */}
                <div>
                  {appliedCoupon ? (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'rgba(52, 199, 89, 0.1)',
                        border: '1px dashed #34C759',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: '#34C759',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Tag size={13} />
                        <span>COUPON {appliedCoupon.code} APPLIED ({appliedCoupon.label})</span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        style={{ color: 'var(--color-secondary)', fontSize: '0.7rem', textDecoration: 'underline' }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="ENTER PROMO CODE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.75rem',
                            backgroundColor: 'var(--color-bg-alt)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        />
                        <button
                          onClick={() => handleApplyCoupon()}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-bg-alt)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            letterSpacing: '0.05em',
                          }}
                        >
                          APPLY
                        </button>
                      </div>

                      {/* Quick Apply Chip Shortcuts */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '0.4rem' }}>
                        <span style={{ fontSize: '0.62rem', color: 'var(--color-secondary)', fontWeight: 700 }}>TRY:</span>
                        <button
                          onClick={() => handleApplyCoupon('HAPPY20')}
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: 'var(--color-accent)',
                            border: '1px dashed var(--color-accent)',
                            padding: '2px 6px',
                            cursor: 'pointer',
                          }}
                        >
                          HAPPY20 (-20%)
                        </button>
                        <button
                          onClick={() => handleApplyCoupon('APEX10')}
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            color: 'var(--color-gold)',
                            border: '1px dashed var(--color-gold)',
                            padding: '2px 6px',
                            cursor: 'pointer',
                          }}
                        >
                          APEX10 (-$10)
                        </button>
                      </div>

                      {couponError && (
                        <div style={{ color: 'var(--color-accent)', fontSize: '0.7rem', marginTop: '0.3rem', fontWeight: 600 }}>
                          {couponError}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtotal & Discount Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
                    <span>Original Items</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#34C759', fontWeight: 800 }}>
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--color-primary)', marginTop: '0.2rem' }}>
                    <span>TOTAL</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="btn-accent"
                  style={{
                    width: '100%',
                    padding: '0.95rem',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  PROCEED TO SECURE CHECKOUT <ArrowRight size={16} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.65rem', color: 'var(--color-secondary)' }}>
                  <ShieldCheck size={13} style={{ color: 'var(--color-gold)' }} />
                  <span>256-bit Encrypted SSL Checkout • Satisfaction Guaranteed</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
