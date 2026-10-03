import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { User, ShoppingBag, Heart, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { fetchCart, clearCart } from '../redux/cartSlice';
import { fetchWishlist } from '../redux/wishlistSlice';
import { useCurrency } from '../context/CurrencyContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { formatPrice } = useCurrency();
  const [searchParams, setSearchParams] = useSearchParams();
  const showCheckoutParam = searchParams.get('checkout') === 'true';
  const { user, isAuthenticated, checkingAuth } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistProducts = useSelector((state) => state.wishlist.products);

  const initialTab = searchParams.get('tab') || (cartItems.length > 0 ? 'checkout' : 'orders');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Address form fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const totalAmount = cartItems.reduce((acc, item) => {
    if (!item.productId) return acc;
    const finalPrice = item.productId.discount > 0 
      ? item.productId.price * (1 - item.productId.discount / 100)
      : item.productId.price;
    return acc + finalPrice * item.quantity;
  }, 0);

  useEffect(() => {
    if (!checkingAuth && !isAuthenticated && activeTab !== 'wishlist') {
      navigate('/login');
    }
  }, [isAuthenticated, checkingAuth, navigate, activeTab]);

  useEffect(() => {
    if (showCheckoutParam) {
      setActiveTab('checkout');
    }
  }, [showCheckoutParam]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated) {
        try {
          const response = await api.get('/order');
          setOrders(response.data);
          setOrdersLoading(false);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setOrdersLoading(false);
        }
      }
    };
    fetchOrders();
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    searchParams.delete('checkout');
    searchParams.set('tab', tabName);
    setSearchParams(searchParams);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) {
      setCheckoutError('Please fill out all address fields');
      return;
    }
    setCheckoutError('');
    setPlacingOrder(true);

    try {
      // 1. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setCheckoutError('Failed to load payment gateway. Please check your connection.');
        setPlacingOrder(false);
        return;
      }

      const items = cartItems.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.discount > 0 
          ? item.productId.price * (1 - item.productId.discount / 100)
          : item.productId.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.productId.images[0],
      }));

      const address = { street, city, state, zipCode, country };

      // 2. Call backend to create Order and Razorpay Order details
      const response = await api.post('/order', {
        address,
        items,
        totalAmount,
      });

      if (response.status === 201) {
        const { order, razorpayOrderId, amount, currency } = response.data;
        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id';

        // 3. Open Razorpay checkout options
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "HAPPY STORE",
          description: "Garments Purchase Checkout",
          order_id: razorpayOrderId,
          handler: async function (paymentResponse) {
            try {
              // 4. Verify Payment on Backend
              const verifyRes = await api.post('/order/verify', {
                orderId: order._id,
                razorpay_payment_id: paymentResponse.razorpay_payment_id,
                razorpay_order_id: paymentResponse.razorpay_order_id,
                razorpay_signature: paymentResponse.razorpay_signature,
              });

              if (verifyRes.data.success) {
                setOrderSuccess(true);
                dispatch(clearCart());
                
                const ordersRes = await api.get('/order');
                setOrders(ordersRes.data);

                setTimeout(() => {
                  setOrderSuccess(false);
                  handleTabChange('orders');
                }, 3000);
              }
              setPlacingOrder(false);
            } catch (err) {
              console.error(err);
              setCheckoutError(err.response?.data?.message || 'Payment verification failed. Please contact support.');
              setPlacingOrder(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: "#0A0A0C",
          },
          modal: {
            ondismiss: function () {
              setCheckoutError('Payment cancelled by user');
              setPlacingOrder(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setCheckoutError('Failed to initialize checkout. Please try again.');
        setPlacingOrder(false);
      }
    } catch (error) {
      console.error(error);
      setCheckoutError(error.response?.data?.message || 'Error placing order');
      setPlacingOrder(false);
    }
  };

  const handleBypassPlaceOrder = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) {
      setCheckoutError('Please fill out all address fields');
      return;
    }
    setCheckoutError('');
    setPlacingOrder(true);

    try {
      const items = cartItems.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.discount > 0 
          ? item.productId.price * (1 - item.productId.discount / 100)
          : item.productId.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: item.productId.images[0],
      }));

      const address = { street, city, state, zipCode, country };

      const response = await api.post('/order', {
        address,
        items,
        totalAmount,
      });

      if (response.status === 201) {
        const { order, razorpayOrderId } = response.data;
        const verifyRes = await api.post('/order/verify', {
          orderId: order._id,
          razorpay_payment_id: 'pay_dummy_bypass_123',
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: 'bypass_test_payment',
        });

        if (verifyRes.data.success) {
          setOrderSuccess(true);
          dispatch(clearCart());
          
          const ordersRes = await api.get('/order');
          setOrders(ordersRes.data);

          setTimeout(() => {
            setOrderSuccess(false);
            handleTabChange('orders');
          }, 3000);
        }
      }
      setPlacingOrder(false);
    } catch (error) {
      console.error(error);
      setCheckoutError(error.response?.data?.message || 'Error bypassing order');
      setPlacingOrder(false);
    }
  };

  if (checkingAuth || !user) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary)', letterSpacing: '0.05em' }}>RESTOCKING SESSION CREDENTIALS...</span>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0', backgroundColor: 'var(--color-bg)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Profile Card Summary */}
        <div className="glass" style={{
          padding: '2rem',
          border: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <img
              src={user.profileImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
              alt={user.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {user.name}
                </h1>
                <span className="badge-member">BLACK CARD</span>
              </div>
              <p style={{ color: 'var(--color-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', fontWeight: 700 }}>
                {user.email.toUpperCase()} • APEX CUSTOMER
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'rgba(212, 175, 55, 0.05)',
            border: '1px solid rgba(212, 175, 55, 0.15)',
            padding: '1rem 1.5rem',
            textAlign: 'right',
          }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.1em', display: 'block', textTransform: 'uppercase' }}>ESTIMATED SAVINGS</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-gold)', fontFamily: 'var(--font-display)', display: 'block', marginTop: '0.25rem' }}>$142.50</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '2.5rem', overflowX: 'auto' }}>
          {[
            { id: 'orders', label: `Orders (${orders.length})`, icon: <ShoppingBag size={15} /> },
            { id: 'wishlist', label: `Wishlist (${wishlistProducts.length})`, icon: <Heart size={15} /> },
            ...(cartItems.length > 0 ? [{ id: 'checkout', label: 'Checkout', icon: <CreditCard size={15} /> }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.5rem 1rem',
                color: activeTab === tab.id ? '#FFF' : 'var(--color-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : 'none',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders list panel */}
        {activeTab === 'orders' && (
          <div>
            {ordersLoading ? (
              <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-secondary)' }}>RETRIEVING ORDER HISTORY...</span>
              </div>
            ) : orders.length === 0 ? (
              <div style={{
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed var(--color-border)',
                color: 'var(--color-secondary)',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <ShoppingBag size={40} style={{ strokeWidth: 1.5, marginBottom: '1rem' }} />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>NO TRANSACTIONS RECORDED YET</span>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Add streetwear products to your bag and confirm checkout to register orders.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {orders.map((order) => (
                  <div key={order._id} className="glass" style={{ border: '1px solid var(--color-border)', padding: '2rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid var(--color-border)',
                      paddingBottom: '1.25rem',
                      marginBottom: '1.5rem',
                      flexWrap: 'wrap',
                      gap: '1rem',
                    }}>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>ORDER ID</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>#{order._id.toUpperCase()}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>TRANSACTION DATE</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>AMOUNT PAID</span>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-accent)' }}>{formatPrice(order.totalAmount)}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>SHIPPING STATUS</span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.3rem 0.6rem',
                          backgroundColor: order.status === 'Delivered' ? 'rgba(52, 199, 89, 0.15)' : order.status === 'Shipped' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(255, 149, 0, 0.15)',
                          color: order.status === 'Delivered' ? '#34C759' : order.status === 'Shipped' ? '#007AFF' : '#FF9500',
                          border: '1px solid',
                          borderColor: order.status === 'Delivered' ? '#34C759' : order.status === 'Shipped' ? '#007AFF' : '#FF9500',
                          textTransform: 'uppercase',
                        }}>{order.status}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>PAYMENT STATUS</span>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '0.3rem 0.6rem',
                          backgroundColor: order.paymentStatus === 'Paid' ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 59, 48, 0.15)',
                          color: order.paymentStatus === 'Paid' ? '#34C759' : '#FF3B30',
                          border: '1px solid',
                          borderColor: order.paymentStatus === 'Paid' ? '#34C759' : '#FF3B30',
                          textTransform: 'uppercase',
                        }}>{order.paymentStatus || 'Pending'}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {order.products.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <img src={item.image} alt={item.name} style={{ width: '45px', height: '55px', objectFit: 'cover', border: '1px solid var(--color-border)' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase' }}>{item.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-secondary)', fontWeight: 700, marginTop: '0.2rem' }}>
                              SIZE: {item.size} • QTY: {item.quantity} • PRICE: ${item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wishlist panel */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistProducts.length === 0 ? (
              <div style={{
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed var(--color-border)',
                color: 'var(--color-secondary)',
                padding: '2rem',
                textAlign: 'center',
              }}>
                <Heart size={40} style={{ strokeWidth: 1.5, marginBottom: '1rem' }} />
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#FFF' }}>YOUR WISHLIST IS EMPTY</span>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Products you save using the heart icons will collect here.</p>
              </div>
            ) : (
              <div className="product-grid">
                {wishlistProducts.map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Checkout form panel */}
        {activeTab === 'checkout' && (
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div className="glass" style={{ flex: '1 1 500px', padding: '2.5rem', border: '1px solid var(--color-border)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '2rem' }}>Shipping Coordinates</h3>
              
              {checkoutError && (
                <div style={{ backgroundColor: 'rgba(255,59,48,0.1)', border: '1px solid var(--color-accent)', padding: '0.75rem', marginBottom: '1.5rem', color: 'var(--color-accent)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {checkoutError}
                </div>
              )}

              {orderSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '240px', textAlign: 'center', gap: '1rem' }}>
                  <CheckCircle size={44} style={{ color: 'var(--color-gold)' }} />
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em' }}>TRANSACTION COMPLETED</h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-secondary)' }}>Syncing order tracking stats with distribution centers...</p>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="street">Street Address</label>
                    <input id="street" required type="text" className="form-input" placeholder="123 Street Name" value={street} onChange={(e) => setStreet(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="city">City</label>
                      <input id="city" required type="text" className="form-input" placeholder="New York" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="state">State / Province</label>
                      <input id="state" required type="text" className="form-input" placeholder="NY" value={state} onChange={(e) => setState(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="zipCode">Zip / Postal Code</label>
                      <input id="zipCode" required type="text" className="form-input" placeholder="10001" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="country">Country</label>
                      <input id="country" required type="text" className="form-input" placeholder="United States" value={country} onChange={(e) => setCountry(e.target.value)} />
                    </div>
                  </div>

                  <button type="submit" disabled={placingOrder} className="btn-primary" style={{ width: '100%', padding: '1rem 0', marginTop: '1.5rem' }}>
                    {placingOrder ? 'PROCESSING TRANSACTION...' : 'PLACE ORDER'}
                  </button>

                  {import.meta.env.DEV && (
                    <button
                      type="button"
                      onClick={handleBypassPlaceOrder}
                      disabled={placingOrder}
                      style={{
                        width: '100%',
                        padding: '0.75rem 0',
                        marginTop: '0.75rem',
                        backgroundColor: 'transparent',
                        color: 'var(--color-secondary)',
                        border: '1px dashed var(--color-border)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        cursor: 'pointer'
                      }}
                    >
                      Bypass Razorpay (Dev Only)
                    </button>
                  )}
                </form>
              )}
            </div>

            {/* Cart Summary */}
            <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="glass" style={{ padding: '2rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-alt)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1.5rem' }}>Bag Details</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.5rem', marginBottom: '1.5rem' }}>
                  {cartItems.map((item, idx) => {
                    const finalPrice = item.productId.discount > 0 
                      ? item.productId.price * (1 - item.productId.discount / 100)
                      : item.productId.price;
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <img src={item.productId.images[0]} alt={item.productId.name} style={{ width: '40px', height: '50px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '170px' }}>{item.productId.name}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--color-secondary)' }}>SIZE: {item.size} • QTY: {item.quantity}</div>
                        </div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800 }}>{formatPrice(finalPrice * item.quantity)}</span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--color-secondary)' }}>
                    <span>SHIPPING CHARGE</span>
                    <span style={{ color: 'var(--color-gold)', fontWeight: 800 }}>FREE (VIP MEMBERSHIP)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.02em', marginTop: '0.5rem' }}>
                    <span>TOTAL AMOUNT</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
