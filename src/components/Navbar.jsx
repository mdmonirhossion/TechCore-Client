"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRouter as useNextRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
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
  Box
} from 'lucide-react';
import Image from 'next/image';

export const CATEGORIES_LIST = [
  {
    title: 'Desktop',
    slug: 'desktop',
    subcategories: [
      { title: 'Gaming PC', items: ['Intel Gaming PC', 'AMD Gaming PC', 'Custom Rig'] },
      { title: 'Brand PC', items: ['HP', 'Dell', 'Lenovo', 'ASUS'] },
      { title: 'All-in-One PC', items: ['iMac', 'HP AIO', 'Dell Inspiron'] }
    ]
  },
  {
    title: 'Laptop',
    slug: 'laptop',
    subcategories: [
      { title: 'Gaming Laptop', items: ['ASUS ROG / TUF', 'Lenovo Legion / LOQ', 'MSI Gaming', 'HP Victus'] },
      { title: 'Ultrabook', items: ['MacBook Pro', 'MacBook Air', 'Dell XPS', 'HP Spectre'] },
      { title: 'Budget Laptop', items: ['Core i3 Laptops', 'Ryzen 3 Laptops'] }
    ]
  },
  {
    title: 'Components',
    slug: 'processor',
    subcategories: [
      { title: 'Processor', items: ['Intel Core i9 / i7 / i5', 'AMD Ryzen 9 / 7 / 5', 'Server CPU'] },
      { title: 'Motherboard', items: ['Intel Socket LGA1700', 'AMD Socket AM5 / AM4'] },
      { title: 'RAM', items: ['Desktop DDR5 RAM', 'Desktop DDR4 RAM', 'Laptop RAM'] },
      { title: 'GPU', items: ['NVIDIA RTX 4090 / 4080', 'NVIDIA RTX 4070 / 4060', 'AMD Radeon RX'] }
    ]
  },
  {
    title: 'Monitor',
    slug: 'monitor',
    subcategories: [
      { title: 'Gaming Monitor', items: ['144Hz / 165Hz Monitors', '240Hz Gaming Monitors', 'OLED Monitors'] },
      { title: '4K & Professional', items: ['4K UHD Monitors', 'IPS Color Accurate Monitors'] }
    ]
  },
  { title: 'GPU', slug: 'gpu' },
  { title: 'Processor', slug: 'processor' },
  { title: 'Motherboard', slug: 'motherboard' },
  { title: 'RAM', slug: 'ram' },
  { title: 'Storage', slug: 'storage' },
  { title: 'Power Supply', slug: 'psu' },
  { title: 'Casing', slug: 'casing' },
  { title: 'Networking', slug: 'networking' },
  { title: 'Accessories', slug: 'accessories' },
  { title: 'Gaming', slug: 'accessories' },
  { title: 'Mobile', slug: 'accessories' },
  { title: 'Smart Watch', slug: 'smartwatch' },
  { title: 'Camera', slug: 'camera' },
  { title: 'Office', slug: 'accessories' },
  { title: 'Software', slug: 'software' }
];

export default function Navbar() {
  const router = useNextRouter();
  const { cart, wishlist, compareItems, user } = useShop();

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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';
      fetch(`${apiUrl}/api/products?search=${encodeURIComponent(searchQuery.trim())}`)
        .then(res => res.json())
        .then(data => {
          const list = Array.isArray(data) ? data : (data.products || []);
          setSuggestions(list.slice(0, 5));
          setShowSuggestions(true);
        })
        .catch(() => {
          // Fallback searching in local mock
          import('@/data/mock-products').then(({ MOCK_PRODUCTS }) => {
            const q = searchQuery.toLowerCase();
            const filtered = MOCK_PRODUCTS.filter(p =>
              p.name.toLowerCase().includes(q) ||
              p.brand.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q)
            ).slice(0, 5);
            setSuggestions(filtered);
            setShowSuggestions(true);
          });
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
    <header className="w-full z-50 sticky top-0 bg-white shadow-sm border-b border-slate-200">
      
      {/* MONARCH IT ROYAL BLUE TOP HEADER (~74px height) */}
      <div className="bg-gradient-to-r from-[#0f2bb0] via-[#1337b8] to-[#0e2482] text-white px-4 lg:px-8 py-3.5 min-h-[74px]">
        <div className="max-w-[1320px] mx-auto flex items-center justify-between gap-4">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
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
        <div className="relative flex-1 max-w-2xl hidden md:block">
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
        <div className="flex items-center gap-3 lg:gap-5">
          
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
      <nav className="hidden lg:block bg-white border-y border-slate-200">
        <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between font-sans text-xs font-bold text-slate-800">
          {CATEGORIES_LIST.map((cat, index) => {
            const hasSub = cat.subcategories && cat.subcategories.length > 0;
            return (
              <div
                key={index}
                className="relative group py-3.5 hover:text-orange-600 border-b-2 border-transparent hover:border-orange-600 transition-colors cursor-pointer"
                onMouseEnter={() => setActiveHoverCategory(cat.title)}
                onMouseLeave={() => setActiveHoverCategory(null)}
              >
                <Link href={`/category/${cat.slug}`} className="flex items-center gap-1">
                  <span>{cat.title}</span>
                  {hasSub && <ChevronDown size={12} className="text-slate-400 group-hover:text-orange-600" />}
                </Link>

                {/* Dropdown Flyout */}
                {hasSub && activeHoverCategory === cat.title && (
                  <div className="absolute left-0 top-full mt-0 bg-white border border-slate-200 rounded-b-xl shadow-2xl p-6 min-w-[500px] z-50 grid grid-cols-2 gap-6 text-slate-800 font-normal">
                    {cat.subcategories.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <h5 className="font-bold text-xs text-slate-900 border-b pb-1 flex items-center gap-1">
                          <ChevronRight size={12} className="text-orange-600" />
                          {sub.title}
                        </h5>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {sub.items.map((item, iIdx) => (
                            <li key={iIdx}>
                              <Link href={`/category/${cat.slug}?filter=${encodeURIComponent(item)}`} className="hover:text-orange-600 hover:underline block py-0.5">
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
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
          <div className="relative bg-white w-4/5 max-w-sm h-full shadow-2xl p-6 flex flex-col overflow-y-auto z-10 text-slate-900">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-2 font-black text-xl">
                <span className="text-slate-900">TECH</span>
                <span className="text-orange-600">CORE</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded text-slate-500 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              <Link href="/pc-builder" onClick={() => setMobileMenuOpen(false)} className="bg-blue-600 text-white font-bold px-4 py-2.5 rounded-lg flex items-center gap-2">
                <Wrench size={16} /> PC Builder
              </Link>

              <div className="font-bold text-xs uppercase tracking-wider text-slate-400 pt-3">Categories</div>
              {CATEGORIES_LIST.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 border-b border-slate-100 text-sm font-semibold text-slate-700 hover:text-orange-600"
                >
                  <span>{cat.title}</span>
                  <ChevronRight size={14} className="text-slate-400" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
