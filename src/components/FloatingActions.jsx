"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Scale, ArrowUp, Sun, Moon } from 'lucide-react';

export default function FloatingActions() {
  const { cart, compareItems, theme, toggleTheme } = useShop();
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartTotalCount = mounted ? cart.reduce((total, item) => total + item.quantity, 0) : 0;
  const compareCount = mounted ? compareItems.length : 0;

  return (
    <div className="fixed right-3 bottom-6 z-50 flex flex-col items-center gap-2">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 bg-slate-900 hover:bg-[#ea580c] text-white rounded-lg flex items-center justify-center shadow-lg transition-all transform hover:scale-105 mb-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* FLOATING THEME TOGGLE BUTTON */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle Dark/Light Theme"
        title={mounted && theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="relative bg-[#0f172a] hover:bg-amber-600 text-white w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-2xl transition-all transform hover:scale-105 border border-slate-700/50 group"
      >
        {mounted && theme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-400 group-hover:text-white transition-colors" />
        ) : (
          <Moon className="w-5 h-5 text-slate-200 group-hover:text-white transition-colors" />
        )}
        <span className="text-[10px] font-extrabold tracking-tight mt-0.5">
          {mounted && theme === 'dark' ? 'Light' : 'Dark'}
        </span>
      </button>

      {/* MONARCH IT COMPARE FLOATING BUTTON */}
      <Link
        href="/compare"
        className="relative bg-[#0f172a] hover:bg-blue-600 text-white w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-2xl transition-all transform hover:scale-105 border border-slate-700/50 group"
        title="Compare Products"
      >
        <span className="absolute -top-1.5 -right-1.5 bg-[#d92d20] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
          {compareCount}
        </span>
        <Scale className="w-5 h-5 text-slate-200 group-hover:text-white" />
        <span className="text-[10px] font-extrabold tracking-tight mt-0.5">Compare</span>
      </Link>

      {/* MONARCH IT CART FLOATING BUTTON */}
      <Link
        href="/cart"
        className="relative bg-[#0f172a] hover:bg-[#ea580c] text-white w-14 h-14 rounded-xl flex flex-col items-center justify-center shadow-2xl transition-all transform hover:scale-105 border border-slate-700/50 group"
        title="View Shopping Cart"
      >
        <span className="absolute -top-1.5 -right-1.5 bg-[#d92d20] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow">
          {cartTotalCount}
        </span>
        <ShoppingBag className="w-5 h-5 text-slate-200 group-hover:text-white" />
        <span className="text-[10px] font-extrabold tracking-tight mt-0.5">Cart</span>
      </Link>
    </div>
  );
}


