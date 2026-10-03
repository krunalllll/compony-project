import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './redux/authSlice';
import { fetchCart } from './redux/cartSlice';
import { fetchWishlist } from './redux/wishlistSlice';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { CurrencyProvider } from './context/CurrencyContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

// Pages
import Home from './pages/Home';
import Men from './pages/Men';
import Women from './pages/Women';
import Kids from './pages/Kids';
import Sneakers from './pages/Sneakers';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Protected Admin Route Guard Component
const ProtectedAdminRoute = ({ children }) => {
  const { isAuthenticated, user, checkingAuth } = useSelector((state) => state.auth);

  if (checkingAuth) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0C',
        color: '#FFFFFF',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.15em', fontSize: '1.5rem', marginBottom: '0.5rem' }}>HAPPY STORE</h2>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>AUTHORIZING CREDENTIALS...</span>
      </div>
    );
  }

  const role = user?.role || localStorage.getItem('role');

  if (!isAuthenticated || role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, checkingAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  if (checkingAuth) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0A0A0C',
        color: '#FFFFFF',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '0.15em', fontSize: '1.5rem', marginBottom: '0.5rem' }}>HAPPY STORE</h2>
        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', letterSpacing: '0.1em' }}>SYNCHRONIZING APEX MEMBERSHIP...</span>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <ToastProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/men" element={<Men />} />
                  <Route path="/women" element={<Women />} />
                  <Route path="/kids" element={<Kids />} />
                  <Route path="/sneakers" element={<Sneakers />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="/checkout" element={<Profile />} />
                  <Route 
                    path="/admin-dashboard" 
                    element={
                      <ProtectedAdminRoute>
                        <AdminDashboard />
                      </ProtectedAdminRoute>
                    } 
                  />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  {/* Fallback redirection */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <BackToTop />
            </div>
          </Router>
        </ToastProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
};

export default App;
