import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, image, path, onClick }) => {
  return (
    <Link
      to={path}
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
        flexShrink: 0,
        width: '75px',
        cursor: 'pointer',
      }}
      className="category-card-hover"
    >
      <div
        style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
        }}
        className="category-card-image-container"
      >
        <img
          src={image}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="category-card-img"
        />
      </div>
      <span
        style={{
          marginTop: '0.5rem',
          fontSize: '0.65rem',
          fontWeight: 800,
          color: 'var(--color-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textAlign: 'center',
          width: '100%',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </span>
    </Link>
  );
};

export default CategoryCard;
