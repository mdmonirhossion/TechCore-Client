"use client";

import React, { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const TABS = [
  { id: 'all', label: 'All Featured' },
  { id: 'laptop', label: 'Gaming Laptop' },
  { id: 'gpu', label: 'Graphics Card' },
  { id: 'processor', label: 'Processor' },
  { id: 'monitor', label: 'Monitor' },
  { id: 'storage', label: 'SSD Storage' }
];

export default function FeaturedProductsTab({ products = [] }) {
  const [activeTab, setActiveTab] = useState('all');

  const filtered = activeTab === 'all'
    ? products.slice(0, 10)
    : products.filter(p => p.category.toLowerCase() === activeTab.toLowerCase()).slice(0, 10);

  const displayList = filtered.length > 0 ? filtered : products.slice(0, 5);

  return (
    <section className="my-10">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ea580c]" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Featured Products</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Check & Get Your Desired Official Tech Hardware!</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 5 columns desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {displayList.map(product => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

    </section>
  );
}
