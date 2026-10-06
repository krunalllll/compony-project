import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import ProductCard from './ProductCard';
import { useCurrency } from '../context/CurrencyContext';

// Skeleton Loader Component
const SkeletonGrid = () => (
  <div className="product-grid" style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '2.5rem 1.5rem',
    width: '100%'
  }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '40%', height: '10px', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '90%', height: '16px', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s infinite ease-in-out' }} />
        <div style={{ width: '30%', height: '14px', backgroundColor: 'var(--color-surface)', animation: 'pulse 1.5s infinite ease-in-out' }} />
      </div>
    ))}
    <style>{`
      @keyframes pulse {
        0% { opacity: 0.6; }
        50% { opacity: 0.3; }
        100% { opacity: 0.6; }
      }
    `}</style>
  </div>
);

const CategoryPage = ({ defaultCategory }) => {
  const { formatPrice } = useCurrency();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // API Products State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync defaultCategory when category page changes
  const [prevDefaultCategory, setPrevDefaultCategory] = useState(defaultCategory);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState(defaultCategory ? [defaultCategory] : []);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [maxPrice, setMaxPrice] = useState(300);
  const [availability, setAvailability] = useState(''); // 'inStock', 'outOfStock', ''
  const [onSale, setOnSale] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Sort State
  const [sortBy, setSortBy] = useState('newest');

  if (prevDefaultCategory !== defaultCategory) {
    setPrevDefaultCategory(defaultCategory);
    setSelectedCategories(defaultCategory ? [defaultCategory] : []);
    setSelectedSubcategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setMaxPrice(300);
    setAvailability('');
    setOnSale(false);
    setMinRating(0);
    setSortBy('newest');
  }

  // Mobile Drawers
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);

  // Collapsible Filters (Desktop/Tablet)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Options Data
  const categoriesList = ['Men', 'Women', 'Kids', 'Sneakers', 'Accessories'];
  const subcategoriesList = ['T Shirts', 'Shirts', 'Hoodies', 'Jackets', 'Jeans', 'Cargo', 'Joggers', 'Shorts', 'Sneakers', 'Caps', 'Bags'];
  const sizesList = ['XS', 'S', 'M', 'L', 'XL', '7', '8', '9', '10', '11', '12', '6Y', '8Y', '10Y', '12Y', 'One Size'];
  const colorsList = ['Slate Black', 'Off-White', 'Acid Grey', 'Olive Drab', 'Midnight Black', 'Desert Sand', 'Cyber Pink', 'Matte Black', 'Chalk White', 'Solar Flare Yellow', 'Carbon Grey', 'Sunset Amber', 'Charcoal Grey', 'Neon White', 'Triple Black', 'Desert Sandstone', 'Obsidian Black', 'Stone Wash Grey', 'Deep Indigo Blue'];
  const brandsList = ['Apex Collective', 'Terrain Labs', 'Asphalt Rebel', 'Happy Store'];

  // SEO Optimization
  useEffect(() => {
    const categoryTitle = searchQuery ? `Search results for "${searchQuery}"` : (defaultCategory ? defaultCategory.toUpperCase() : 'CATALOGUE');
    document.title = `${categoryTitle} | HAPPY STORE Streetwear`;

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', window.location.href);

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Shop premium heavyweight box tees, paratrooper cargo pants, technical windbreakers, and runners in the HAPPY STORE ${categoryTitle} collection.`);
  }, [defaultCategory, searchQuery]);

  // Fetch products from server
  useEffect(() => {
    let ignore = false;
    const loadFilteredProducts = async () => {
      try {
        let endpoint = `/products?`;
        const params = new URLSearchParams();

        if (searchQuery) {
          endpoint = `/products/search?q=${encodeURIComponent(searchQuery)}`;
        } else {
          // Categories
          if (selectedCategories.length > 0) {
            params.append('category', selectedCategories.join(','));
          }
          // Subcategories
          if (selectedSubcategories.length > 0) {
            params.append('subcategory', selectedSubcategories.join(','));
          }
          // Brand
          if (selectedBrands.length > 0) {
            params.append('brand', selectedBrands.join(','));
          }
          // Sizes
          if (selectedSizes.length > 0) {
            params.append('sizes', selectedSizes.join(','));
          }
          // Colors
          if (selectedColors.length > 0) {
            params.append('colors', selectedColors.join(','));
          }
          // Price limit
          params.append('maxPrice', maxPrice.toString());
          // Rating limit
          if (minRating > 0) {
            params.append('rating', minRating.toString());
          }
          // Availability
          if (availability) {
            params.append('availability', availability);
          }
          // Discount
          if (onSale) {
            params.append('discount', 'onSale');
          }
          // Sorting
          params.append('sort', sortBy);

          endpoint += params.toString();
        }

        const response = await api.get(endpoint);
        if (ignore) return;
        let data = response.data;

        // If search query is present, apply local filters on search results since search route is simple
        if (searchQuery) {
          if (selectedCategories.length > 0) {
            data = data.filter(p => selectedCategories.some(c => p.category.toLowerCase() === c.toLowerCase()));
          }
          if (selectedSubcategories.length > 0) {
            data = data.filter(p => selectedSubcategories.some(s => p.subcategory.toLowerCase() === s.toLowerCase()));
          }
          if (selectedBrands.length > 0) {
            data = data.filter(p => selectedBrands.some(b => p.brand.toLowerCase() === b.toLowerCase()));
          }
          if (selectedSizes.length > 0) {
            data = data.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
          }
          if (selectedColors.length > 0) {
            data = data.filter(p => p.colors.some(c => selectedColors.some(sc => sc.toLowerCase() === c.toLowerCase())));
          }
          if (maxPrice) {
            data = data.filter(p => p.price <= maxPrice);
          }
          if (minRating > 0) {
            data = data.filter(p => p.ratings >= minRating);
          }
          if (availability) {
            if (availability === 'inStock') {
              data = data.filter(p => p.stock > 0);
            } else {
              data = data.filter(p => p.stock === 0);
            }
          }
          if (onSale) {
            data = data.filter(p => p.discount > 0);
          }

          // Apply sorting on search results
          if (sortBy === 'priceAsc') {
            data.sort((a, b) => a.price - b.price);
          } else if (sortBy === 'priceDesc') {
            data.sort((a, b) => b.price - a.price);
          } else if (sortBy === 'newest') {
            data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          } else if (sortBy === 'bestSelling') {
            data.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
          } else if (sortBy === 'mostPopular') {
            data.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
          } else if (sortBy === 'featured') {
            data.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          }
        }

        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching filtered products:', error);
        if (!ignore) setLoading(false);
      }
    };

    loadFilteredProducts();
    return () => {
      ignore = true;
    };
  }, [searchQuery, selectedCategories, selectedSubcategories, selectedSizes, selectedColors, selectedBrands, maxPrice, minRating, availability, onSale, sortBy]);

  // Handler functions for checkboxes
  const handleToggle = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleClearAll = () => {
    if (!defaultCategory) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([defaultCategory]);
    }
    setSelectedSubcategories([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    setMaxPrice(300);
    setAvailability('');
    setOnSale(false);
    setMinRating(0);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    // Don't count defaultCategory as active filter if on that category page
    if (defaultCategory) {
      if (selectedCategories.length !== 1 || selectedCategories[0] !== defaultCategory) {
        count += selectedCategories.length;
      }
    } else {
      count += selectedCategories.length;
    }
    count += selectedSubcategories.length;
    count += selectedSizes.length;
    count += selectedColors.length;
    count += selectedBrands.length;
    if (maxPrice < 300) count += 1;
    if (availability) count += 1;
    if (onSale) count += 1;
    if (minRating > 0) count += 1;
    return count;
  };

  const filterCountBadge = getActiveFilterCount();

  // Sorting names helper
  const getSortName = (val) => {
    switch (val) {
      case 'featured': return 'Featured';
      case 'newest': return 'Newest';
      case 'priceAsc': return 'Price Low to High';
      case 'priceDesc': return 'Price High to Low';
      case 'bestSelling': return 'Best Selling';
      case 'mostPopular': return 'Most Popular';
      default: return 'Newest';
    }
  };


  // Render filter list elements
  const renderFilterSidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Categories Multi-Select */}
      {!defaultCategory && (
        <div>
          <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
            Categories
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {categoriesList.map(cat => (
              <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', cursor: 'pointer' }} className="checkbox-label">
                <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => handleToggle(selectedCategories, setSelectedCategories, cat)} style={{ accentColor: 'var(--color-accent)' }} />
                <span className="checkbox-text" style={{ color: selectedCategories.includes(cat) ? 'var(--color-primary)' : 'inherit', fontWeight: selectedCategories.includes(cat) ? 700 : 500 }}>{cat.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Sub Categories Multi-Select */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Subcategories
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '180px', overflowY: 'auto' }} className="hide-scrollbar">
          {subcategoriesList.map(subcat => (
            <label key={subcat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedSubcategories.includes(subcat)} onChange={() => handleToggle(selectedSubcategories, setSelectedSubcategories, subcat)} style={{ accentColor: 'var(--color-accent)' }} />
              <span style={{ color: selectedSubcategories.includes(subcat) ? 'var(--color-primary)' : 'inherit', fontWeight: selectedSubcategories.includes(subcat) ? 700 : 500 }}>{subcat.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands Filter */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Brands
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {brandsList.map(brand => (
            <label key={brand} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleToggle(selectedBrands, setSelectedBrands, brand)} style={{ accentColor: 'var(--color-accent)' }} />
              <span style={{ color: selectedBrands.includes(brand) ? 'var(--color-primary)' : 'inherit', fontWeight: selectedBrands.includes(brand) ? 700 : 500 }}>{brand.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          Price Range
        </h4>
        <input
          type="range"
          min="10"
          max="300"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--color-accent)', cursor: 'pointer' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '0.5rem', color: 'var(--color-secondary)', fontWeight: 800 }}>
          <span>MIN: {formatPrice(10)}</span>
          <span style={{ color: 'var(--color-primary)' }}>MAX: {formatPrice(maxPrice)}</span>
        </div>
      </div>

      {/* Size Filter Buttons Grid */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Sizes
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem' }}>
          {sizesList.map(size => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => handleToggle(selectedSizes, setSelectedSizes, size)}
                style={{
                  padding: '0.35rem 0',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-secondary)',
                  textAlign: 'center',
                  transition: '0.2s',
                }}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter Chips */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Colors
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '150px', overflowY: 'auto' }} className="hide-scrollbar">
          {colorsList.map(color => {
            const isSelected = selectedColors.includes(color);
            return (
              <button
                key={color}
                onClick={() => handleToggle(selectedColors, setSelectedColors, color)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: isSelected ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                  color: isSelected ? 'var(--color-primary)' : 'var(--color-secondary)',
                  textTransform: 'uppercase',
                  transition: '0.2s',
                }}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Availability
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {[
            { label: 'In Stock', value: 'inStock' },
            { label: 'Out of Stock', value: 'outOfStock' }
          ].map(opt => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', cursor: 'pointer' }}>
              <input
                type="radio"
                name="availability"
                checked={availability === opt.value}
                onChange={() => setAvailability(opt.value)}
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <span style={{ color: availability === opt.value ? 'var(--color-primary)' : 'inherit', fontWeight: availability === opt.value ? 700 : 500 }}>{opt.label.toUpperCase()}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Discount Filter */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Offers
        </h4>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-secondary)', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={onSale}
            onChange={() => setOnSale(!onSale)}
            style={{ accentColor: 'var(--color-accent)' }}
          />
          <span style={{ color: onSale ? 'var(--color-primary)' : 'inherit', fontWeight: onSale ? 700 : 500 }}>ON SALE / OFFERS</span>
        </label>
      </div>

      {/* Rating Filter */}
      <div>
        <h4 style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
          Rating
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[4, 3, 2].map(stars => (
            <button
              key={stars}
              onClick={() => setMinRating(minRating === stars ? 0 : stars)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                fontWeight: minRating === stars ? 800 : 500,
                color: minRating === stars ? 'var(--color-primary)' : 'var(--color-secondary)',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', color: 'var(--color-gold)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} fill={i < stars ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" />
                ))}
              </div>
              <span>& Up ({stars}+)</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div style={{ padding: '2rem 0', minHeight: '80vh', backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>Home</Link>
          <ChevronRight size={10} />
          {defaultCategory ? (
            <>
              <Link to={`/${defaultCategory.toLowerCase()}`} style={{ transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--color-secondary)'}>{defaultCategory}</Link>
              {selectedSubcategories.length === 1 && (
                <>
                  <ChevronRight size={10} />
                  <span style={{ color: 'var(--color-primary)' }}>{selectedSubcategories[0]}</span>
                </>
              )}
            </>
          ) : (
            <span style={{ color: 'var(--color-primary)' }}>Search Results</span>
          )}
        </div>

        {/* Category Header Title Block */}
        <div style={{
          position: 'relative',
          padding: '3rem 2.5rem',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-alt)',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.85)), url(${
            defaultCategory?.toLowerCase() === 'men'
              ? 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1600&q=80'
              : defaultCategory?.toLowerCase() === 'women'
              ? 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80'
              : defaultCategory?.toLowerCase() === 'kids'
              ? 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=1600&q=80'
              : defaultCategory?.toLowerCase() === 'sneakers'
              ? 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=80'
              : 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1600&q=80'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-accent)',
            fontSize: '0.68rem',
            fontWeight: 800,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '0.6rem',
          }}>
            HAPPY STORE // ARCHIVE DROP 04
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', lineHeight: 1.05 }}>
            {searchQuery ? `Search Results: "${searchQuery}"` : (defaultCategory ? `${defaultCategory}'s Collection` : 'All Apparel')}
          </h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.02em', marginTop: '0.6rem', maxWidth: '640px', lineHeight: 1.5 }}>
            {searchQuery 
              ? `Displaying all garments matching your query. Filter by size, silhouette, and brand below.`
              : (defaultCategory === 'Men' ? 'Heavyweight 480GSM loopback terry hoodies, modular paratrooper cargo pants, and boxy cut tees engineered for modern urban utility.' 
              : defaultCategory === 'Women' ? 'Editorial techwear pieces, high-waisted utilitarian silhouettes, cropped drop-shoulder fits, and minimalist luxury layers.'
              : defaultCategory === 'Kids' ? 'Scaled-down miniature streetwear silhouettes crafted with 100% pre-shrunk combed cotton for maximum durability and play comfort.'
              : defaultCategory === 'Sneakers' ? 'Sculpted chunky EVA foam midsoles, retro vulcanised low-tops, and high-performance technical street kicks.'
              : 'Our complete streetwear archive showcasing precision draping, custom-milled textiles, and timeless utilitarian silhouettes.')}
          </p>
        </div>

        {/* Toolbar Header (Total Count & Collapse control & Sort select) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid var(--color-border)',
          paddingBottom: '1.25rem',
          marginBottom: '2rem',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          {/* Collapse sidebar controls + count */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              style={{
                display: 'none', // Shown on desktop & tablet
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                border: '1px solid var(--color-border)',
                padding: '0.5rem 1rem',
                backgroundColor: isSidebarCollapsed ? 'transparent' : 'var(--color-surface)',
                transition: '0.2s',
              }}
              className="desktop-filter-toggle-btn"
            >
              <SlidersHorizontal size={14} />
              {isSidebarCollapsed ? 'Show Filters' : 'Hide Filters'}
            </button>

            {/* Mobile Filter Drawer trigger */}
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              style={{
                display: 'none', // Shown on mobile only
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: 'var(--color-primary)',
                textTransform: 'uppercase',
                border: '1px solid var(--color-border)',
                padding: '0.5rem 1rem',
              }}
              className="mobile-filter-trigger-btn"
            >
              <Filter size={14} />
              Filter
              {filterCountBadge > 0 && (
                <span style={{ backgroundColor: 'var(--color-accent)', color: '#fff', borderRadius: '50%', width: '15px', height: '15px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '0.6rem' }}>
                  {filterCountBadge}
                </span>
              )}
            </button>

            <span style={{ fontSize: '0.75rem', color: 'var(--color-secondary)', fontWeight: 700, letterSpacing: '0.02em' }}>
              {products.length} Garments Found
            </span>
          </div>

          {/* Desktop Sort Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="desktop-sort-wrapper">
            <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.5rem 1.5rem 0.5rem 0.75rem',
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-primary)',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="bestSelling">Best Selling</option>
              <option value="mostPopular">Most Popular</option>
            </select>
          </div>

          {/* Mobile Sort Trigger */}
          <button
            onClick={() => setIsSortDrawerOpen(true)}
            style={{
              display: 'none', // Mobile only
              fontSize: '0.75rem',
              fontWeight: 800,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              border: '1px solid var(--color-border)',
              padding: '0.5rem 1rem',
            }}
            className="mobile-sort-trigger-btn"
          >
            Sort: {getSortName(sortBy)}
          </button>
        </div>

        {/* Active Filter Chips Bar */}
        {filterCountBadge > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '0.85rem 1rem', backgroundColor: 'var(--color-bg-alt)', border: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Filters:</span>
            
            {/* Category Chips */}
            {(!defaultCategory) && selectedCategories.map(cat => (
              <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                {cat}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => handleToggle(selectedCategories, setSelectedCategories, cat)} />
              </span>
            ))}

            {/* Subcategory Chips */}
            {selectedSubcategories.map(subcat => (
              <span key={subcat} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                {subcat}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => handleToggle(selectedSubcategories, setSelectedSubcategories, subcat)} />
              </span>
            ))}

            {/* Brands Chips */}
            {selectedBrands.map(brand => (
              <span key={brand} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                {brand}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => handleToggle(selectedBrands, setSelectedBrands, brand)} />
              </span>
            ))}

            {/* Sizes Chips */}
            {selectedSizes.map(size => (
              <span key={size} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                Size: {size}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => handleToggle(selectedSizes, setSelectedSizes, size)} />
              </span>
            ))}

            {/* Colors Chips */}
            {selectedColors.map(color => (
              <span key={color} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                {color}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => handleToggle(selectedColors, setSelectedColors, color)} />
              </span>
            ))}

            {/* Price Chip */}
            {maxPrice < 300 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                Under {formatPrice(maxPrice)}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => setMaxPrice(300)} />
              </span>
            )}

            {/* Availability Chip */}
            {availability && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                {availability === 'inStock' ? 'In Stock' : 'Out of Stock'}
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => setAvailability('')} />
              </span>
            )}

            {/* Sale Chip */}
            {onSale && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                Offers / Sale
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => setOnSale(false)} />
              </span>
            )}

            {/* Rating Chip */}
            {minRating > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', padding: '0.2rem 0.5rem', textTransform: 'uppercase' }}>
                {minRating}+ Stars
                <X size={12} style={{ cursor: 'pointer', color: 'var(--color-accent)' }} onClick={() => setMinRating(0)} />
              </span>
            )}

            {/* Clear All Button */}
            <button
              onClick={handleClearAll}
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: 'var(--color-accent)',
                textTransform: 'uppercase',
                marginLeft: 'auto',
                letterSpacing: '0.05em'
              }}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Area: Sidebar Filter + Product Grid */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'flex-start' }}>
          
          {/* Desktop Left Sidebar (Only visible when not collapsed) */}
          {!isSidebarCollapsed && (
            <div className="desktop-sidebar-filters" style={{
              flex: '0 0 260px',
              position: 'sticky',
              top: '120px',
              maxHeight: 'calc(100vh - 160px)',
              overflowY: 'auto',
              paddingRight: '0.5rem',
            }}>
              {renderFilterSidebarContent()}
            </div>
          )}

          {/* Product Grid Area */}
          <div style={{ flex: 1, width: '100%' }}>
            {loading ? (
              <SkeletonGrid />
            ) : products.length > 0 ? (
              <div className="category-product-responsive-grid">
                {products.map(prod => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            ) : (
              <div style={{
                minHeight: '350px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                border: '1px dashed var(--color-border)',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: 'var(--color-secondary)'
              }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>No Garments Match Filter Conditions</span>
                <p style={{ fontSize: '0.8rem', maxWidth: '400px', lineHeight: 1.4 }}>Try broadening your choices, resetting the price threshold slider, or clearing active filters.</p>
                <button onClick={handleClearAll} className="btn-secondary" style={{ fontSize: '0.75rem' }}>
                  RESET ALL FILTERS
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* MOBILE/TABLET FILTER DRAWER */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1800 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' }}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '85%',
                maxWidth: '360px',
                backgroundColor: 'var(--color-bg-alt)',
                borderRight: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-premium)'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filters</span>
                  {filterCountBadge > 0 && (
                    <span style={{ backgroundColor: 'var(--color-accent)', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem' }}>
                      {filterCountBadge}
                    </span>
                  )}
                </div>
                <button onClick={() => setIsFilterDrawerOpen(false)} style={{ padding: '0.25rem' }}>
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable filters */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }} className="hide-scrollbar">
                {renderFilterSidebarContent()}
              </div>

              {/* Footer actions */}
              <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', display: 'flex', gap: '0.75rem' }}>
                <button onClick={handleClearAll} className="btn-secondary" style={{ flex: 1, padding: '0.65rem 0', fontSize: '0.7rem' }}>CLEAR ALL</button>
                <button onClick={() => setIsFilterDrawerOpen(false)} className="btn-primary" style={{ flex: 1, padding: '0.65rem 0', fontSize: '0.7rem' }}>APPLY FILTERS</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE SORT DRAWER */}
      <AnimatePresence>
        {isSortDrawerOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1800 }}>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSortDrawerOpen(false)}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#000' }}
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'var(--color-bg-alt)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '60vh',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sort Options</span>
                <button onClick={() => setIsSortDrawerOpen(false)} style={{ padding: '0.25rem' }}>
                  <X size={18} />
                </button>
              </div>

              {/* List of Options */}
              <div style={{ padding: '1rem 0', overflowY: 'auto' }}>
                {['featured', 'newest', 'priceAsc', 'priceDesc', 'bestSelling', 'mostPopular'].map(opt => {
                  const isSelected = sortBy === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortBy(opt);
                        setIsSortDrawerOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '1rem 1.5rem',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 800 : 500,
                        backgroundColor: isSelected ? 'var(--color-surface)' : 'transparent',
                        color: isSelected ? 'var(--color-accent)' : 'var(--color-primary)',
                        display: 'block',
                      }}
                    >
                      {getSortName(opt).toUpperCase()}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        /* Responsive CSS Rules for Category Page layout */
        .category-product-responsive-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2.5rem 1.5rem;
        }

        @media (max-width: 1200px) {
          .category-product-responsive-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .desktop-sidebar-filters {
            display: none !important;
          }
          .desktop-filter-toggle-btn {
            display: none !important;
          }
          .mobile-filter-trigger-btn {
            display: inline-flex !important;
          }
          .desktop-sort-wrapper {
            display: none !important;
          }
          .mobile-sort-trigger-btn {
            display: inline-block !important;
          }
          .category-product-responsive-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem 0.85rem;
          }
        }

        @media (min-width: 901px) {
          .desktop-filter-toggle-btn {
            display: inline-flex !important;
          }
        }
      `}</style>

    </div>
  );
};

export default CategoryPage;
