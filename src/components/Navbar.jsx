import React, { useState, useEffect, useRef } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search, ShoppingBag, Heart, Scale, Cpu, Laptop, ShieldCheck, Wrench,
  User, Gift, Zap, LayoutDashboard, Phone, Percent
} from 'lucide-react';
import MegaMenu from './MegaMenu';

export default function Navbar({ activePage, setActivePage }) {
  const { cart, wishlist, compareItems, user } = useShop();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Debounce search query against backend API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions(null);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearching(true);
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSuggestions(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    setSuggestions(null);
    setSearchQuery('');
    setActivePage(`product-detail:${productId}`);
  };

  return (
    <header className="navbar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
      
      {/* 1. Star Tech Style Dark Header Bar */}
      <div style={{ background: '#0e1726', color: '#ffffff', padding: '0.75rem 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
          
          {/* Brand Logo */}
          <div
            className="logo-brand"
            onClick={() => setActivePage('home')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffffff', fontSize: '1.6rem', fontWeight: 900 }}
          >
            <Cpu size={30} color="#ea580c" />
            <span>TECH<span style={{ color: '#ea580c' }}>CORE</span></span>
          </div>

          {/* Search Box */}
          <div className="search-box-wrapper" ref={searchRef} style={{ flex: 1, maxWidth: '560px', position: 'relative' }}>
            <input
              type="text"
              className="search-input"
              placeholder="Search RTX 4060, Ryzen 7, Gaming Laptop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 2.75rem 0.65rem 1.1rem',
                background: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                color: '#0f172a',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
            <Search className="search-icon" size={18} style={{ position: 'absolute', right: '1rem', left: 'auto', top: '50%', transform: 'translateY(-50%)', color: '#0f172a', cursor: 'pointer' }} />

            {/* Search Suggestions */}
            {suggestions && (
              <div className="search-suggestions-popover">
                {isSearching && <div style={{ padding: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Searching catalog...</div>}

                {suggestions.products.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ea580c', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                      Matching Products
                    </div>
                    {suggestions.products.map(p => (
                      <div key={p.id} className="suggestion-item" onClick={() => handleSelectProduct(p.id)}>
                        <img src={p.images[0]} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 700 }}>৳{(p.discountPrice || p.price).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Items (Matching Star Tech Screenshot) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* 1. Offers / Latest Offers */}
            <div
              onClick={() => setActivePage('offers')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ffffff' }}
            >
              <Gift size={22} color="#ea580c" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Offers</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Latest Offers</span>
              </div>
            </div>

            {/* 2. Happy Hour / Special Deals */}
            <div
              onClick={() => setActivePage('offers')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ffffff' }}
            >
              <Zap size={22} color="#ea580c" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Happy Hour</span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Special Deals</span>
              </div>
            </div>

            {/* 3. Account / Register or Login */}
            <div
              onClick={() => setActivePage(user ? 'login' : 'login')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ffffff' }}
              title={user ? `Logged in as ${user.name}` : 'Click to Register or Login'}
            >
              <User size={22} color="#ea580c" />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                  {user ? (user.name.length > 10 ? user.name.slice(0, 10) + '...' : user.name) : 'Account'}
                </span>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  {user ? 'My Account' : 'Register or Login'}
                </span>
              </div>
            </div>

            {/* Admin ERP Quick Link */}
            <div
              onClick={() => setActivePage('admin')}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 700 }}
              title="Admin ERP Portal"
            >
              <LayoutDashboard size={18} color="#94a3b8" />
              <span>ERP</span>
            </div>

            {/* 4. Highlighted Blue PC Builder Button */}
            <button
              onClick={() => setActivePage('pc-builder')}
              style={{
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.55rem 1.1rem',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                transition: 'background 0.2s ease'
              }}
            >
              PC Builder
            </button>

          </div>

        </div>
      </div>

      {/* 2. Primary Category Mega Nav Bar with 18 Parent Categories & 3-tier Flyout Menu */}
      <MegaMenu activePage={activePage} setActivePage={setActivePage} />

    </header>
  );
}
