"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

/**
 * MobileFilterSheet:
 * - Visible on screens below lg (lg:hidden)
 * - Sticky bottom or floating filter trigger button with active count
 * - Slide-over / Bottom sheet containing FilterSidebar
 * - Body scroll lock while open
 * - "Show N products" confirmation button to dismiss sheet
 */
export default function MobileFilterSheet({
  facets = {},
  totalProducts = 0
}) {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  // Active filter count
  const activeCount = React.useMemo(() => {
    let count = 0;
    if (searchParams.get('minPrice') || searchParams.get('maxPrice')) count += 1;
    if (searchParams.get('stockStatus')) count += searchParams.get('stockStatus').split(',').filter(Boolean).length;
    if (searchParams.get('brand')) count += searchParams.get('brand').split(',').filter(Boolean).length;
    for (const [key, val] of searchParams.entries()) {
      if (key.startsWith('spec_') && val) {
        count += val.split(',').filter(Boolean).length;
      }
    }
    return count;
  }, [searchParams]);

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (isOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* Sticky mobile filter bar trigger */}
      <div className="lg:hidden sticky bottom-4 z-40 flex justify-center w-full px-4 pointer-events-none">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="pointer-events-auto bg-[#0e1726] dark:bg-slate-800 text-white shadow-2xl border border-slate-700/60 hover:bg-orange-600 transition-all px-6 py-3 rounded-full flex items-center gap-2.5 font-bold text-xs tracking-wide active:scale-95"
        >
          <SlidersHorizontal size={15} className="text-orange-500" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* Drawer Overlay & Bottom Sheet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Bottom Sheet Modal */}
          <div className="relative bg-white dark:bg-slate-900 w-full max-h-[85vh] rounded-t-3xl shadow-2xl flex flex-col z-10 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-orange-600" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Filter Products
                </h3>
                {activeCount > 0 && (
                  <span className="bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {activeCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
              <FilterSidebar facets={facets} />
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-98 text-center"
              >
                Show {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
