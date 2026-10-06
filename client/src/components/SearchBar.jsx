import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { useCurrency } from '../context/CurrencyContext';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../redux/cartSlice';
import { useToast } from '../context/ToastContext';

const POPULAR_SEARCHES = ['Oversized Hoodie', 'Paratrooper Cargo', 'Retro Runners', 'Boxy Tees', 'Sneakers', 'Streetwear Cap'];

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Debounced search suggestions
  useEffect(() => {
    if (query.trim().length <= 1) {
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
        setSuggestions(response.data || []);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;

    const updated = [q.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== q.trim().toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setQuery('');
    setSuggestions([]);
    onClose();
    navigate(`/men?search=${encodeURIComponent(q.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        onClose();
        navigate(`/products/${suggestions[selectedIndex]._id}`);
      } else {
        handleSearchSubmit(query);
      }
    }
  };

  const handleQuickAdd = async (e, prod) => {
    e.stopPropagation();
    const size = prod.sizes?.[0] || 'Free Size';
    const color = prod.colors?.[0] || 'Default';

    await dispatch(addToCartAsync({
      productId: prod._id,
      quantity: 1,
      size,
      color,
      product: prod,
    }));

    addToast({
      title: 'Added to Bag',
      message: `${prod.name} (${size})`,
      type: 'cart',
      image: prod.images?.[0]?.url || prod.images?.[0],
      actionText: 'View Bag',
      onAction: () => {
        window.dispatchEvent(new CustomEvent('open-cart-drawer'));
      },
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(10, 10, 12, 0.95)',
          zIndex: 3000,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          overflowY: 'auto',
          padding: '2.5rem 1.5rem',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div style={{ maxWidth: '780px', width: '100%', margin: '0 auto' }}>
          
          {/* Search Header Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '2px solid var(--color-primary)',
              paddingBottom: '0.85rem',
              position: 'relative',
            }}
          >
            <Search size={26} style={{ color: 'var(--color-accent)', marginRight: '1rem', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH APPAREL, HOODIES, SNEAKERS..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                fontWeight: 800,
                width: '100%',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#FFF',
                outline: 'none',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{ padding: '0.4rem', color: 'var(--color-secondary)', marginRight: '0.5rem', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: '0.5rem',
                color: 'var(--color-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={24} />
            </button>
          </div>

          {/* Shortcut hint */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--color-secondary)', marginTop: '0.5rem', fontWeight: 600 }}>
            <span>PRESS <strong style={{ color: '#FFF' }}>ESC</strong> TO CLOSE</span>
            <span>USE <strong style={{ color: '#FFF' }}>↑ ↓</strong> TO NAVIGATE • <strong style={{ color: '#FFF' }}>ENTER</strong> TO SELECT</span>
          </div>

          {/* Dynamic Content */}
          <div style={{ marginTop: '2.5rem' }}>
            
            {/* Live Search Suggestions Results */}
            {query.trim().length > 1 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {loading ? 'SEARCHING CATALOG...' : `${suggestions.length} MATCHING PRODUCTS`}
                  </span>
                  {suggestions.length > 0 && (
                    <button
                      onClick={() => handleSearchSubmit(query)}
                      style={{ fontSize: '0.72rem', color: '#FFF', fontWeight: 800, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      VIEW ALL RESULTS <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                {suggestions.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {suggestions.slice(0, 6).map((item, idx) => {
                      const img = item.images?.[0]?.url || item.images?.[0];
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={item._id}
                          onClick={() => {
                            onClose();
                            navigate(`/products/${item._id}`);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.75rem 1rem',
                            backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                            border: '1px solid',
                            borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                          className="glow-hover"
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <div style={{ width: '48px', height: '58px', flexShrink: 0, overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                            <img src={img} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', marginTop: '2px', fontWeight: 600 }}>
                              {item.category} • <strong style={{ color: 'var(--color-primary)' }}>{formatPrice(item.price)}</strong>
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleQuickAdd(e, item)}
                            style={{
                              padding: '0.45rem 0.85rem',
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-primary)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer',
                              borderRadius: '2px',
                            }}
                            title="Quick Add to Bag"
                          >
                            <ShoppingBag size={12} /> ADD
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  !loading && (
                    <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-secondary)' }}>
                      <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>No exact matches found for "{query}"</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Try searching generic categories like "Hoodie", "Sneakers", or "Jeans".</p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Popular Searches & Recent Searches (When search input is short) */}
            {query.trim().length <= 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                
                {/* Popular Tags */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
                    <Sparkles size={13} style={{ color: 'var(--color-gold)' }} />
                    TRENDING SEARCHES
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {POPULAR_SEARCHES.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchSubmit(term)}
                        style={{
                          padding: '0.5rem 1rem',
                          backgroundColor: 'var(--color-bg-alt)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-primary)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-accent)';
                          e.currentTarget.style.color = 'var(--color-accent)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.color = 'var(--color-primary)';
                        }}
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        RECENT SEARCHES
                      </span>
                      <button
                        onClick={clearRecentSearches}
                        style={{ fontSize: '0.68rem', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 800, cursor: 'pointer' }}
                      >
                        CLEAR ALL
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchSubmit(term)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.45rem 0.9rem',
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            color: 'var(--color-secondary)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          <History size={13} />
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchBar;
