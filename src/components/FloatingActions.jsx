import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Scale, Smartphone, ChevronUp } from 'lucide-react';

export default function FloatingActions({ onNavigate }) {
  const { cart, compareItems } = useShop();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      style={{
        position: 'fixed',
        right: '12px',
        bottom: '80px',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end'
      }}
    >
      {/* Mobile Deal Circle Badge */}
      <button
        onClick={() => onNavigate('offers')}
        style={{
          background: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '0.6rem 0.9rem',
          fontWeight: 800,
          fontSize: '0.72rem',
          boxShadow: '0 4px 15px rgba(234, 88, 12, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Smartphone size={14} /> Mobile Deal
      </button>

      {/* Compare Floating Button */}
      <button
        onClick={() => onNavigate('compare')}
        style={{
          position: 'relative',
          background: '#0f172a',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          width: '54px',
          height: '54px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          transition: 'background 0.2s ease'
        }}
      >
        <Scale size={18} color="#38bdf8" />
        <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>COMPARE</span>
        <span style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          background: '#ef4444',
          color: '#ffffff',
          fontSize: '0.65rem',
          fontWeight: 800,
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {compareItems.length}
        </span>
      </button>

      {/* Cart Floating Button */}
      <button
        onClick={() => onNavigate('cart')}
        style={{
          position: 'relative',
          background: '#0f172a',
          color: '#ffffff',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '8px',
          width: '54px',
          height: '54px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2px',
          cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
          transition: 'background 0.2s ease'
        }}
      >
        <ShoppingBag size={18} color="#38bdf8" />
        <span style={{ fontSize: '0.62rem', fontWeight: 800 }}>CART</span>
        <span style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          background: '#ea580c',
          color: '#ffffff',
          fontSize: '0.65rem',
          fontWeight: 800,
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {totalCartCount}
        </span>
      </button>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{
          background: '#f1f5f9',
          color: '#0f172a',
          border: '1px solid #cbd5e1',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        title="Scroll to Top"
      >
        <ChevronUp size={18} />
      </button>
    </div>
  );
}
