import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, ArrowLeft, Check, Share2, Clipboard, MessageSquare, ShieldCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import { addToCartAsync } from '../redux/cartSlice';
import { addToWishlistAsync, removeFromWishlistAsync } from '../redux/wishlistSlice';
import ProductCard from '../components/ProductCard';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Recommendations lists
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Active Tab
  const [activeTab, setActiveTab] = useState('description');

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Share Toast
  const [showShareToast, setShowShareToast] = useState(false);

  const isWishlisted = wishlistProducts.some((item) => (item._id || item) === id);

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

        // 1. Related Products (Same category, up to 4 items)
        const related = allProducts
          .filter((p) => p.category === prodData.category && p._id !== id)
          .slice(0, 4);
        setRelatedProducts(related);

        // 2. Similar Products (Same subcategory, up to 4 items)
        const similar = allProducts
          .filter((p) => p.subcategory === prodData.subcategory && p._id !== id)
          .slice(0, 4);
        setSimilarProducts(similar);

        // 3. Recently Viewed Products
        const recentProds = allProducts
          .filter((p) => recentList.includes(p._id) && p._id !== id)
          // Sort to match recentList order
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
  }, [id]);

  // SEO tags and JSON-LD schema
  useEffect(() => {
    if (!product) return;

    // SEO Title
    document.title = `${product.name} | ${product.brand} | HAPPY STORE`;

    // SEO Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', product.description.slice(0, 160));

    // Open Graph Tags
    const setOgTag = (property, content) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', product.name);
    setOgTag('og:description', product.description.slice(0, 160));
    setOgTag('og:type', 'product');
    setOgTag('og:url', window.location.href);
    if (product.images && product.images.length > 0) {
      setOgTag('og:image', getImageUrl(product.images[0]));
    }

    // Product Schema (JSON-LD)
    let schemaScript = document.getElementById('product-jsonld-schema');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('id', 'product-jsonld-schema');
      schemaScript.setAttribute('type', 'application/ld+json');
      document.head.appendChild(schemaScript);
    }

    const priceVal = product.discount > 0 
      ? (product.price * (1 - product.discount / 100)).toFixed(2)
      : product.price;

    const schemaObj = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images ? product.images.map((img) => getImageUrl(img)) : [],
      "description": product.description,
      "brand": {
        "@type": "Brand",
        "name": product.brand
      },
      "sku": product._id,
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "USD",
        "price": priceVal,
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.ratings || 4.5,
        "reviewCount": product.reviewsCount || 1
      }
    };
    schemaScript.innerHTML = JSON.stringify(schemaObj);

    return () => {
      if (schemaScript) {
        schemaScript.remove();
      }
    };
  }, [product]);

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>FETCHING PRODUCT SPECIFICS...</span>
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
    ? (product.price * (1 - product.discount / 100)).toFixed(2)
    : null;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAddingToCart(true);
    await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      size: selectedSize || 'Free Size',
      color: selectedColor || 'Default',
    }));
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    await dispatch(addToCartAsync({
      productId: product._id,
      quantity,
      size: selectedSize || 'Free Size',
      color: selectedColor || 'Default',
    }));
    navigate('/checkout?checkout=true');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (isWishlisted) {
      dispatch(removeFromWishlistAsync(product._id));
    } else {
      dispatch(addToWishlistAsync(product._id));
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
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2500);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess('');
    setSubmittingReview(true);

    try {
      const response = await api.post(`/products/${product._id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      setReviewSuccess('Thank you! Review added.');
      setReviewComment('');
      setProduct(response.data.product); // Update local product details
      setSubmittingReview(false);
    } catch (error) {
      console.error(error);
      setReviewError(error.response?.data?.message || 'Failed to submit review');
      setSubmittingReview(false);
    }
  };

  // Review Stars summary counter
  const starCounts = [0, 0, 0, 0, 0]; // index 0 is 5 star, 1 is 4 star, etc.
  if (product.reviews && product.reviews.length > 0) {
    product.reviews.forEach(r => {
      const idx = 5 - r.rating;
      if (idx >= 0 && idx < 5) {
        starCounts[idx]++;
      }
    });
  }

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Back navigation */}
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', marginBottom: '2.5rem' }}>
          <ArrowLeft size={16} /> Back to Catalog
        </button>

        {/* Product view columns grid */}
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          
          {/* Left: Interactive Product Gallery */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden', border: '1px solid var(--color-border)', position: 'relative' }}>
              <img src={activeImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {product.discount > 0 && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 5 }} className="badge-discount">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail selector strip (max 4 images) */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                {product.images.map((img, idx) => {
                  const url = getImageUrl(img);
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(url)}
                      style={{
                        width: '72px',
                        height: '90px',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: activeImage === url ? 'var(--color-primary)' : 'var(--color-border)',
                        opacity: activeImage === url ? 1 : 0.5,
                        transition: '0.2s',
                      }}
                    >
                      <img src={url} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Product details description */}
          <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Title / Brand */}
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-accent)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {product.brand} // {product.category}
              </span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '0.5rem', lineHeight: 1.1 }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 700, marginTop: '0.35rem' }}>
                <span>SKU: {product._id.slice(-8).toUpperCase()}</span>
                <span>•</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-gold)' }}>
                  <Star size={12} fill="var(--color-gold)" stroke="none" />
                  <span style={{ color: '#fff', fontWeight: 800 }}>{product.ratings || 4.5} ({product.reviewsCount || 0} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '1.25rem 0' }}>
              {discountPrice ? (
                <>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent)' }}>${discountPrice}</span>
                  <span style={{ fontSize: '1.3rem', color: 'var(--color-secondary)', textDecoration: 'line-through' }}>${product.price}</span>
                </>
              ) : (
                <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>${product.price}</span>
              )}
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', lineHeight: 1.6, fontWeight: 500 }}>
              {product.description}
            </p>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>Colors</span>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        border: '1px solid',
                        borderColor: selectedColor === color ? '#fff' : 'var(--color-border)',
                        backgroundColor: selectedColor === color ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                        textTransform: 'uppercase',
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>Sizes</span>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        width: '42px',
                        height: '42px',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        border: '1px solid',
                        borderColor: selectedSize === size ? '#fff' : 'var(--color-border)',
                        backgroundColor: selectedSize === size ? 'var(--color-surface-hover)' : 'var(--color-bg-alt)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--color-border)', width: 'fit-content', marginTop: '0.5rem' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ padding: '0.45rem 1rem', fontSize: '0.9rem', fontWeight: 800 }}>-</button>
                <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800 }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} style={{ padding: '0.45rem 1rem', fontSize: '0.9rem', fontWeight: 800 }}>+</button>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addingToCart}
                  className="btn-primary"
                  style={{ flex: 1, padding: '1rem 0' }}
                >
                  <ShoppingCart size={15} />
                  {product.stock <= 0 ? 'SOLD OUT' : addingToCart ? 'ADDING...' : 'ADD TO BAG'}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className="btn-secondary"
                  style={{ padding: '1rem', color: isWishlisted ? 'var(--color-accent)' : '#fff', borderColor: isWishlisted ? 'var(--color-accent)' : 'var(--color-border)' }}
                >
                  <Heart size={18} fill={isWishlisted ? 'var(--color-accent)' : 'none'} />
                </button>

                <button
                  onClick={handleShareProduct}
                  className="btn-secondary"
                  style={{ padding: '1rem' }}
                >
                  <Share2 size={18} />
                </button>
              </div>

              {product.stock > 0 && (
                <button
                  onClick={handleBuyNow}
                  className="btn-accent"
                  style={{ width: '100%', padding: '1rem 0' }}
                >
                  BUY IT NOW
                </button>
              )}
            </div>

            {/* Delivery / Stock status bar info */}
            <div style={{
              padding: '1.25rem',
              backgroundColor: 'var(--color-bg-alt)',
              border: '1px solid var(--color-border)',
              fontSize: '0.78rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontWeight: 600,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: product.stock > 5 ? '#34C759' : 'var(--color-accent)' }}>
                <span>AVAILABILITY STATUS</span>
                <span>{product.stock > 0 ? `In Stock (${product.stock} items remaining)` : 'Out of Stock'}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-secondary)' }}>
                <Check size={12} style={{ color: 'var(--color-gold)' }} />
                <span>Priority Standard Shipping (2-3 business days)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-secondary)' }}>
                <Check size={12} style={{ color: 'var(--color-gold)' }} />
                <span>Heavyweight fabric material grading checks</span>
              </div>
            </div>

          </div>

        </div>

        {/* Share Link Toast */}
        <AnimatePresence>
          {showShareToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: 'var(--color-primary)',
                color: '#000',
                padding: '0.75rem 1.5rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 2000,
                boxShadow: '0px 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <Clipboard size={14} />
              PRODUCT LINK COPIED TO CLIPBOARD
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Tabs Description specifications area */}
        <div style={{ marginTop: '5rem', borderTop: '1px solid var(--color-border)', paddingTop: '3rem' }}>
          
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem', overflowX: 'auto' }} className="hide-scrollbar">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'additional', label: 'Additional Info' },
              { id: 'reviews', label: `Reviews (${product.reviews?.length || 0})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab.id ? 800 : 600,
                  color: activeTab === tab.id ? '#fff' : 'var(--color-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  position: 'relative',
                  paddingBottom: '1rem',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span style={{ position: 'absolute', bottom: '-17px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--color-accent)' }} />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div style={{ minHeight: '200px' }}>
            
            {/* Description Tab (Rich text mock) */}
            {activeTab === 'description' && (
              <div style={{ fontSize: '0.88rem', color: 'var(--color-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p>{product.description}</p>
                <p>Designed with streetwear culture and daily utility in mind. Every garment features careful stitching alignments, pre-shrunk heavyweight structures, and minimal premium branding elements to coordinate with your wardrobe essentials.</p>
                <h4 style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, marginTop: '1rem', textTransform: 'uppercase' }}>Key Details:</h4>
                <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>Heavyweight weave grading for premium posture structure.</li>
                  <li>Deep ribbed cuffs and hem linings preventing outline expansions.</li>
                  <li>Double layered hood structure or multi-stitched seams.</li>
                  <li>Eco-friendly organic dyes offering subtle industrial washes.</li>
                </ul>
              </div>
            )}

            {/* Specifications Tab (Table layout) */}
            {activeTab === 'specifications' && (
              <div style={{ maxWidth: '600px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                  <tbody>
                    {[
                      { key: 'Fit', val: 'Oversized Boxy Silhouette' },
                      { key: 'Material', val: '100% Organic Heavyweight Cotton (450GSM)' },
                      { key: 'Origin', val: 'Made in Portugal' },
                      { key: 'Washing', val: 'Wash cold inside out, tumble dry low or flat air-dry' },
                      { key: 'Branding', val: 'High-density matte print / clean tone-on-tone embroidery' },
                    ].map((spec, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 800, color: '#fff', textTransform: 'uppercase', fontSize: '0.75rem', width: '180px' }}>{spec.key}</td>
                        <td style={{ padding: '1rem 0', color: 'var(--color-secondary)' }}>{spec.val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Additional Info Tab */}
            {activeTab === 'additional' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Shipping & Returns</h4>
                  <p>All items in stock ship from our central logistic center. Deliveries arrive within 2-3 business days. We provide free return shipping pickups for Apex VIP Circle members. Return claims must be filed within 14 days of delivery in original unused condition.</p>
                </div>
                <div>
                  <h4 style={{ color: '#fff', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Sizing Details</h4>
                  <p>Fits boxy and slightly oversized. If you prefer a regular fit, we recommend selecting one size smaller than your standard sizing. Cap accessories feature adjustable metal slider strapbacks fitting up to 62cm.</p>
                </div>
              </div>
            )}

            {/* Reviews Tab (Summary, List, Form) */}
            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', gap: '3.5rem', flexWrap: 'wrap' }}>
                
                {/* Rating Summary column */}
                <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{product.ratings || 4.5}</h3>
                    <div style={{ display: 'flex', color: 'var(--color-gold)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={15} fill={i < Math.round(product.ratings || 4.5) ? 'var(--color-gold)' : 'none'} stroke="var(--color-gold)" />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 700 }}>Based on {product.reviews?.length || 0} customer reviews</span>
                  </div>

                  {/* Star breakdown bars */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    {[5, 4, 3, 2, 1].map((stars, idx) => {
                      const count = starCounts[idx];
                      const total = product.reviews?.length || 1;
                      const percentage = Math.min(((count / total) * 100), 100);
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 700 }}>
                          <span style={{ width: '40px' }}>{stars} Stars</span>
                          <div style={{ flex: 1, height: '4px', backgroundColor: 'var(--color-border)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${percentage}%`, height: '100%', backgroundColor: 'var(--color-gold)' }} />
                          </div>
                          <span style={{ width: '20px', textAlign: 'right' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reviews List & Submission Form */}
                <div style={{ flex: '2 1 450px', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  
                  {/* Review Submit Form */}
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
                                style={{ color: val <= reviewRating ? 'var(--color-gold)' : 'var(--color-secondary)' }}
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
                        You must be <Link to="/login" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 700 }}>Logged In</Link> to submit a product review.
                      </div>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>Customer Feedback</h4>
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((rev) => (
                        <div key={rev._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '1rem' }}>
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

        {/* related / similar / recently viewed grids */}
        
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

        {/* RECENTLY VIEWED PRODUCTS */}
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
    </div>
  );
};

export default ProductDetails;
