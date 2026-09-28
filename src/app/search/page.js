"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS } from '@/data/mock-products';
import { Search, Sparkles } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return MOCK_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <Search size={14} /> Search Results
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {query ? `Showing results for "${query}"` : 'Search Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Found {results.length} matching products
          </p>
        </div>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No products match "{query}"</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try searching for common electronics keywords such as RTX 4060, Ryzen 7, Gaming Laptop, Monitor, RAM, or ASUS.
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Searching store...</div>}>
      <SearchContent />
    </Suspense>
  );
}
