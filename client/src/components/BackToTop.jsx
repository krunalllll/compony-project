import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTop = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.pageYOffset / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          title="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 1000,
            boxShadow: 'var(--shadow-premium)',
            padding: 0,
          }}
        >
          {/* SVG Progress Ring */}
          <svg
            width="46"
            height="46"
            viewBox="0 0 46 46"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(-90deg)',
              pointerEvents: 'none',
            }}
          >
            <circle
              cx="23"
              cy="23"
              r={radius}
              stroke="var(--color-border)"
              strokeWidth="2.5"
              fill="transparent"
            />
            <circle
              cx="23"
              cy="23"
              r={radius}
              stroke="var(--color-primary)"
              strokeWidth="2.5"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <ArrowUp size={18} style={{ color: 'var(--color-primary)' }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
