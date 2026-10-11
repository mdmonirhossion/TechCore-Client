"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter as useNextRouter } from 'next/navigation';
import MobileCategoryMenu from '@/components/MobileCategoryMenu';
import { useShop } from '@/context/ShopContext';
import { searchProducts } from '@/lib/api';
import {
  Cpu,
  Search,
  Gift,
  Zap,
  User,
  Wrench,
  ShoppingCart,
  Heart,
  Scale,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Laptop,
  Monitor,
  HardDrive,
  Headphones,
  Wifi,
  ShieldCheck,
  Server,
  Database,
  MemoryStick,
  Box,
  Sun,
  Moon
} from 'lucide-react';
import Image from 'next/image';

export default function Navbar({ categoryTree = [] }) {
  const router = useNextRouter();
  const { cart, wishlist, compareItems, user, theme, toggleTheme } = useShop();

  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHoverCategory, setActiveHoverCategory] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  // Debounced search logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!searchQuery.trim() || searchQuery.trim().length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      searchProducts(searchQuery.trim())
        .then(list => {
          setSuggestions(Array.isArray(list) ? list.slice(0, 5) : []);
          setShowSuggestions(true);
        })
        .catch(() => {
          setSuggestions([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 250);

    return () => clearTimeout(timer);
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
    <header suppressHydrationWarning className="w-full z-50 sticky top-0 bg-white shadow-sm border-b border-slate-200">
      
      {/* MONARCH IT ROYAL BLUE TOP HEADER (~74px height) */}
      <div suppressHydrationWarning className="bg-gradient-to-r from-[#0f2bb0] via-[#1337b8] to-[#0e2482] text-white px-4 lg:px-8 py-3.5 min-h-[74px]">
        <div suppressHydrationWarning className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div suppressHydrationWarning className="flex items-center gap-3">
          <button
            className="lg:hidden text-white p-1 hover:bg-white/10 rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Mobile Menu"
          >
            <Menu size={24} />
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Cpu size={22} className="stroke-[2.5]" />
            </div>
            <div className="flex items-center text-2xl font-black tracking-tight font-sans">
              <span className="text-white">TECH</span>
              <span className="text-orange-400">CORE</span>
            </div>
          </Link>
        </div>

        {/* 5. SEARCH BAR */}
        <div suppressHydrationWarning className="relative flex-1 max-w-2xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-2.5 rounded-lg text-sm border-0 focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-sm"
              placeholder="Search RTX 4060, Ryzen 7, Gaming Laptop..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {showSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden text-slate-900">
              {isSearching ? (
                <div className="p-4 text-xs text-slate-500 text-center">Searching products...</div>
              ) : suggestions.length > 0 ? (
                <div>
                  <div className="bg-slate-50 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Product Suggestions
                  </div>
                  {suggestions.map((item) => {
                    const itemImg = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : (item.image || '/placeholder.png');
                    return (
                      <div
                        key={item.id || item._id}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                          router.push(`/products/${item.slug || item.id || item._id}`);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <div className="w-10 h-10 relative bg-slate-100 rounded flex-shrink-0 overflow-hidden border">
                          <Image src={itemImg} alt={item.name} fill className="object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                          <div className="text-xs font-bold text-red-600 mt-0.5">
                            ৳{(item.discountPrice || item.price || 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No products found for &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* 6. HEADER ACTIONS */}
        <div suppressHydrationWarning className="flex items-center gap-3 lg:gap-5">
          
          {/* Offers */}
          <Link href="/offers" className="hidden lg:flex items-center gap-2 text-slate-200 hover:text-white group">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-orange-600 transition-colors">
              <Gift size={18} className="text-orange-500 group-hover:text-white" />
            </div>
            <div className="text-left text-xs">
              <span className="block font-bold text-white leading-tight">Offers</span>
              <span className="text-[10px] text-slate-400">Latest Offers</span>
            </div>
          </Link>

          {/* Happy Hour */}
          <Link href="/offers" className="hidden xl:flex items-center gap-2 text-slate-200 hover:text-white group">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 transition-colors">
              <Zap size={18} className="text-amber-400 group-hover:text-white" />
            </div>
            <div className="text-left text-xs">
              <span className="block font-bold text-white leading-tight">Happy Hour</span>
              <span className="text-[10px] text-slate-400">Special Deals</span>
            </div>
          </Link>

          {/* Account */}
          <Link href="/login" className="flex items-center gap-2 text-slate-200 hover:text-white group">
            <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <User size={18} className="text-slate-300 group-hover:text-white" />
            </div>
            <div className="text-left text-xs hidden sm:block">
              <span className="block font-bold text-white leading-tight">
                {mounted && user ? (user.name ? user.name.split(' ')[0] : 'Md Monir') : 'Account'}
              </span>
              <span className="text-[10px] text-slate-400">
                {mounted && user ? 'My Account' : 'Register or Login'}
              </span>
            </div>
          </Link>

          {/* Wishlist Icon */}
          <Link href="/wishlist" className="relative p-2 text-slate-300 hover:text-orange-500 transition-colors" title="Wishlist">
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Compare Icon */}
          <Link href="/compare" className="relative p-2 text-slate-300 hover:text-blue-400 transition-colors" title="Compare">
            <Scale size={22} />
            {compareCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-slate-300 hover:text-orange-500 transition-colors" title="Cart">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle Button (Sun / Moon) */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-orange-600 flex items-center justify-center text-slate-200 hover:text-white transition-all shadow-md group"
            title={mounted && theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {mounted && theme === 'dark' ? (
              <Sun size={20} className="text-amber-400 group-hover:text-white transition-colors" />
            ) : (
              <Moon size={20} className="text-slate-200 group-hover:text-white transition-colors" />
            )}
          </button>

          {/* PC Builder Button */}
          <Link
            href="/pc-builder"
            className="bg-[#2563eb] hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md hover:shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Wrench size={16} />
            <span className="hidden sm:inline">PC Builder</span>
          </Link>

        </div>
      </div>
    </div>

      {/* Mobile Search Bar */}
      <div className="p-3 bg-[#0f2bb0] border-t border-blue-900 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 pl-4 pr-10 py-2 rounded-md text-xs"
            placeholder="Search RTX 4060, Ryzen 7..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={16} />
          </button>
        </form>
      </div>

      {/* 7. MEGA CATEGORY NAVIGATION */}
      <nav className="hidden lg:block bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between font-sans text-xs font-bold text-slate-800 dark:text-slate-200">
          {categoryTree.map((cat, index) => {
            const catChildren = cat.children || cat.subcategories || [];
            const hasSub = catChildren.length > 0;
            const catTitle = cat.name || cat.title || '';
            const catPath = cat.fullPath || cat.slug || '';
            return (
              <div
                key={cat.id || index}
                className="relative group py-3.5 hover:text-orange-600 dark:hover:text-orange-400 border-b-2 border-transparent hover:border-orange-600 transition-colors cursor-pointer"
                onMouseEnter={() => setActiveHoverCategory(catTitle)}
                onMouseLeave={() => setActiveHoverCategory(null)}
              >
                <Link href={`/category/${catPath}`} className="flex items-center gap-1">
                  <span>{catTitle}</span>
                  {hasSub && <ChevronDown size={12} className="text-slate-400 group-hover:text-orange-600" />}
                </Link>

                {/* Dropdown Flyout */}
                {hasSub && activeHoverCategory === catTitle && (
                  <div className="absolute left-0 top-full mt-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-b-xl shadow-2xl p-6 min-w-[500px] z-50 grid grid-cols-2 gap-6 text-slate-800 dark:text-slate-200 font-normal">
                    {catChildren.map((sub, sIdx) => {
                      const subTitle = sub.name || sub.title || '';
                      const subPath = sub.fullPath || sub.slug || '';
                      const subChildren = sub.children || sub.items || [];
                      return (
                        <div key={sub.id || sIdx} className="space-y-2">
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1 flex items-center gap-1">
                            <ChevronRight size={12} className="text-orange-600" />
                            <Link href={`/category/${subPath}`} className="hover:text-orange-600 dark:hover:text-orange-400">
                              {subTitle}
                            </Link>
                          </h5>
                          {subChildren.length > 0 && (
                            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                              {subChildren.map((item, iIdx) => {
                                const itemTitle = item.name || item.title || (typeof item === 'string' ? item : '');
                                const itemPath = item.fullPath || item.slug || (typeof item === 'string' ? `${subPath}/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` : subPath);
                                return (
                                  <li key={item.id || iIdx}>
                                    <Link href={`/category/${itemPath}`} className="hover:text-orange-600 dark:hover:text-orange-400 hover:underline block py-0.5">
                                      {itemTitle}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col overflow-y-auto z-10 text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2 font-black text-xl">
                <span className="text-slate-900 dark:text-white">TECH</span>
                <span className="text-orange-600">CORE</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded text-slate-500 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              {/* Theme Toggle in Mobile Drawer */}
              <button
                onClick={toggleTheme}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold px-4 py-2.5 rounded-lg flex items-center justify-between transition-colors border border-slate-200 dark:border-slate-700"
              >
                <span className="flex items-center gap-2">
                  {mounted && theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
                  <span>{mounted && theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </span>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{mounted ? theme : ''}</span>
              </button>

              <Link href="/pc-builder" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
                <Wrench size={16} /> PC Builder
              </Link>

              <div className="font-bold text-xs uppercase tracking-wider text-slate-400 pt-3">Categories</div>
              <MobileCategoryMenu
                tree={categoryTree}
                onNavigate={() => setMobileMenuOpen(false)}
                isOpen={mobileMenuOpen}
              />
            </div>
          </div>
        </div>
      )}

    </header>
  );
}

