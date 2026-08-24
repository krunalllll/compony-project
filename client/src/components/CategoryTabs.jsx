import React from 'react';

const CategoryTabs = ({ categories, activeTab, onTabChange }) => {
  return (
    <div
      style={{
        display: 'flex',
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(255, 255, 255, 0.01)',
        width: '100%',
      }}
    >
      {categories.map((cat) => {
        const isActive = activeTab === cat;
        return (
          <button
            key={cat}
            onClick={() => onTabChange(cat)}
            style={{
              flex: 1,
              padding: '1.25rem 0',
              textAlign: 'center',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: isActive ? 'var(--color-accent)' : 'var(--color-secondary)',
              borderBottom: isActive ? '3px solid var(--color-accent)' : '3px solid transparent',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryTabs;
