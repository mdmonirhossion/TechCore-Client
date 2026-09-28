"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Scale, Wrench, ArrowUp, PhoneCall } from 'lucide-react';

export default function FloatingActions() {
  const { cart, compareItems } = useShop();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const cartTotalCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-4 bottom-6 z-40 flex flex-col space-y-3">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-11 h-11 bg-[#081621] hover:bg-[#3749bb] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Compare Floating Button */}
      <Link
        href="/compare"
        className="relative w-11 h-11 bg-[#081621] hover:bg-[#3749bb] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
        title="Compare Products"
      >
        <Scale className="w-5 h-5" />
        {compareItems.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#ef4a23] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
            {compareItems.length}
          </span>
        )}
      </Link>

      {/* PC Builder Floating Button */}
      <Link
        href="/pc-builder"
        className="w-11 h-11 bg-[#3749bb] hover:bg-[#081621] text-white rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
        title="PC Builder Tool"
      >
        <Wrench className="w-5 h-5" />
      </Link>

      {/* Floating Cart Button */}
      <Link
        href="/cart"
        className="relative w-12 h-12 bg-[#ef4a23] hover:bg-[#d63a15] text-white rounded-full flex items-center justify-center shadow-xl transition-all transform hover:scale-105"
        title="View Shopping Cart"
      >
        <ShoppingBag className="w-6 h-6" />
        {cartTotalCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#ef4a23] text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#ef4a23]">
            {cartTotalCount}
          </span>
        )}
      </Link>
    </div>
  );
}
