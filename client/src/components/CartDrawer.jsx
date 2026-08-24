import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItemAsync, removeCartItemAsync } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const totalAmount = cartItems.reduce((acc, item) => {
    if (!item.productId) return acc;
    const finalPrice = item.productId.discount > 0 
      ? item.productId.price * (1 - item.productId.discount / 100)
      : item.productId.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  const handleQtyChange = (item, diff) => {
    const newQty = item.quantity + diff;
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
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout?checkout=true');
  };

  const shippingThreshold = 150;
  const progressPercent = Math.min((totalAmount / shippingThreshold) * 100, 100);

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
              zIndex: 1050,
            }}
          />

          {/* Sliding Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              maxWidth: '420px',
              backgroundColor: 'var(--color-bg-alt)',
              borderLeft: '1px solid var(--color-border)',
              zIndex: 1100,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
              borderBottom: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} />
                <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Bag ({cartItems.length})</span>
              </div>
              <button onClick={onClose} style={{ padding: '0.5rem', color: 'var(--color-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Free Shipping Indicator */}
            {cartItems.length > 0 && (
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', letterSpacing: '0.03em' }}>
                  {totalAmount >= shippingThreshold ? (
                    <span style={{ color: 'var(--color-gold)' }}>CONGRATS! FREE STANDARD SHIPPING UNLOCKED</span>
                  ) : (
                    <span>ADD <strong style={{ color: 'var(--color-accent)' }}>${(shippingThreshold - totalAmount).toFixed(2)}</strong> MORE FOR FREE SHIPPING</span>
                  )}
                  <span>${totalAmount.toFixed(2)} / ${shippingThreshold}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    backgroundColor: totalAmount >= shippingThreshold ? 'var(--color-gold)' : 'var(--color-accent)',
                    transition: 'width 0.4s ease',
                  }} />
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
              {cartItems.length === 0 ? (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  color: 'var(--color-secondary)',
                  textAlign: 'center',
                }}>
                  <ShoppingBag size={44} style={{ strokeWidth: 1.5 }} />
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.05em' }}>Your Bag is Empty</h3>
                    <p style={{ fontSize: '0.75rem' }}>Fill it with premium garments.</p>
                  </div>
                  <button onClick={onClose} className="btn-primary" style={{ fontSize: '0.7rem', marginTop: '1rem' }}>
                    Shop Now
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

                    return (
                      <div key={idx} style={{
                        display: 'flex',
                        gap: '1rem',
                        paddingBottom: '1.25rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      }}>
                        <img
                          src={product.images && product.images[0]}
                          alt={product.name}
                          style={{ width: '80px', height: '100px', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                        />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <h4 style={{
                                fontSize: '0.8rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.02em',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                paddingRight: '0.5rem',
                              }}>{product.name}</h4>
                              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>${(finalPrice * item.quantity).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.7rem', color: 'var(--color-secondary)', marginTop: '0.25rem', fontWeight: 700 }}>
                              <span>SIZE: {item.size}</span>
                              {item.color && <span>COLOR: {item.color}</span>}
                            </div>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              border: '1px solid var(--color-border)',
                            }}>
                              <button onClick={() => handleQtyChange(item, -1)} disabled={item.quantity <= 1} style={{ padding: '0.25rem 0.5rem', color: item.quantity <= 1 ? '#444' : '#fff' }}>
                                <Minus size={10} />
                              </button>
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                              <button onClick={() => handleQtyChange(item, 1)} style={{ padding: '0.25rem 0.5rem' }}>
                                <Plus size={10} />
                              </button>
                            </div>

                            <button onClick={() => handleRemoveItem(item)} style={{ color: 'var(--color-secondary)', padding: '0.25rem' }}>
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Subtotal Checkout actions */}
            {cartItems.length > 0 && (
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-bg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  <span>SUBTOTAL</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 600, lineHeight: 1.4 }}>
                  Taxes and shipping calculated at checkout. Members enjoy reduced rates and free return pickups.
                </div>
                <button onClick={handleCheckout} className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                  SECURE CHECKOUT
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
