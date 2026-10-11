"use client";

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ArrowDownAZ } from 'lucide-react';

/**
 * SortSelect:
 * - Updates 'sort' query param in URL
 * - Options:
 *   - Newest (newest)
 *   - Price: Low to High (price_asc)
 *   - Price: High to Low (price_desc)
 *   - Customer Rating (rating)
 * - Resets 'page' to 1 while preserving all other filter params
 */
export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'newest';

  const handleSortChange = (e) => {
    const nextSort = e.target.value;
    const nextParams = new URLSearchParams(searchParams.toString());

    // Reset page to 1
    nextParams.delete('page');

    if (nextSort && nextSort !== 'newest') {
      nextParams.set('sort', nextSort);
    } else {
      nextParams.delete('sort');
    }

    const queryStr = nextParams.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline flex items-center gap-1">
        <ArrowDownAZ size={14} className="text-slate-400" />
        <span>Sort By:</span>
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={handleSortChange}
        className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
      >
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="rating">Top Rated</option>
      </select>
    </div>
  );
}
