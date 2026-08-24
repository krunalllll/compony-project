import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const MenuAccordion = ({ title, items, onLinkClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
      {/* Accordion Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          padding: '1.1rem 1.5rem',
          fontSize: '0.85rem',
          fontWeight: 800,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: isOpen ? '#FFFFFF' : 'var(--color-secondary)',
          cursor: 'pointer',
        }}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden', backgroundColor: 'rgba(255, 255, 255, 0.01)' }}
          >
            <div
              style={{
                padding: '0.5rem 1.5rem 1.25rem 1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={onLinkClick}
                  style={{
                    fontSize: '0.82rem',
                    color: 'var(--color-secondary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                    padding: '0.1rem 0',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--color-secondary)';
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuAccordion;
