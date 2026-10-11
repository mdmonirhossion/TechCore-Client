"use client";

import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { getProducts, isApiError } from '@/lib/api';
import { Laptop, Sparkles, CheckCircle, Sliders, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const USE_CASES = [
  { id: 'gaming', label: 'Gaming', icon: '🎮', desc: 'High FPS, Discrete RTX Graphics, 144Hz+ Display' },
  { id: 'programming', label: 'Programming & Coding', icon: '💻', desc: 'Fast Multi-core CPU, 16GB+ RAM, High Resolution' },
  { id: 'office', label: 'Office Work & Executive', icon: '💼', desc: 'Lightweight Ultrabook, Long Battery, Clean Design' },
  { id: 'design', label: 'Graphic Design & Editing', icon: '🎨', desc: 'Color Accurate IPS Screen, Powerful GPU & SSD' },
  { id: 'student', label: 'Student & Budget', icon: '📚', desc: 'Best Value for money, Durable & Portable' }
];

export default function LaptopFinderPage() {
  const [selectedUseCase, setSelectedUseCase] = useState('gaming');
  const [maxBudget, setMaxBudget] = useState(200000);
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getProducts()
      .then((data) => {
        if (!isMounted) return;
        if (isApiError(data)) {
          setHasError(true);
          setAllProducts([]);
        } else {
          setAllProducts(Array.isArray(data) ? data : []);
          setHasError(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setHasError(true);
        setAllProducts([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const recommendedLaptops = useMemo(() => {
    const laptops = (allProducts || []).filter((p) => {
      const cat = (p.category || p.categorySlug || '').toLowerCase();
      return cat.includes('laptop');
    });

    return laptops.filter((laptop) => {
      const price = Number(laptop.discountPrice || laptop.price || 0);
      if (price > maxBudget) return false;

      if (selectedBrand !== 'ALL' && (laptop.brand || '').toUpperCase() !== selectedBrand) {
        return false;
      }

      if (
        selectedUseCase === 'gaming' &&
        !laptop.name.toLowerCase().includes('tuf') &&
        !laptop.name.toLowerCase().includes('legion') &&
        !laptop.name.toLowerCase().includes('victus') &&
        !laptop.name.toLowerCase().includes('gaming')
      ) {
        return false;
      }

      return true;
    });
  }, [allProducts, selectedUseCase, maxBudget, selectedBrand]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e1726] to-[#1e293b] text-white p-8 rounded-2xl shadow-xl space-y-3">
        <span className="bg-orange-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1">
          <Sparkles size={14} /> Guided Finder
        </span>
        <h1 className="text-3xl font-black text-white">Find Your Perfect Laptop in Minutes</h1>
        <p className="text-xs text-slate-300 max-w-xl">
          Select your primary use case and budget. TechCore algorithms will match the best performance laptops with official brand warranty.
        </p>
      </div>

      {/* Step 1: Use Case Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>Step 1: What will you use the laptop for?</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {USE_CASES.map((uc) => (
            <div
              key={uc.id}
              onClick={() => setSelectedUseCase(uc.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedUseCase === uc.id
                  ? 'border-orange-600 bg-orange-50/50 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">{uc.icon}</div>
              <h3 className="font-bold text-xs text-slate-900">{uc.label}</h3>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Budget & Brand Preferences */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <span>Step 2: Choose Your Budget & Brand</span>
        </h2>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="font-bold text-xs text-slate-900">Maximum Budget</label>
            <span className="text-sm font-black text-orange-600">৳{maxBudget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="40000"
            max="450000"
            step="10000"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            className="w-full accent-orange-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
            <span>৳40,000</span>
            <span>৳4,50,000</span>
          </div>
        </div>

        <div>
          <label className="font-bold text-xs text-slate-900 block mb-2">Preferred Brand</label>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'ASUS', 'LENOVO', 'HP', 'MSI', 'DELL'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                  selectedBrand === b
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-black text-slate-900">Recommended Laptops</h2>
          <span className="text-xs text-slate-500 font-semibold">
            {isLoading ? 'Loading...' : `${recommendedLaptops.length} Laptops Matched`}
          </span>
        </div>

        {isLoading ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
            <Loader2 size={32} className="text-orange-600 animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Searching matching laptops...</p>
          </div>
        ) : hasError ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-rose-200 space-y-3">
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Could Not Load Laptops</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Unable to connect to the store server. Please check your connection or try again later.
            </p>
          </div>
        ) : recommendedLaptops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendedLaptops.map((laptop) => (
              <ProductCard key={laptop.id || laptop._id} product={laptop} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 text-xs">
            No laptops found matching your exact budget and filters. Try increasing max budget.
          </div>
        )}
      </div>
    </div>
  );
}
