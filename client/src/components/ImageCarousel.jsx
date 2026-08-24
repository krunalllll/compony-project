import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ children }) => {
  const carouselRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(3);

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 5);
      
      // Calculate dot index (0 to totalDots - 1)
      if (scrollWidth > clientWidth) {
        const percentage = scrollLeft / (scrollWidth - clientWidth);
        const index = Math.round(percentage * (totalDots - 1));
        setActiveDot(index);
      }
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      // Run initial check
      checkScroll();
      
      // Calculate total dots based on scrollWidth and clientWidth
      const dotsCount = Math.ceil(el.scrollWidth / el.clientWidth) || 3;
      setTotalDots(Math.max(dotsCount, 2));
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll);
    };
  }, [children]);

  const handleScroll = (direction) => {
    if (carouselRef.current) {
      const offset = direction === 'left' ? -200 : 200;
      carouselRef.current.scrollLeft += offset;
    }
  };

  const handleDotClick = (index) => {
    if (carouselRef.current) {
      const { scrollWidth, clientWidth } = carouselRef.current;
      const scrollTarget = (index / (totalDots - 1)) * (scrollWidth - clientWidth);
      carouselRef.current.scrollLeft = scrollTarget;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', padding: '0.5rem 0' }}>
      {/* Left Arrow Button */}
      {showLeft && (
        <button
          onClick={() => handleScroll('left')}
          style={{
            position: 'absolute',
            left: '-10px',
            top: '32px',
            zIndex: 10,
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 10, 12, 0.9)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Carousel Scroll Area */}
      <div
        ref={carouselRef}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: '0.9rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          width: '100%',
          padding: '0.25rem 0.5rem',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>

      {/* Right Arrow Button */}
      {showRight && (
        <button
          onClick={() => handleScroll('right')}
          style={{
            position: 'absolute',
            right: '-10px',
            top: '32px',
            zIndex: 10,
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 10, 12, 0.9)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Dots Indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem', marginTop: '0.5rem' }}>
        {Array.from({ length: totalDots }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            style={{
              width: activeDot === i ? '12px' : '5px',
              height: '5px',
              borderRadius: '2.5px',
              backgroundColor: activeDot === i ? 'var(--color-accent)' : 'var(--color-border-hover)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
