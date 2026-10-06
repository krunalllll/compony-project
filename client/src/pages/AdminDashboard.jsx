import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Users, ShoppingCart, DollarSign, Package, Upload, ArrowLeft, ArrowRight, X, Link as LinkIcon } from 'lucide-react';
import api from '../services/api';

const getImageUrl = (image) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.url || '';
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  // Form fields
  const [prodId, setProdId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('0');
  const [category, setCategory] = useState('Men');
  const [subcategory, setSubcategory] = useState('Hoodies');
  const [brand, setBrand] = useState('Happy Store');
  const [isFeatured, setIsFeatured] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState('');
  const [stock, setStock] = useState('10');
  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 4 image slots with active method toggling
  const [slots, setSlots] = useState([
    { id: 1, label: 'Primary Image', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
    { id: 2, label: 'Gallery Image 2', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
    { id: 3, label: 'Gallery Image 3', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
    { id: 4, label: 'Gallery Image 4', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
  ]);

  const fileInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  const loadResources = async () => {
    setLoadingItems(true);
    try {
      const productsRes = await api.get('/products');
      setProducts(productsRes.data);

      const usersRes = await api.get('/admin/users');
      setUsersList(usersRes.data);

      const ordersRes = await api.get('/admin/orders');
      setOrdersList(ordersRes.data);
      
      setLoadingItems(false);
    } catch (error) {
      console.error(error);
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (isAuthenticated && user?.role === 'admin') {
      if (activeTab === 'dashboard') {
        api.get('/admin/dashboard')
          .then((response) => {
            if (!ignore) {
              setStats(response.data);
              setStatsLoading(false);
            }
          })
          .catch((error) => {
            console.error(error);
            if (!ignore) setStatsLoading(false);
          });
      } else {
        Promise.all([
          api.get('/products'),
          api.get('/admin/users'),
          api.get('/admin/orders'),
        ])
          .then(([productsRes, usersRes, ordersRes]) => {
            if (!ignore) {
              setProducts(productsRes.data);
              setUsersList(usersRes.data);
              setOrdersList(ordersRes.data);
              setLoadingItems(false);
            }
          })
          .catch((error) => {
            console.error(error);
            if (!ignore) setLoadingItems(false);
          });
      }
    }
    return () => {
      ignore = true;
    };
  }, [activeTab, isAuthenticated, user]);

  const handleSizeCheckbox = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter(s => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  // Image Slots Handlers
  const handleFileChange = (index, file) => {
    if (!file) return;

    // Check file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      setFormError('Allowed formats: JPG, JPEG, PNG, WEBP');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const updatedSlots = [...slots];
    updatedSlots[index].file = file;
    updatedSlots[index].url = objectUrl;
    updatedSlots[index].sourceType = 'upload';
    setSlots(updatedSlots);
    setFormError('');
  };

  // URL input handler
  const handleTempUrlChange = (index, val) => {
    const updatedSlots = [...slots];
    updatedSlots[index].tempUrlInput = val;
    setSlots(updatedSlots);
  };

  // Validate URL format helper
  const validateImageUrl = (url) => {
    if (!url) return false;
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    return /\.(jpg|jpeg|png|webp)($|\?)/i.test(url);
  };

  const handleApplyUrl = (index) => {
    const slot = slots[index];
    const url = slot.tempUrlInput.trim();

    if (!validateImageUrl(url)) {
      setFormError('Please enter a valid image URL.');
      return;
    }

    const updatedSlots = [...slots];
    updatedSlots[index].url = url;
    updatedSlots[index].sourceType = 'url';
    updatedSlots[index].file = null;
    setSlots(updatedSlots);
    setFormError('');
  };

  const handleToggleInputMethod = (index, method) => {
    const updatedSlots = [...slots];
    updatedSlots[index].inputMethod = method;
    // Clear slot value when toggling source method to avoid broken state
    updatedSlots[index].url = '';
    updatedSlots[index].file = null;
    updatedSlots[index].tempUrlInput = '';
    setSlots(updatedSlots);
    setFormError('');
  };

  const handleRemoveSlot = (index) => {
    const updatedSlots = [...slots];
    updatedSlots[index].file = null;
    updatedSlots[index].url = '';
    updatedSlots[index].tempUrlInput = '';
    setSlots(updatedSlots);
    if (fileInputRefs[index].current) {
      fileInputRefs[index].current.value = '';
    }
  };

  const handleMoveSlot = (index, direction) => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= 4) return;

    const newSlots = [...slots];
    // Swap content of slots (file, url, sourceType, inputMethod, tempUrlInput)
    const tempFile = newSlots[index].file;
    const tempUrl = newSlots[index].url;
    const tempSourceType = newSlots[index].sourceType;
    const tempInputMethod = newSlots[index].inputMethod;
    const tempUrlInput = newSlots[index].tempUrlInput;

    newSlots[index].file = newSlots[targetIndex].file;
    newSlots[index].url = newSlots[targetIndex].url;
    newSlots[index].sourceType = newSlots[targetIndex].sourceType;
    newSlots[index].inputMethod = newSlots[targetIndex].inputMethod;
    newSlots[index].tempUrlInput = newSlots[targetIndex].tempUrlInput;

    newSlots[targetIndex].file = tempFile;
    newSlots[targetIndex].url = tempUrl;
    newSlots[targetIndex].sourceType = tempSourceType;
    newSlots[targetIndex].inputMethod = tempInputMethod;
    newSlots[targetIndex].tempUrlInput = tempUrlInput;

    setSlots(newSlots);
  };

  // Drag and Drop callbacks
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (slots[index].inputMethod !== 'upload') return; // Only allow drop when upload method active
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(index, e.dataTransfer.files[0]);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('discount', discount);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('stock', stock);
    formData.append('brand', brand);
    formData.append('isFeatured', isFeatured);
    formData.append('sizes', JSON.stringify(sizes));

    const colorsArray = colors.split(',').map(c => c.trim()).filter(c => c);
    formData.append('colors', JSON.stringify(colorsArray));

    // Slots construction
    const metadata = [];
    let fileIndex = 0;
    let totalImages = 0;

    // Frontend validation: URL checks and counts
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      if (slot.file || slot.url) {
        totalImages++;
      }
      if (slot.sourceType === 'url' && slot.url) {
        if (!validateImageUrl(slot.url)) {
          setFormError('Please enter a valid image URL.');
          setSubmitting(false);
          return;
        }
      }
    }

    if (totalImages > 4) {
      setFormError('Maximum 4 images allowed per product.');
      setSubmitting(false);
      return;
    }

    slots.forEach((slot) => {
      if (slot.file) {
        metadata.push({ sourceType: 'upload', type: 'file', index: fileIndex });
        formData.append('images', slot.file);
        fileIndex++;
      } else if (slot.url && !slot.url.startsWith('blob:')) {
        metadata.push({ sourceType: slot.sourceType, url: slot.url });
      }
    });

    formData.append('imageMetadata', JSON.stringify(metadata));

    try {
      if (prodId) {
        await api.put(`/products/${prodId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormSuccess('Product updated successfully!');
      } else {
        await api.post('/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setFormSuccess('Product created successfully!');
      }

      resetForm();
      loadResources();
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      setFormError(error.response?.data?.message || 'Transaction failed');
      setSubmitting(false);
    }
  };

  const handleEditInit = (product) => {
    setProdId(product._id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setDiscount(product.discount.toString());
    setCategory(product.category);
    setSubcategory(product.subcategory);
    setBrand(product.brand || 'Happy Store');
    setIsFeatured(product.isFeatured || false);
    setSizes(product.sizes || []);
    setColors((product.colors || []).join(', '));
    setStock(product.stock.toString());

    // Map existing images to slots
    const loadedSlots = [
      { id: 1, label: 'Primary Image', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
      { id: 2, label: 'Gallery Image 2', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
      { id: 3, label: 'Gallery Image 3', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
      { id: 4, label: 'Gallery Image 4', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
    ];

    if (product.images) {
      product.images.forEach((img, idx) => {
        if (idx < 4) {
          const urlStr = getImageUrl(img);
          const type = img.sourceType || (urlStr.startsWith('/uploads') ? 'upload' : 'url');
          loadedSlots[idx].url = urlStr;
          loadedSlots[idx].sourceType = type;
          loadedSlots[idx].inputMethod = type;
          if (type === 'url') {
            loadedSlots[idx].tempUrlInput = urlStr;
          }
        }
      });
    }
    setSlots(loadedSlots);
    setFormError('');
    setFormSuccess('');
  };

  const resetForm = () => {
    setProdId('');
    setName('');
    setDescription('');
    setPrice('');
    setDiscount('0');
    setCategory('Men');
    setSubcategory('Hoodies');
    setBrand('Happy Store');
    setIsFeatured(false);
    setSizes([]);
    setColors('');
    setStock('10');
    setSlots([
      { id: 1, label: 'Primary Image', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
      { id: 2, label: 'Gallery Image 2', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
      { id: 3, label: 'Gallery Image 3', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
      { id: 4, label: 'Gallery Image 4', file: null, url: '', sourceType: 'upload', inputMethod: 'upload', tempUrlInput: '' },
    ]);
    fileInputRefs.forEach(ref => {
      if (ref.current) ref.current.value = '';
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      try {
        await api.delete(`/products/${productId}`);
        loadResources();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      loadResources();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-accent)' }}>ACCESS DENIED. ADMINISTRATIVE SCOPE ONLY.</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-accent)', fontWeight: 800, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Scope: Administrator</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.25rem' }}>
            CONTROL PANEL
          </h1>
        </div>

        {/* Dashboard Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
          {['dashboard', 'products', 'users', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.5rem 1.25rem',
                color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-secondary)',
                backgroundColor: activeTab === tab ? 'var(--color-surface-hover)' : 'transparent',
                border: '1px solid',
                borderColor: activeTab === tab ? 'var(--color-border-hover)' : 'transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Metrics */}
        {activeTab === 'dashboard' && (
          <div>
            {statsLoading ? (
              <div>Loading admin statistics...</div>
            ) : stats && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                  {[
                    { label: 'Total Sales', val: `$${stats.metrics.totalSales.toFixed(2)}`, icon: <DollarSign size={20} /> },
                    { label: 'Total Orders', val: stats.metrics.totalOrders, icon: <ShoppingCart size={20} /> },
                    { label: 'Total Users', val: stats.metrics.totalUsers, icon: <Users size={20} /> },
                    { label: 'Products In Catalog', val: stats.metrics.totalProducts, icon: <Package size={20} /> },
                  ].map((stat, i) => (
                    <div key={i} className="glass" style={{ padding: '1.5rem', border: '1px solid var(--color-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                        {stat.icon}
                      </div>
                      <span style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Recent Transactions */}
                <div className="glass" style={{ padding: '2rem', border: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Recent Transactions</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}>
                          <th style={{ padding: '0.75rem 0' }}>ORDER ID</th>
                          <th>CUSTOMER</th>
                          <th>TOTAL AMOUNT</th>
                          <th>SHIPPING STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentOrders.map((order) => (
                          <tr key={order._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '1rem 0', fontWeight: 750 }}>#{order._id.slice(-8).toUpperCase()}</td>
                            <td>{order.userId?.name || 'Guest'}</td>
                            <td style={{ fontWeight: 800, color: 'var(--color-accent)' }}>${order.totalAmount.toFixed(2)}</td>
                            <td>
                              <span style={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '0.2rem 0.5rem',
                                border: '1px solid',
                                color: order.status === 'Delivered' ? '#34C759' : '#FF9500',
                              }}>{order.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Product Management */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            
            {/* Left Side: Product Form */}
            <div className="glass" style={{ flex: '1 1 420px', padding: '2rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>
                {prodId ? 'Update Product' : 'Add New Product'}
              </h3>

              {formSuccess && <div style={{ backgroundColor: 'rgba(52, 199, 89, 0.1)', border: '1px solid #34C759', padding: '0.75rem', color: '#34C759', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>{formSuccess}</div>}
              {formError && <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-accent)', padding: '0.75rem', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>{formError}</div>}

              <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="prodName">Product Name</label>
                  <input id="prodName" required className="form-input" placeholder="Heavyweight Box Hoodie" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="prodDesc">Description</label>
                  <textarea id="prodDesc" required className="form-input" style={{ minHeight: '80px', resize: 'vertical' }} placeholder="Product details..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prodPrice">Price ($)</label>
                    <input id="prodPrice" required type="number" className="form-input" placeholder="120" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prodDisc">Discount (%)</label>
                    <input id="prodDisc" type="number" className="form-input" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prodCat">Category</label>
                    <select id="prodCat" className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                      <option value="Sneakers">Sneakers</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prodSub">Subcategory</label>
                    <input id="prodSub" required className="form-input" placeholder="Hoodies" value={subcategory} onChange={(e) => setSubcategory(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prodBrand">Brand</label>
                    <input id="prodBrand" required className="form-input" placeholder="Happy Store" value={brand} onChange={(e) => setBrand(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="prodStock">Stock Level</label>
                    <input id="prodStock" required type="number" className="form-input" placeholder="10" value={stock} onChange={(e) => setStock(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }}>
                    <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(!isFeatured)} style={{ accentColor: 'var(--color-accent)' }} />
                    Mark as Featured Product
                  </label>
                </div>

                <div>
                  <span className="form-label">Available Sizes</span>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                    {['XS', 'S', 'M', 'L', 'XL', '7', '8', '9', '10', '11', '12', '6Y', '8Y', '10Y', '12Y', 'One Size'].map((sz) => (
                      <label key={sz} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                        <input type="checkbox" checked={sizes.includes(sz)} onChange={() => handleSizeCheckbox(sz)} />
                        {sz}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prodColors">Colors (comma-separated)</label>
                  <input id="prodColors" className="form-input" placeholder="Slate Black, Off-White" value={colors} onChange={(e) => setColors(e.target.value)} />
                </div>

                {/* Slots-based Dual Image Source Uploader (Max 4 slots) */}
                <div>
                  <span className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>Product Images (Max 4 slots)</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {slots.map((slot, index) => (
                      <div
                        key={slot.id}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        style={{
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-bg-alt)',
                          padding: '1rem',
                        }}
                      >
                        {/* Slot Label & Source Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: index === 0 ? 'var(--color-gold)' : 'var(--color-primary)' }}>
                            {slot.label} {index === 0 && '(Primary)'}
                          </span>
                          
                          {/* Toggle Upload vs URL (Only shown when slot is empty) */}
                          {!slot.url && (
                            <div style={{ display: 'flex', gap: '0.4rem', border: '1px solid var(--color-border)', padding: '0.15rem' }}>
                              <button
                                type="button"
                                onClick={() => handleToggleInputMethod(index, 'upload')}
                                style={{
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  padding: '0.2rem 0.5rem',
                                  backgroundColor: slot.inputMethod === 'upload' ? 'var(--color-surface-hover)' : 'transparent',
                                  color: slot.inputMethod === 'upload' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                  textTransform: 'uppercase'
                                }}
                              >
                                Upload
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleInputMethod(index, 'url')}
                                style={{
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  padding: '0.2rem 0.5rem',
                                  backgroundColor: slot.inputMethod === 'url' ? 'var(--color-surface-hover)' : 'transparent',
                                  color: slot.inputMethod === 'url' ? 'var(--color-primary)' : 'var(--color-secondary)',
                                  textTransform: 'uppercase'
                                }}
                              >
                                URL
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Input UI Area */}
                        {slot.url ? (
                          /* Preview state */
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '80px', height: '100px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                              <img src={slot.url} alt={slot.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              <span style={{ fontSize: '0.62rem', color: 'var(--color-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>
                                Source: {slot.sourceType}
                              </span>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {/* Move buttons */}
                                <button
                                  type="button"
                                  onClick={() => handleMoveSlot(index, 'left')}
                                  disabled={index === 0}
                                  style={{ padding: '0.35rem', border: '1px solid var(--color-border)', color: index === 0 ? 'var(--color-border)' : 'var(--color-primary)' }}
                                >
                                  <ArrowLeft size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveSlot(index, 'right')}
                                  disabled={index === 3}
                                  style={{ padding: '0.35rem', border: '1px solid var(--color-border)', color: index === 3 ? 'var(--color-border)' : 'var(--color-primary)' }}
                                >
                                  <ArrowRight size={12} />
                                </button>
                                {/* Remove button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(index)}
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    border: '1px solid var(--color-accent)',
                                    color: 'var(--color-accent)',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  Remove
                                </button>
                                {/* Replace button */}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSlot(index)} // Clearing triggers the input choices again
                                  style={{
                                    padding: '0.35rem 0.75rem',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-primary)',
                                    fontSize: '0.65rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  Replace
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Input State */
                          <div>
                            {slot.inputMethod === 'upload' ? (
                              <div
                                onClick={() => fileInputRefs[index].current.click()}
                                style={{
                                  height: '100px',
                                  border: '1px dashed var(--color-border)',
                                  backgroundColor: 'var(--color-bg)',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  gap: '0.4rem',
                                }}
                              >
                                <Upload size={16} style={{ color: 'var(--color-secondary)' }} />
                                <span style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                  Drag file here or click to upload
                                </span>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                  type="text"
                                  className="form-input"
                                  style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem' }}
                                  placeholder="Paste image URL (ends with .jpg, .png, .webp)"
                                  value={slot.tempUrlInput}
                                  onChange={(e) => handleTempUrlChange(index, e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyUrl(index); } }}
                                />
                                <button
                                  type="button"
                                  onClick={() => handleApplyUrl(index)}
                                  className="btn-primary"
                                  style={{
                                    padding: '0 1rem',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem'
                                  }}
                                >
                                  <LinkIcon size={12} />
                                  Apply
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              ref={fileInputRefs[index]}
                              onChange={(e) => handleFileChange(index, e.target.files[0])}
                              style={{ display: 'none' }}
                              accept="image/jpeg,image/png,image/webp"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="submit" disabled={submitting} className="btn-accent" style={{ flex: 1, padding: '0.85rem 0' }}>
                    {submitting ? 'PROCESSING...' : prodId ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                  </button>
                  {prodId && (
                    <button type="button" onClick={resetForm} className="btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>Cancel</button>
                  )}
                </div>
              </form>
            </div>

            {/* Right Side: Catalog List */}
            <div className="glass" style={{ flex: '2 1 500px', padding: '2rem', border: '1px solid var(--color-border)', height: 'fit-content' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Catalog Management</h3>
              {loadingItems ? (
                <div>Loading products...</div>
              ) : (
                <div style={{ overflowY: 'auto', maxHeight: '680px' }} className="hide-scrollbar">
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}>
                        <th style={{ padding: '0.5rem 0' }}>GARMENT</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => {
                        const firstImage = p.images && p.images.length > 0 ? getImageUrl(p.images[0]) : '';
                        return (
                          <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '0.75rem 0', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {firstImage ? (
                                <img src={firstImage} alt={p.name} style={{ width: '30px', height: '35px', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '30px', height: '35px', backgroundColor: 'var(--color-surface)' }} />
                              )}
                              <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                            </td>
                            <td>{p.category}</td>
                            <td style={{ fontWeight: 800 }}>${p.price}</td>
                            <td>{p.stock}</td>
                            <td>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={() => handleEditInit(p)} style={{ padding: '0.25rem', color: 'var(--color-secondary)' }}>
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDeleteProduct(p._id)} style={{ padding: '0.25rem', color: 'var(--color-accent)' }}>
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users list */}
        {activeTab === 'users' && (
          <div className="glass" style={{ padding: '2rem', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Registered Users</h3>
            {loadingItems ? (
              <div>Loading users...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}>
                      <th style={{ padding: '0.5rem 0' }}>USER NAME</th>
                      <th>EMAIL</th>
                      <th>ROLE</th>
                      <th>CREATION DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '0.75rem 0', fontWeight: 700 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.5rem',
                            backgroundColor: u.role === 'admin' ? 'rgba(212,175,55,0.1)' : 'var(--color-surface)',
                            color: u.role === 'admin' ? 'var(--color-gold)' : 'var(--color-secondary)',
                            border: '1px solid',
                            borderColor: u.role === 'admin' ? 'var(--color-gold)' : 'var(--color-border)',
                          }}>{u.role}</span>
                        </td>
                        <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders list */}
        {activeTab === 'orders' && (
          <div className="glass" style={{ padding: '2rem', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Transactional Orders</h3>
            {loadingItems ? (
              <div>Loading orders...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.75rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-secondary)' }}>
                      <th style={{ padding: '0.5rem 0' }}>ORDER ID</th>
                      <th>CUSTOMER</th>
                      <th>DELIVERY ADDRESS</th>
                      <th>TOTAL CHARGED</th>
                      <th>STATUS CONTROL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((o) => (
                      <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '1rem 0', fontWeight: 700 }}>#{o._id.toUpperCase()}</td>
                        <td>
                          <div style={{ fontWeight: 700 }}>{o.userId?.name}</div>
                          <div style={{ color: 'var(--color-secondary)', fontSize: '0.65rem' }}>{o.userId?.email}</div>
                        </td>
                        <td>
                          {o.address.street}, {o.address.city}, {o.address.state} {o.address.zipCode}
                        </td>
                        <td style={{ fontWeight: 800, color: 'var(--color-accent)' }}>${o.totalAmount.toFixed(2)}</td>
                        <td>
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusUpdate(o._id, e.target.value)}
                            style={{
                              padding: '0.4rem',
                              backgroundColor: 'var(--color-surface)',
                              color: 'var(--color-primary)',
                              border: '1px solid var(--color-border)',
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              outline: 'none',
                              borderRadius: '4px',
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
