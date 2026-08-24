import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, AlertTriangle } from 'lucide-react';
import { signupUser, clearAuthError } from '../redux/authSlice';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
    <path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.7 0 3.3.6 4.5 1.8l2.4-2.4C17.3 1.6 14.9 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.79 0 10.24-4.06 10.24-10.24 0-.69-.08-1.35-.22-1.95H12.24z"/>
  </svg>
);

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    dispatch(signupUser({ name, email, password }));
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--color-bg)',
      padding: '3rem 1rem',
    }}>
      <div className="glass" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '3rem 2.5rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-premium)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-accent)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            JOIN THE CLUB
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>
            CREATE ACCOUNT
          </h1>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(255, 59, 48, 0.1)',
            border: '1px solid var(--color-accent)',
            padding: '1rem',
            marginBottom: '1.5rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertTriangle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Inputs */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-secondary)' }} />
              <input
                id="name"
                type="text"
                required
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-secondary)' }} />
              <input
                id="email"
                type="email"
                required
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={15} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-secondary)' }} />
              <input
                id="password"
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '2.75rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', padding: '1rem 0' }}
          >
            {loading ? 'REGISTERING...' : 'REGISTER ACCOUNT'}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
          margin: '2rem 0',
          fontSize: '0.7rem',
          color: 'var(--color-secondary)',
          fontWeight: 800,
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
          <span style={{ padding: '0 1rem', letterSpacing: '0.1em' }}>OR CONNECT WITH</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }} />
        </div>

        {/* Google Redirect */}
        <button
          onClick={handleGoogleLogin}
          className="btn-secondary"
          style={{ width: '100%', padding: '0.9rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '0.72rem', letterSpacing: '0.05em' }}
        >
          <GoogleIcon />
          SIGN UP WITH GOOGLE
        </button>

        <div style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 600 }}>
          ALREADY A MEMBER?{' '}
          <Link to="/login" style={{ color: '#FFF', fontWeight: 800, textDecoration: 'underline' }}>
            LOG IN HERE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
