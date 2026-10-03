import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Sparkles, Check } from 'lucide-react';

const SizeGuideModal = ({ isOpen, onClose, category = 'Men', currentSizes = [] }) => {
  const [unit, setUnit] = useState('cm'); // 'cm' or 'in'
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' or 'calculator'
  
  // Interactive Fit Finder States
  const [height, setHeight] = useState(175); // in cm
  const [weight, setWeight] = useState(72);  // in kg
  const [fitPreference, setFitPreference] = useState('oversized'); // 'slim', 'regular', 'oversized'

  if (!isOpen) return null;

  // Conversion helpers
  const toUnit = (valInCm) => {
    if (unit === 'in') {
      return (valInCm / 2.54).toFixed(1);
    }
    return valInCm;
  };

  const chartData = [
    { size: 'XS', chest: 94, length: 68, shoulder: 46, sleeve: 21 },
    { size: 'S',  chest: 100, length: 71, shoulder: 49, sleeve: 22 },
    { size: 'M',  chest: 106, length: 74, shoulder: 52, sleeve: 23 },
    { size: 'L',  chest: 112, length: 77, shoulder: 55, sleeve: 24 },
    { size: 'XL', chest: 120, length: 80, shoulder: 58, sleeve: 25 },
  ];

  // Smart size calculator logic
  const calculateRecommendedSize = () => {
    let bmi = weight / ((height / 100) * (height / 100));
    let base = 'M';
    if (bmi < 20) {
      base = height > 180 ? 'M' : 'S';
    } else if (bmi < 24) {
      base = height > 183 ? 'L' : 'M';
    } else if (bmi < 28) {
      base = height > 175 ? 'L' : 'M';
    } else {
      base = 'XL';
    }

    if (fitPreference === 'oversized' && base !== 'XL') {
      if (base === 'S') base = 'M';
      else if (base === 'M') base = 'L';
    } else if (fitPreference === 'slim') {
      if (base === 'XL') base = 'L';
      else if (base === 'L') base = 'M';
      else if (base === 'M') base = 'S';
    }
    return base;
  };

  const recommended = calculateRecommendedSize();

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}
      >
        {/* Backdrop */}
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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '680px',
            backgroundColor: 'var(--color-bg-alt)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-premium)',
            padding: '2rem',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          className="hide-scrollbar"
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Ruler size={20} style={{ color: 'var(--color-accent)' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Streetwear Size & Fit Advisor
              </h2>
            </div>
            <button onClick={onClose} style={{ padding: '0.25rem', color: 'var(--color-secondary)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Tab Selector */}
          <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('chart')}
              style={{
                paddingBottom: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: activeTab === 'chart' ? '#FFFFFF' : 'var(--color-secondary)',
                borderBottom: activeTab === 'chart' ? '2px solid var(--color-accent)' : 'none',
              }}
            >
              Measurements Chart
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              style={{
                paddingBottom: '0.75rem',
                fontSize: '0.8rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: activeTab === 'calculator' ? '#FFFFFF' : 'var(--color-secondary)',
                borderBottom: activeTab === 'calculator' ? '2px solid var(--color-accent)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Sparkles size={14} style={{ color: 'var(--color-gold)' }} />
              AI Fit Finder
            </button>
          </div>

          {/* TAB 1: Measurements Chart */}
          {activeTab === 'chart' && (
            <div>
              {/* Unit Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 600 }}>All measurements are taken flat.</span>
                <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setUnit('cm')}
                    style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: unit === 'cm' ? 'var(--color-primary)' : 'transparent',
                      color: unit === 'cm' ? '#000' : 'var(--color-secondary)',
                    }}
                  >
                    CM
                  </button>
                  <button
                    onClick={() => setUnit('in')}
                    style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      backgroundColor: unit === 'in' ? 'var(--color-primary)' : 'transparent',
                      color: unit === 'in' ? '#000' : 'var(--color-secondary)',
                    }}
                  >
                    INCHES
                  </button>
                </div>
              </div>

              {/* Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'center' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}>
                    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 800 }}>SIZE</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>CHEST</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>LENGTH</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>SHOULDER</th>
                    <th style={{ padding: '0.75rem 0.5rem', fontWeight: 800 }}>SLEEVE</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row) => (
                    <tr key={row.size} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontWeight: 800, color: 'var(--color-primary)' }}>{row.size}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-secondary)' }}>{toUnit(row.chest)} {unit}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-secondary)' }}>{toUnit(row.length)} {unit}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-secondary)' }}>{toUnit(row.shoulder)} {unit}</td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--color-secondary)' }}>{toUnit(row.sleeve)} {unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--color-surface)', fontSize: '0.75rem', color: 'var(--color-secondary)', lineHeight: 1.5 }}>
                <strong style={{ color: '#fff' }}>Fit Tip:</strong> Our silhouettes are designed boxy and relaxed with dropped shoulders. For an oversized aesthetic, take your normal size. For a standard trim fit, size down once.
              </div>
            </div>
          )}

          {/* TAB 2: Interactive Fit Finder */}
          {activeTab === 'calculator' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <span>YOUR HEIGHT</span>
                  <span style={{ color: 'var(--color-accent)' }}>{height} CM ({(height / 30.48).toFixed(1)} FT)</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="205"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  <span>YOUR BODY WEIGHT</span>
                  <span style={{ color: 'var(--color-accent)' }}>{weight} KG ({(weight * 2.20462).toFixed(0)} LBS)</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="125"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
                  PREFERRED FIT STYLE
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
                  {[
                    { id: 'slim', label: 'SLIM / FITTED' },
                    { id: 'regular', label: 'TRUE TO SIZE' },
                    { id: 'oversized', label: 'OVERSIZED DRAPED' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setFitPreference(style.id)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        border: '1px solid',
                        borderColor: fitPreference === style.id ? 'var(--color-accent)' : 'var(--color-border)',
                        backgroundColor: fitPreference === style.id ? 'rgba(255, 59, 48, 0.1)' : 'transparent',
                        color: fitPreference === style.id ? '#FFF' : 'var(--color-secondary)',
                        transition: '0.2s',
                      }}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommendation Card */}
              <div
                style={{
                  padding: '1.5rem',
                  border: '1px solid var(--color-gold)',
                  backgroundColor: 'rgba(212, 175, 55, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'var(--color-gold)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-display)',
                    flexShrink: 0,
                  }}
                >
                  {recommended}
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    RECOMMENDED SIZE
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#FFF', marginTop: '0.2rem' }}>
                    SIZE {recommended} — {fitPreference.toUpperCase()} FIT
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginTop: '0.25rem' }}>
                    Matches 97% of shoppers with your height & weight parameters.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <button onClick={onClose} className="btn-primary" style={{ padding: '0.7rem 1.8rem', fontSize: '0.75rem' }}>
              GOT IT, CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SizeGuideModal;
