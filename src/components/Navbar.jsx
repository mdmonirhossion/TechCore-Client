"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import MegaMenu from './MegaMenu';
import {
  Search, ShoppingCart, Heart, Scale, User, Cpu, ShieldCheck,
  ChevronDown, Phone, MapPin, Sparkles, Wrench, Headphones, LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const { cart, wishlist, compareItems, user } = useShop();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';
      fetch(`${apiUrl}/api/products?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data) ? data : (data.products || []);
          setSuggestions(list.slice(0, 5));
          setShowSuggestions(true);
        })
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const cartCount = mounted ? cart.reduce((s, i) => s + i.quantity, 0) : 0;
  const wishlistCount = mounted ? wishlist.length : 0;
  const compareCount = mounted ? compareItems.length : 0;

  return (
    <header className="navbar">
      
      {/* Top Banner Bar */}
      <div style={{ background: '#0b1120', color: '#94a3b8', fontSize: '0.78rem', padding: '0.35rem 0', borderBottom: '1px solid #1e293b' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f97316', fontWeight: 800 }}>
              🔥 Hot Line: 01700-000000 (9 AM - 8 PM)
            </span>
            <span>Official Warranty Guaranteed</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Link href="/outlets" style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} color="#38bdf8" /> Store Locator
            </Link>
            <span>|</span>
            <Link href="/pc-builder" style={{ color: '#f97316', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Cpu size={12} /> PC Builder Tool
            </Link>
          </div>
        </div>
      </div>

      {/* Main Top Header */}
      <div className="container">
        <div className="nav-top">
          
          {/* Logo */}
          <Link href="/" className="logo-brand">
            <span style={{ color: '#ea580c', fontWeight: 900 }}>Tech</span>
            <span style={{ color: '#0f172a', fontWeight: 900 }}>Core</span>
            <span style={{ fontSize: '0.65rem', background: '#ea580c', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px', verticalAlign: 'top' }}>BD</span>
          </Link>

          {/* Search Box */}
          <div className="search-box-wrapper">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="search-input"
                placeholder="Search products, brands, GPUs, Laptops, Processors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)}
              />
              <Search className="search-icon" size={18} />
            </form>

            {/* Suggestions Popover */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-popover">
                {suggestions.map(item => (
                  <div
                    key={item.id || item._id}
                    className="suggestion-item"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery('');
                      router.push(`/product/${item.slug || item.id || item._id}`);
                    }}
                  >
                    <Search size={14} color="#94a3b8" />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#ea580c', fontWeight: 800 }}>
                        ৳{(item.discountPrice || item.price || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nav Actions */}
          <div className="nav-actions">
            
            <Link href="/compare" className="nav-icon-btn" title="Compare Products">
              <Scale size={20} color="#0284c7" />
              <span>Compare</span>
              {compareCount > 0 && <span className="badge-count">{compareCount}</span>}
            </Link>

            <Link href="/wishlist" className="nav-icon-btn" title="Wishlist">
              <Heart size={20} color="#ea580c" />
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className="badge-count">{wishlistCount}</span>}
            </Link>

            <Link href="/cart" className="nav-icon-btn" title="Shopping Cart">
              <ShoppingCart size={20} color="#2563eb" />
              <span>Cart</span>
              {cartCount > 0 && <span className="badge-count">{cartCount}</span>}
            </Link>

            <Link href="/account" className="nav-icon-btn" style={{ background: '#f1f5f9' }}>
              <User size={20} color="#0f172a" />
              <span>{mounted && user ? user.name.split(' ')[0] : 'Account'}</span>
            </Link>

            {mounted && user && (user.role === 'admin' || user.isAdmin) && (
              <Link href="/admin" className="nav-icon-btn" style={{ background: '#fff7ed', border: '1px solid #ffedd5' }} title="Admin Dashboard">
                <LayoutDashboard size={20} color="#ea580c" />
                <span style={{ color: '#ea580c', fontWeight: 700 }}>Admin</span>
              </Link>
            )}
          </div>

        </div>

        {/* Category Navigation Bar */}
        <nav className="cat-nav-bar" style={{ position: 'relative' }}>
          
          <div
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            style={{ position: 'relative' }}
          >
            <button
              style={{
                background: '#ea580c',
                color: '#ffffff',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}
            >
              All Categories <ChevronDown size={14} />
            </button>

            {isMegaMenuOpen && <MegaMenu onClose={() => setIsMegaMenuOpen(false)} />}
          </div>

          <Link href="/desktop" className="cat-nav-link">Desktop PC</Link>
          <Link href="/laptop" className="cat-nav-link">Gaming Laptop</Link>
          <Link href="/gpu" className="cat-nav-link">Graphics Card</Link>
          <Link href="/processor" className="cat-nav-link">Processor</Link>
          <Link href="/monitor" className="cat-nav-link">Monitor</Link>
          <Link href="/brands" className="cat-nav-link">All Brands</Link>
          <Link href="/offers" className="cat-nav-link" style={{ color: '#ea580c', fontWeight: 800 }}>Offers & Deals</Link>

        </nav>

      </div>

    </header>
  );
}
