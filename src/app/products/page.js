"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/data/mock-products';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(200000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync category filter from query params
  const [prevCategory, setPrevCategory] = useState(initialCategory);
  if (initialCategory !== prevCategory) {
    setPrevCategory(initialCategory);
    setSelectedCategories(initialCategory ? [initialCategory] : []);
  }

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      // Search term filter
      if (initialSearch) {
        const q = initialSearch.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(q) ||
                              product.brand.toLowerCase().includes(q) ||
                              product.category.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!selectedCategories.includes(product.category.toLowerCase())) {
          return false;
        }
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(product.brand.toUpperCase())) {
          return false;
        }
      }

      // Price filter
      const currentPrice = product.discountPrice || product.price;
      if (currentPrice > priceRange) return false;

      // Rating filter
      if (minRating > 0 && product.rating < minRating) return false;

      // Stock filter
      if (inStockOnly && product.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') {
        const discA = a.price && a.discountPrice ? a.price - a.discountPrice : 0;
        const discB = b.price && b.discountPrice ? b.price - b.discountPrice : 0;
        return discB - discA;
      }
      return 0;
    });
  }, [selectedCategories, selectedBrands, priceRange, minRating, inStockOnly, sortBy, initialSearch]);

  const toggleCategory = (catSlug) => {
    setSelectedCategories(prev =>
      prev.includes(catSlug) ? prev.filter(c => c !== catSlug) : [...prev, catSlug]
    );
  };

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(200000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {initialSearch ? `Search Results for "${initialSearch}"` : 'All Computer & Electronics Products'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredProducts.length} items out of {MOCK_PRODUCTS.length} total products
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-lg"
          >
            <SlidersHorizontal size={16} />
            <span>Filter Products</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="font-bold text-slate-700 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Best Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Filter size={16} className="text-[#ea580c]" />
              <span>Filters</span>
            </h3>
            <button onClick={resetFilters} className="text-[11px] font-bold text-blue-600 hover:underline">
              Reset All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 block">
              Max Price: ৳{priceRange.toLocaleString()}
            </label>
            <input
              type="range"
              min="5000"
              max="200000"
              step="5000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>৳5,000</span>
              <span>৳2,00,000</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-bold text-slate-900">Categories</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 text-xs">
              {MOCK_CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.slug)}
                    onChange={() => toggleCategory(cat.slug)}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-slate-700">{cat.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-bold text-slate-900">Brands</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
              {MOCK_BRANDS.map(brand => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name.toUpperCase())}
                    onChange={() => toggleBrand(brand.name.toUpperCase())}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-slate-700">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                !
              </div>
              <h3 className="text-lg font-bold text-slate-900">No products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try changing your filters, clearing your search keywords, or selecting a different category.
              </p>
              <button
                onClick={resetFilters}
                className="bg-[#ea580c] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md hover:bg-orange-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative bg-white w-4/5 max-w-xs h-full p-6 shadow-2xl flex flex-col overflow-y-auto z-10 text-slate-900">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-2">Max Price: ৳{priceRange.toLocaleString()}</label>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Categories</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {MOCK_CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.slug)}
                        onChange={() => toggleCategory(cat.slug)}
                        className="rounded border-slate-300 text-orange-600"
                      />
                      <span>{cat.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex gap-2">
              <button onClick={resetFilters} className="flex-1 bg-slate-100 text-slate-800 font-bold py-2 rounded-lg">Reset</button>
              <button onClick={() => setMobileFilterOpen(false)} className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg">Apply</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading products catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
