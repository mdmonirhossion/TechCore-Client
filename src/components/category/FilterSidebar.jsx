"use client";

import React, { useState, useEffect, useMemo, useId } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, RotateCcw, Search, Check } from 'lucide-react';

/**
 * FilterSidebar component:
 * - Filter state lives in the URL (router.replace, scroll: false)
 * - Any filter change resets page to 1
 * - Debounced price range (400ms) with 2 native range inputs + 2 number inputs
 * - Stock status / Availability with counts
 * - Brand checkboxes with search box when > 8 items & scrollable list
 * - Dynamic specification groups based on facets returned by the API
 * - Active filter count & Reset all button
 */
export default function FilterSidebar({
  facets = {},
  className = ''
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Collapsible section states
  const [collapsed, setCollapsed] = useState({
    price: false,
    availability: false,
    brand: false
  });

  const toggleSection = (sectionKey) => {
    setCollapsed((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const facetPriceRange = facets.priceRange || { min: 0, max: 0 };
  const facetMin = typeof facetPriceRange.min === 'number' ? facetPriceRange.min : 0;
  const facetMax = typeof facetPriceRange.max === 'number' ? facetPriceRange.max : 0;

  // URL searchParams values
  const urlMinPrice = searchParams.get('minPrice');
  const urlMaxPrice = searchParams.get('maxPrice');
  const urlBrand = searchParams.get('brand') || '';
  const urlStock = searchParams.get('stockStatus') || '';

  // Local state for debounced price inputs
  const [localMin, setLocalMin] = useState(urlMinPrice !== null ? Number(urlMinPrice) : facetMin);
  const [localMax, setLocalMax] = useState(urlMaxPrice !== null ? Number(urlMaxPrice) : facetMax);

  // Sync local price inputs when URL params or facet bounds change
  useEffect(() => {
    setLocalMin(urlMinPrice !== null ? Number(urlMinPrice) : facetMin);
  }, [urlMinPrice, facetMin]);

  useEffect(() => {
    setLocalMax(urlMaxPrice !== null ? Number(urlMaxPrice) : facetMax);
  }, [urlMaxPrice, facetMax]);

  // Brand search query when brands > 8
  const [brandSearch, setBrandSearch] = useState('');

  // Helper to update URL filter state
  const updateUrlFilters = (updates) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    // Any filter change resets page to 1
    nextParams.delete('page');

    Object.entries(updates).forEach(([key, val]) => {
      if (val === null || val === undefined || val === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(val));
      }
    });

    const queryStr = nextParams.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
  };

  // Debounced price range sync to URL (400ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const curMin = searchParams.get('minPrice');
      const curMax = searchParams.get('maxPrice');
      const targetMin = localMin > facetMin ? localMin : null;
      const targetMax = localMax < facetMax ? localMax : null;

      const hasMinChanged = targetMin !== (curMin !== null ? Number(curMin) : null);
      const hasMaxChanged = targetMax !== (curMax !== null ? Number(curMax) : null);

      if (hasMinChanged || hasMaxChanged) {
        updateUrlFilters({
          minPrice: targetMin,
          maxPrice: targetMax
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [localMin, localMax, facetMin, facetMax]);

  // Handle Multi-select (comma-separated values)
  const handleToggleMultiValue = (paramKey, value) => {
    const currentStr = searchParams.get(paramKey) || '';
    const currentList = currentStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let nextList;
    if (currentList.some((item) => item.toLowerCase() === value.toLowerCase())) {
      nextList = currentList.filter((item) => item.toLowerCase() !== value.toLowerCase());
    } else {
      nextList = [...currentList, value];
    }

    updateUrlFilters({
      [paramKey]: nextList.length > 0 ? nextList.join(',') : null
    });
  };

  // Reset all filters
  const handleResetAll = () => {
    const nextParams = new URLSearchParams();
    // Preserve sort if present
    const sort = searchParams.get('sort');
    if (sort) nextParams.set('sort', sort);
    const queryStr = nextParams.toString();
    router.replace(queryStr ? `${pathname}?${queryStr}` : pathname, { scroll: false });
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (urlMinPrice !== null || urlMaxPrice !== null) count += 1;
    if (urlStock) count += urlStock.split(',').filter(Boolean).length;
    if (urlBrand) count += urlBrand.split(',').filter(Boolean).length;
    for (const [key, val] of searchParams.entries()) {
      if (key.startsWith('spec_') && val) {
        count += val.split(',').filter(Boolean).length;
      }
    }
    return count;
  }, [searchParams, urlMinPrice, urlMaxPrice, urlStock, urlBrand]);

  // Filtered brands for search box
  const brandsList = facets.brands || [];
  const filteredBrands = useMemo(() => {
    if (!brandSearch.trim()) return brandsList;
    const q = brandSearch.toLowerCase();
    return brandsList.filter((b) => b.name.toLowerCase().includes(q));
  }, [brandsList, brandSearch]);

  const selectedBrands = useMemo(() => {
    return new Set(urlBrand.split(',').map((b) => b.trim().toLowerCase()).filter(Boolean));
  }, [urlBrand]);

  const selectedStock = useMemo(() => {
    return new Set(urlStock.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean));
  }, [urlStock]);

  const specsList = facets.specs || [];

  return (
    <aside className={`w-full space-y-5 text-slate-800 dark:text-slate-200 ${className}`}>
      {/* Sidebar Header & Active Filters Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            Filters
          </h3>
          {activeFilterCount > 0 && (
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={handleResetAll}
            className="flex items-center gap-1 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline hover:text-orange-700 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset all</span>
          </button>
        )}
      </div>

      {/* 1. PRICE RANGE ACCORDION */}
      {facetMax > facetMin && (
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
          >
            <span>Price Range</span>
            {collapsed.price ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {!collapsed.price && (
            <div className="mt-3 space-y-3">
              {/* Range Inputs */}
              <div className="space-y-1">
                <input
                  type="range"
                  min={facetMin}
                  max={facetMax}
                  value={localMin}
                  onChange={(e) => {
                    const val = Math.min(Number(e.target.value), localMax);
                    setLocalMin(val);
                  }}
                  className="w-full accent-orange-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
                <input
                  type="range"
                  min={facetMin}
                  max={facetMax}
                  value={localMax}
                  onChange={(e) => {
                    const val = Math.max(Number(e.target.value), localMin);
                    setLocalMax(val);
                  }}
                  className="w-full accent-orange-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              </div>

              {/* Number Inputs */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Min (৳)</label>
                  <input
                    type="number"
                    min={facetMin}
                    max={localMax}
                    value={localMin}
                    onChange={(e) => setLocalMin(Number(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <span className="text-slate-400 text-xs mt-3">-</span>
                <div className="flex-1">
                  <label className="text-[10px] text-slate-400 block mb-0.5">Max (৳)</label>
                  <input
                    type="number"
                    min={localMin}
                    max={facetMax}
                    value={localMax}
                    onChange={(e) => setLocalMax(Number(e.target.value) || 0)}
                    className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. AVAILABILITY ACCORDION */}
      {facets.availability && (
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('availability')}
            className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
          >
            <span>Availability</span>
            {collapsed.availability ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {!collapsed.availability && (
            <div className="mt-3 space-y-2">
              {[
                { key: 'IN_STOCK', label: 'In Stock', count: facets.availability.IN_STOCK },
                { key: 'PRE_ORDER', label: 'Pre Order', count: facets.availability.PRE_ORDER },
                { key: 'UP_COMING', label: 'Up Coming', count: facets.availability.UP_COMING }
              ].map(({ key, label, count }) => {
                if (count === undefined || count === null) return null;
                const checked = selectedStock.has(key);
                return (
                  <label
                    key={key}
                    className="flex items-center justify-between text-xs cursor-pointer select-none group"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleMultiValue('stockStatus', key)}
                        className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer accent-orange-600"
                      />
                      <span className={`group-hover:text-orange-600 transition-colors ${checked ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {label}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 3. BRAND ACCORDION */}
      {brandsList.length > 0 && (
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
          >
            <span>Brand</span>
            {collapsed.brand ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          {!collapsed.brand && (
            <div className="mt-3 space-y-2">
              {/* Search box when > 8 brands */}
              {brandsList.length > 8 && (
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    placeholder="Search Brand..."
                    className="w-full pl-7 pr-2 py-1 text-xs rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <Search size={12} className="absolute left-2 top-2 text-slate-400" />
                </div>
              )}

              {/* Scrollable brand checkboxes */}
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {filteredBrands.map((b) => {
                  const checked = selectedBrands.has(b.name.toLowerCase());
                  return (
                    <label
                      key={b.name}
                      className="flex items-center justify-between text-xs cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleMultiValue('brand', b.name)}
                          className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer accent-orange-600"
                        />
                        <span className={`group-hover:text-orange-600 transition-colors ${checked ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {b.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">({b.count})</span>
                    </label>
                  );
                })}
                {filteredBrands.length === 0 && (
                  <div className="text-center py-2 text-slate-400 text-xs">No brand found</div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SPECIFICATION GROUPS ACCORDIONS */}
      {specsList.map((specGroup) => {
        const paramKey = `spec_${specGroup.key}`;
        const activeUrlStr = searchParams.get(paramKey) || '';
        const selectedSpecs = new Set(
          activeUrlStr.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
        );
        const isCollapsed = Boolean(collapsed[paramKey]);

        return (
          <div key={specGroup.key} className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <button
              type="button"
              onClick={() => toggleSection(paramKey)}
              className="w-full flex items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white"
            >
              <span>{specGroup.label}</span>
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </button>

            {!isCollapsed && (
              <div className="mt-3 max-h-56 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                {specGroup.values.map((v) => {
                  const checked = selectedSpecs.has(v.value.toLowerCase());
                  return (
                    <label
                      key={v.value}
                      className="flex items-center justify-between text-xs cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleMultiValue(paramKey, v.value)}
                          className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4 cursor-pointer accent-orange-600"
                        />
                        <span className={`group-hover:text-orange-600 transition-colors ${checked ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {v.value}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">({v.count})</span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
