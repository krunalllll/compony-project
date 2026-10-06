import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ArrowLeft, Check, Share2, Ruler, Truck, Flame, Clock } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { addToCartAsync } from '../redux/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync } from '../redux/wishlistSlice';
import ProductCard from '../components/ProductCard';
import SizeGuideModal from '../components/SizeGuideModal';
import { useToast } from '../context/ToastContext';
import { useCurrency } from '../context/CurrencyContext';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const { formatPrice } = useCurrency();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Recommendations lists
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState('description');

  // Sticky Bar visibility
  const [showStickyBar, setShowStickyBar] = useState(false);
  const buyBoxRef = useRef(null);

  // Image zoom lens state
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef(null);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isWishlisted = wishlistProducts.some((item) => (item._id || item) === id);

  // Sticky add to cart scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        // Show sticky bar once user scrolls past the buy box
        setShowStickyBar(rect.bottom < 0);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch product data & suggestions
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        const prodData = response.data;
        setProduct(prodData);
        if (prodData.images && prodData.images.length > 0) {
          setActiveImage(getImageUrl(prodData.images[0]));
        }
        
        if (prodData.sizes && prodData.sizes.length > 0) {
          setSelectedSize(prodData.sizes[0]);
        }
        if (prodData.colors && prodData.colors.length > 0) {
          setSelectedColor(prodData.colors[0]);
        }
        setQuantity(1);

        // Add to recently viewed list in localStorage
        let recentList = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        recentList = [id, ...recentList.filter((item) => item !== id)].slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(recentList));

        // Fetch all products to create recommendations
        const allProductsRes = await api.get('/products');
        const allProducts = allProductsRes.data;

        // 1. Related Products
        const related = allProducts
          .filter((p) => p.category === prodData.category && p._id !== id)
          .slice(0, 4);
        setRelatedProducts(related);

        // 2. Similar Products
        const similar = allProducts
          .filter((p) => p.subcategory === prodData.subcategory && p._id !== id)
          .slice(0, 4);
        setSimilarProducts(similar);

        // 3. Recently Viewed Products
        const recentProds = allProducts
          .filter((p) => recentList.includes(p._id) && p._id !== id)
          .sort((a, b) => recentList.indexOf(a._id) - recentList.indexOf(b._id))
          .slice(0, 4);
        setRecentlyViewed(recentProds);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>
          SYNCHRONIZING GARMENT SPECIFICATIONS...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg)', gap: '1rem' }}>
        <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>GARMENT NOT IN RECORDS</span>
        <button onClick={() => navigate('/')} className="btn-secondary" style={{ fontSize: '0.75rem' }}>BACK TO HOME</button>
      </div>
    );
  }

  const discountPrice = product.discount > 0 
    ? (product.price * (1 - product.discount / 100))
    : null;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      size: selectedSize || 'Free Size',
      color: selectedColor || 'Default',
      product,
    }));
    setAddingToCart(false);

    addToast({
      title: 'Added to Bag',
      message: `${product.name} (Size: ${selectedSize || 'Free Size'})`,
      type: 'cart',
      image: activeImage,
      actionText: 'View Bag',
      onAction: () => {
        window.dispatchEvent(new CustomEvent('open-cart-drawer'));
      },
    });
  };

  const handleBuyNow = async () => {
    await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      size: selectedSize || 'Free Size',
      color: selectedColor || 'Default',
      product,
    }));
    navigate('/checkout?checkout=true');
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(product._id));
      addToast({
        title: 'Removed from Wishlist',
        message: `${product.name} removed from your saved collection`,
        type: 'info',
      });
    } else {
      dispatch(addToWishlistAsync(product));
      addToast({
        title: 'Saved to Wishlist',
        message: `${product.name} saved to your collection`,
        type: 'wishlist',
      });
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        title: 'Link Copied',
        message: 'Product URL copied to clipboard',
        type: 'success',
      });
    }
  };

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const response = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess('Thank you! Review added.');
      setReviewComment('');
      setProduct(response.data.product);
      setSubmittingReview(false);
      addToast({
        title: 'Review Submitted',
        message: 'Thank you for community feedback!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      setReviewError(error.response?.data?.message || 'Failed to submit review');
      setSubmittingReview(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Breadcrumb / Back button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>

          {/* Social Share Button */}
          <button
            onClick={handleShareProduct}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', cursor: 'pointer' }}
          >
            <Share2 size={15} /> Share Product
          </button>
        </div>

        {/* Product Columns Grid */}
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          
          {/* Left: Interactive Fabric Magnifier Gallery */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Main Interactive Zoom Area */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              style={{
                width: '100%',
                aspectRatio: '4/5',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                position: 'relative',
                cursor: 'crosshair',
                backgroundColor: 'var(--color-bg-alt)',
              }}
            >
              <img
                src={activeImage}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: isZooming ? 'scale(2.2)' : 'scale(1)',
                  transition: isZooming ? 'none' : 'transform 0.3s ease-out',
                }}
              />

              {product.discount > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 5 }} className="badge-discount">
                  -{product.discount}% OFF
                </div>
              )}

              {/* Hover Zoom Hint */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  padding: '4px 8px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  color: 'rgba(255, 255, 255, 0.7)',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Hover image to magnify fabric weave
              </div>
            </div>

            {/* Thumbnail selector strip */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto' }} className="hide-scrollbar">
                {product.images.map((img, idx) => {
                  const url = getImageUrl(img);
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(url)}
                      style={{
                        width: '74px',
                        height: '92px',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: activeImage === url ? 'var(--color-accent)' : 'var(--color-border)',
                        opacity: activeImage === url ? 1 : 0.6,
                        transition: '0.2s',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      <img src={url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product Details & Controls */}
          <div ref={buyBoxRef} style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Live Scarcity & High Demand badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              <Flame size={14} />
              <span>HIGH DEMAND: 18 PEOPLE VIEWING THIS ITEM</span>
            </div>

            {/* Title / Brand */}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {product.brand} // {product.category}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '0.4rem', lineHeight: 1.1 }}>
                {product.name}
              </h1>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 700, marginTop: '0.5rem' }}>
                <span>SKU: {product._id.slice(-8).toUpperCase()}</span>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gold)' }}>
                  <Star size={12} fill="var(--color-gold)" stroke="none" />
                  <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{product.ratings || 4.5} ({product.reviewsCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price section with Currency formatted prices */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.25rem 0' }}>
              {discountPrice ? (
                <>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-accent)' }}>
                    {formatPrice(discountPrice)}
                  </span>
                  <span style={{ fontSize: '1.3rem', color: 'var(--color-secondary)', textDecoration: 'line-through' }}>
                    {formatPrice(product.price)}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#30D158', backgroundColor: 'rgba(48, 209, 88, 0.1)', padding: '0.2rem 0.6rem' }}>
                    SAVE {product.discount}%
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)' }}>{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
              {product.description}
            </p>

            {/* Interactive Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>
                  Selected Color: <strong style={{ color: 'var(--color-primary)' }}>{selectedColor}</strong>
                </span>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedColor === color ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: selectedColor === color ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                        color: 'var(--color-primary)',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: '0.2s',
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Sizes with Size Guide Modal Trigger */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>
                    Size: <strong style={{ color: 'var(--color-primary)' }}>{selectedSize}</strong>
                  </span>
                  
                  {/* Size Guide Trigger */}
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: 'var(--color-accent)',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    <Ruler size={13} /> Size Guide & Fit Finder
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        minWidth: '46px',
                        height: '46px',
                        padding: '0 0.5rem',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        border: '1px solid',
                        borderColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)',
                        backgroundColor: selectedSize === size ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: '0.2s',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>
                Quantity
              </span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', width: 'fit-content', marginTop: '0.5rem', backgroundColor: 'var(--color-bg-alt)' }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  -
                </button>
                <span style={{ minWidth: '35px', textAlign: 'center', fontSize: '0.82rem', fontWeight: 800 }}>{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 10, q + 1))}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', gap: '0.85rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addingToCart}
                  className="btn-primary"
                  style={{ flex: 1, padding: '1.1rem 0' }}
                >
                  <ShoppingCart size={16} />
                  {product.stock <= 0 ? 'SOLD OUT' : addingToCart ? 'ADDING TO BAG...' : 'ADD TO BAG'}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="btn-secondary"
                  style={{
                    padding: '1.1rem',
                    color: isWishlisted ? 'var(--color-accent)' : 'var(--color-primary)',
                    borderColor: isWishlisted ? 'var(--color-accent)' : 'var(--color-border)',
                  }}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart size={18} fill={isWishlisted ? 'var(--color-accent)' : 'none'} />
                </button>
              </div>

              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="btn-accent"
                  style={{ width: '100%', padding: '1.1rem 0' }}
                >
                  BUY IT NOW
                </button>
              )}
            </div>

            {/* Trust and Delivery Assurance Box */}
            <div
              style={{
                padding: '1.25rem',
                backgroundColor: 'var(--color-bg-alt)',
                border: '1px solid var(--color-border)',
                fontSize: '0.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                fontWeight: 600,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#30D158' }}>
                <Check size={14} />
                <span>In Stock & Ready to Ship (Remaining: {product.stock} units)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
                <Truck size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Free Express Shipping on orders over $150</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-secondary)' }}>
                <Clock size={14} style={{ color: 'var(--color-gold)' }} />
                <span>Order in next 3 hrs to dispatch today</span>
              </div>
            </div>

          </div>

        </div>

        {/* Interactive Tabs: Description / Specs / Shipping / Reviews */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}>
          
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem', overflowX: 'auto' }} className="hide-scrollbar">
            {[
              { id: 'description', label: 'Garment Overview' },
              { id: 'specifications', label: 'Technical Specifications' },
              { id: 'additional', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  position: 'relative',
                  paddingBottom: '1rem',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.span
                    layoutId="activeTabUnderline"
                    style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--color-accent)' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div style={{ minHeight: '200px' }}>
            
            {activeTab === 'description' && (
              <div style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p>{product.description}</p>
                <p>Designed with streetwear culture and daily utility in mind. Every garment features careful stitching alignments, pre-shrunk heavyweight structures, and minimal premium branding elements to coordinate with your wardrobe essentials.</p>
                <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'uppercase' }}>Key Details:</h4>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <li>Heavyweight weave grading for premium posture structure.</li>
                  <li>Deep ribbed cuffs and hem linings preventing outline expansions.</li>
                  <li>Double layered hood structure or multi-stitched seams.</li>
                  <li>Eco-friendly organic dyes offering subtle industrial washes.</li>
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div style={{ maxWidth: '600px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <tbody>
                    {[
                      { key: 'Fit', val: 'Oversized Boxy Silhouette' },
                      { key: 'Material', val: '100% Organic Heavyweight Cotton (450GSM)' },
                      { key: 'Origin', val: 'Crafted in Portugal' },
                      { key: 'Washing', val: 'Wash cold inside out, tumble dry low or flat air-dry' },
                      { key: 'Branding', val: 'High-density matte print / clean tone-on-tone embroidery' },
                    ].map((spec, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '0.9rem 0', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', fontSize: '0.75rem', width: '180px' }}>{spec.key}</td>
                        <td style={{ padding: '0.9rem 0', color: 'var(--color-secondary)' }}>{spec.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'additional' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Shipping & Dispatch</h4>
                  <p>All items in stock ship from our central logistic center. Deliveries arrive within 2-3 business days. We provide free return shipping pickups for Apex VIP Circle members. Return claims must be filed within 14 days of delivery in original unused condition.</p>
                </div>
                <div>
                  <h4 style={{ color: 'var(--color-primary)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Sizing & Tailoring</h4>
                  <p>Fits boxy and slightly oversized. If you prefer a regular fit, we recommend selecting one size smaller than your standard sizing. Cap accessories feature adjustable metal slider strapbacks fitting up to 62cm.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
                
                {/* Rating Summary */}
                <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{product.ratings || 4.5}</h3>
                    <div style={{ display: 'flex', color: 'var(--color-gold)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill={i < Math.round(product.ratings || 4.5) ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 700 }}>Based on {product.reviews?.length || 0} customer reviews</span>
                  </div>
                </div>

                {/* Review Form & Customer Feedback */}
                <div style={{ flex: '2 1 450px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  <div className="glass" style={{ padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.25rem' }}>Submit Product Review</h4>
                    
                    {reviewSuccess && <div style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', border: '1px solid #34C759', padding: '0.75rem', color: '#34C759', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>{reviewSuccess}</div>}
                    {reviewError && <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-accent)', padding: '0.75rem', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.25rem' }}>{reviewError}</div>}

                    {isAuthenticated ? (
                      <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                          <label className="form-label" style={{ marginBottom: '0.25rem' }}>YOUR RATING</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {[1, 2, 3, 4, 5].map((val) => (
                              <button
                                key={val}
                                type="button"
                                onClick={() => setReviewRating(val)}
                                style={{ color: val <= reviewRating ? 'var(--color-gold)' : 'var(--color-secondary)', cursor: 'pointer' }}
                              >
                                <Star size={18} fill={val <= reviewRating ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" htmlFor="reviewCmt">COMMENT / REVIEW DETAILS</label>
                          <textarea
                            id="reviewCmt"
                            required
                            className="form-input"
                            style={{ minHeight: '80px', resize: 'vertical' }}
                            placeholder="Share your thoughts about sizing, fabric quality, and print durability..."
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                          />
                        </div>

                        <button type="submit" disabled={submittingReview} className="btn-accent" style={{ padding: '0.65rem 1.25rem', fontSize: '0.75rem', width: 'fit-content' }}>
                          {submittingReview ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
                        </button>
                      </form>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary)' }}>
                        You must be <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'underline', fontWeight: 700 }}>Logged In</Link> to submit a product review.
                      </div>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Customer Feedback</h4>
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>{rev.name}</span>
                            <span style={{ fontSize: '0.68rem', color: 'var(--color-secondary)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div style={{ display: 'flex', color: 'var(--color-gold)' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < rev.rating ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" />
                            ))}
                          </div>

                          <p style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', lineHeight: 1.5, marginTop: '0.2rem' }}>
                            {rev.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontStyle: 'italic' }}>No reviews yet. Be the first to review this garment!</div>
                    )}
                  </div>

                </div>

              </div>
            )}

          </div>

        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
              Related Products
            </h2>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* SIMILAR PRODUCTS */}
        {similarProducts.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
              Similar Curations
            </h2>
            <div className="product-grid">
              {similarProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED */}
        {recentlyViewed.length > 0 && (
          <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2rem' }}>
              Recently Viewed
            </h2>
            <div className="product-grid">
              {recentlyViewed.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* INTERACTIVE STICKY BOTTOM ADD TO CART BAR */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'var(--color-bg)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderTop: '1px solid var(--color-border)',
              padding: '0.75rem 2rem',
              zIndex: 1500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '50px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)' }}>{product.name}</h4>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)' }}>
                  {formatPrice(discountPrice || product.price)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {product.sizes && product.sizes.length > 0 && (
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-primary)',
                    padding: '0.55rem 1rem',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="btn-accent"
                style={{ padding: '0.65rem 1.75rem', fontSize: '0.75rem', fontWeight: 800 }}
              >
                <ShoppingCart size={14} /> ADD TO BAG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
        currentSizes={product.sizes}
      />
    </div>
  );
};

export default ProductDetails;
