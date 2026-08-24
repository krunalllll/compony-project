import React, { useState, useEffect, useRef } from 'react';
import { Search, X, History, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SearchBar = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        try {
          const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
          setSuggestions(response.data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  const handleSearchSubmit = (searchQuery) => {
    if (!searchQuery.trim()) return;

    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    setQuery('');
    setSuggestions([]);
    onClose();
    // Redirect to Category page with search query parameter
    navigate(`/men?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="search-bar-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10, 10, 12, 0.96)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      padding: '3rem 1.5rem',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
        {/* Input Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderBottom: '2px solid var(--color-primary)',
          paddingBottom: '0.75rem',
          position: 'relative',
        }}>
          <Search size={24} style={{ color: 'var(--color-secondary)', marginRight: '1rem' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH STREETWEAR, SNEAKERS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              width: '100%',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          />
          <button onClick={onClose} style={{ padding: '0.5rem', marginLeft: '1rem' }}>
            <X size={24} />
          </button>
        </div>

        {/* Suggestion & Recent list */}
        <div style={{ marginTop: '2.5rem' }}>
          {suggestions.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', letterSpacing: '0.1rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Suggestions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {suggestions.map((item) => (
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
                      padding: '0.75rem',
                      backgroundColor: 'var(--color-bg-alt)',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      transition: '0.2s',
                    }}
                    className="glow-hover"
                  >
                    <img src={item.images[0]} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}>{item.category} • ${item.price}</div>
                    </div>
                    <CornerDownLeft size={16} style={{ color: 'var(--color-secondary)' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {suggestions.length === 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', letterSpacing: '0.1rem', textTransform: 'uppercase' }}>Recent Searches</h3>
                {recentSearches.length > 0 && (
                  <button onClick={clearRecentSearches} style={{ fontSize: '0.7rem', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 800 }}>Clear All</button>
                )}
              </div>

              {recentSearches.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {recentSearches.map((search, i) => (
                    <div
                      key={i}
                      onClick={() => handleSearchSubmit(search)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      <History size={14} style={{ color: 'var(--color-secondary)' }} />
                      {search}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>No recent queries. Try searching "hoodie" or "sneakers".</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
