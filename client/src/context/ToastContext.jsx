import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Heart, AlertCircle, Info, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ToastContext = createContext(null);

export const ToastProvider = ({ children, onOpenCart }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({
    title,
    message,
    type = 'success', // 'success', 'cart', 'wishlist', 'error', 'info'
    image = null,
    actionText = null,
    onAction = null,
    duration = 4000,
  }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, message, type, image, actionText, onAction, duration };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'cart':
        return <ShoppingBag size={18} style={{ color: 'var(--color-primary)' }} />;
      case 'wishlist':
        return <Heart size={18} fill="var(--color-accent)" stroke="var(--color-accent)" />;
      case 'error':
        return <AlertCircle size={18} style={{ color: 'var(--color-accent)' }} />;
      case 'info':
        return <Info size={18} style={{ color: '#0A84FF' }} />;
      default:
        return <CheckCircle2 size={18} style={{ color: '#30D158' }} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxWidth: '380px',
          width: 'calc(100vw - 40px)',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              style={{
                pointerEvents: 'auto',
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-premium)',
                padding: '12px 16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '4px',
              }}
            >
              {/* Product Thumbnail if available */}
              {toast.image ? (
                <div style={{ width: '48px', height: '58px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-border)', borderRadius: '2px' }}>
                  <img src={toast.image} alt="toast" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getIcon(toast.type)}
                </div>
              )}

              {/* Toast Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {toast.title && (
                  <div
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'var(--color-primary)',
                      marginBottom: '2px',
                    }}
                  >
                    {toast.title}
                  </div>
                )}
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-secondary)',
                    fontWeight: 500,
                    lineHeight: 1.3,
                    wordBreak: 'break-word',
                  }}
                >
                  {toast.message}
                </div>

                {/* Optional Action Button */}
                {toast.actionText && (
                  <button
                    onClick={() => {
                      if (toast.onAction) toast.onAction();
                      removeToast(toast.id);
                    }}
                    style={{
                      marginTop: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--color-accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {toast.actionText} <ArrowRight size={12} />
                  </button>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  padding: '4px',
                  color: 'var(--color-secondary)',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                <X size={15} />
              </button>

              {/* Auto-dismiss progress line */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  height: '2px',
                  backgroundColor: toast.type === 'cart' || toast.type === 'wishlist' ? 'var(--color-accent)' : 'var(--color-gold)',
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      addToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
};

export default ToastContext;
