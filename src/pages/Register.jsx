import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Home, User, Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Register({ onNavigate }) {
  const { loginUser } = useShop();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    password: '',
    confirmPassword: '',
    agreePolicy: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Password Validation Criteria Checks
  const pass = formData.password;
  const isLengthValid = pass.length >= 8;
  const hasCapital = /[A-Z]/.test(pass);
  const hasSmall = /[a-z]/.test(pass);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\+=/\\]/.test(pass);
  const isPasswordValid = isLengthValid && hasCapital && hasSmall && hasSpecial;

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMsg('Please enter your First Name and Last Name.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMsg('Please enter a valid E-Mail address.');
      return;
    }

    if (!formData.telephone.trim()) {
      setErrorMsg('Please enter your Telephone / Mobile number.');
      return;
    }

    // Check Password Criteria
    if (!isPasswordValid) {
      setErrorMsg('Password does not meet the security criteria (Min 8 characters, 1 Capital letter, 1 Small letter, and 1 Special character).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Password and Confirm Password do not match.');
      return;
    }

    if (!formData.agreePolicy) {
      setErrorMsg('You must agree to the Privacy Policy to proceed.');
      return;
    }

    setLoading(true);

    // Simulate account registration logic
    setTimeout(() => {
      setLoading(false);
      const newUser = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.telephone,
        isLoggedIn: true
      };
      loginUser(newUser);
      alert('Registration successful! Welcome to TechCore.');
      onNavigate('home');
    }, 500);
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
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Register</span>
        </div>

        {/* 2. Register Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
            maxWidth: '680px',
            margin: '0 auto',
            padding: '2.5rem 2rem'
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
              Register Account
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
              If you already have an account with us, please login at the login page.
            </p>
          </div>

          {errorMsg && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}
            >
              <AlertCircle size={20} color="#dc2626" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit}>
            {/* First Name & Last Name Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  First Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Last Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  <User size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                E-Mail <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  name="email"
                  placeholder="E-Mail"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Telephone Input */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                Telephone <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Telephone / Mobile number"
                  value={formData.telephone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.92rem',
                    outline: 'none'
                  }}
                />
                <Phone size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

              {/* Password Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Password <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <div
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>
                  Confirm Password <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.92rem',
                      outline: 'none'
                    }}
                  />
                  <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#64748b' }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              </div>

            </div>

            {/* Password Validation Criteria Checklist */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Password Requirements Checklist:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isLengthValid ? '#16a34a' : '#64748b' }}>
                  {isLengthValid ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#94a3b8" />}
                  <span style={{ fontWeight: isLengthValid ? 700 : 500 }}>Min 8 digits/characters</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasCapital ? '#16a34a' : '#64748b' }}>
                  {hasCapital ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#94a3b8" />}
                  <span style={{ fontWeight: hasCapital ? 700 : 500 }}>1 Capital letter (A-Z)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasSmall ? '#16a34a' : '#64748b' }}>
                  {hasSmall ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#94a3b8" />}
                  <span style={{ fontWeight: hasSmall ? 700 : 500 }}>1 Small letter (a-z)</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: hasSpecial ? '#16a34a' : '#64748b' }}>
                  {hasSpecial ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#94a3b8" />}
                  <span style={{ fontWeight: hasSpecial ? 700 : 500 }}>1 Special character (@#$%)</span>
                </div>
              </div>
            </div>

            {/* Privacy Policy Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <input
                type="checkbox"
                id="agreePolicy"
                name="agreePolicy"
                checked={formData.agreePolicy}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="agreePolicy" style={{ fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}>
                I have read and agree to the <a href="#privacy" style={{ color: '#ea580c', fontWeight: 700, textDecoration: 'none' }}>Privacy Policy</a>
              </label>
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

            {/* Submit Button */}
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
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#3b82f6')}
            >
              {loading ? 'Creating Account...' : 'Continue'}
            </button>
          </form>

          {/* Already have an account link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#64748b' }}>
            Already have an account?{' '}
            <span
              onClick={() => onNavigate('login')}
              style={{ color: '#3b82f6', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Login here
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
