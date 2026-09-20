import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Home, Phone, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowRight, UserPlus } from 'lucide-react';

export default function Login({ onNavigate }) {
  const { loginUser } = useShop();
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phoneOrEmail.trim()) {
      setErrorMsg('Please enter your Phone number or Email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setLoading(true);

    // Simulate login logic
    setTimeout(() => {
      setLoading(false);
      const mockUser = {
        name: phoneOrEmail.includes('@') ? phoneOrEmail.split('@')[0] : 'Customer',
        phoneOrEmail: phoneOrEmail,
        isLoggedIn: true
      };
      loginUser(mockUser);
      onNavigate('home');
    }, 400);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: 'calc(100vh - 180px)', padding: '2rem 1rem 4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* 1. Breadcrumb Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginBottom: '2rem' }}>
          <Home size={16} style={{ cursor: 'pointer' }} onClick={() => onNavigate('home')} />
          <span>/</span>
          <span style={{ cursor: 'pointer' }} onClick={() => onNavigate('account')}>Account</span>
          <span>/</span>
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Login</span>
        </div>

        {/* 2. Login Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
            maxWidth: '520px',
            margin: '0 auto',
            padding: '2.5rem 2rem'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Account Login
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              Log in to manage your orders, wishlist & account settings
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            {/* Phone or Email Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Phone / Email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Enter your phone or email"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Password Input with Hide/Show Toggle */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered phone/email.'); }}
                  style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ea580c', textDecoration: 'none' }}
                >
                  Forgotten Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#2563eb')}
                  onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
                />
                <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />

                {/* Password Eye Toggle */}
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Cloudflare Turnstile Security Box (Matching Screenshot) */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CheckCircle2 size={24} color="#16a34a" />
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#16a34a' }}>Success!</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ea580c', letterSpacing: '0.05em' }}>CLOUDFLARE</span>
                <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Privacy • Help</span>
              </div>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 800,
                cursor: loading ? 'wait' : 'pointer',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#3b82f6')}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div
            style={{
              position: 'relative',
              textAlign: 'center',
              margin: '2rem 0 1.5rem 0'
            }}
          >
            <div style={{ borderTop: '1px solid #e2e8f0', position: 'absolute', top: '50%', left: 0, right: 0 }} />
            <span
              style={{
                position: 'relative',
                background: '#ffffff',
                padding: '0 1rem',
                fontSize: '0.85rem',
                color: '#64748b',
                fontWeight: 600
              }}
            >
              Don't have an account?
            </span>
          </div>

          {/* Register Redirect Button */}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            style={{
              width: '100%',
              background: '#ffffff',
              color: '#3b82f6',
              border: '1.5px solid #3b82f6',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.95rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
            }}
          >
            <UserPlus size={18} />
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}
