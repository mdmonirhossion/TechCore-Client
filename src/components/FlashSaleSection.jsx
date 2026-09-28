"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, Flame } from 'lucide-react';

export default function FlashSaleSection({ products = [] }) {
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 8);

  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 25, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!flashSaleProducts || flashSaleProducts.length === 0) return null;

  const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <section className="bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border border-orange-200/80 rounded-2xl p-6 my-8 shadow-sm">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 border-b border-orange-200/60 pb-4">
        
        {/* Title & Countdown */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md animate-pulse">
              <Flame size={20} />
            </div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
              Flash Sale Deals
            </h2>
          </div>

          {/* Countdown timer */}
          <div className="flex items-center gap-1.5 font-mono font-bold text-xs text-white">
            <span className="bg-slate-900 px-2.5 py-1.5 rounded-lg shadow-sm">
              {padZero(timeLeft.hours)}
            </span>
            <span className="text-slate-900 font-extrabold text-sm">:</span>
            <span className="bg-slate-900 px-2.5 py-1.5 rounded-lg shadow-sm">
              {padZero(timeLeft.minutes)}
            </span>
            <span className="text-slate-900 font-extrabold text-sm">:</span>
            <span className="bg-orange-600 px-2.5 py-1.5 rounded-lg shadow-sm">
              {padZero(timeLeft.seconds)}
            </span>
          </div>
        </div>

        {/* View All */}
        <Link
          href="/offers"
          className="text-xs font-bold text-[#ea580c] hover:text-orange-700 hover:underline flex items-center gap-1"
        >
          <span>View All Deals</span>
          <ArrowRight size={14} />
        </Link>

      </div>

      {/* Grid: 4 products desktop, 3 tablet, 2 mobile, 1 small mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashSaleProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

    </section>
  );
}
