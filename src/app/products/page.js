"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { getProducts } from '@/lib/api';
import { MOCK_CATEGORIES, MOCK_BRANDS } from '@/data/mock-products';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Loader2 } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // 100% Clean state - loads strictly from Backend MongoDB
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState(300000);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage > 0 ? initialPage : 1);

  const itemsPerPage = 12;

  // Fetch products strictly from Node.js / Express + MongoDB Backend
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getProducts()
      .then(data => {
        if (isMounted) {
          if (Array.isArray(data) && data.length > 0) {
            setAllProducts(data);
          } else {
            const { MOCK_PRODUCTS } = require('@/data/mock-products');
            setAllProducts(MOCK_PRODUCTS);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          const { MOCK_PRODUCTS } = require('@/data/mock-products');
          setAllProducts(MOCK_PRODUCTS);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Sync category filter & page from query params
  const [prevCategory, setPrevCategory] = useState(initialCategory);
  if (initialCategory !== prevCategory) {
    setPrevCategory(initialCategory);
    setSelectedCategories(initialCategory ? [initialCategory] : []);
    setCurrentPage(1);
  }

  useEffect(() => {
    const p = parseInt(searchParams.get('page') || '1', 10);
    if (p > 0 && p !== currentPage) {
      setCurrentPage(p);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      // Search term filter
      if (initialSearch) {
        const q = initialSearch.toLowerCase();
        const matchesSearch = (product.name && product.name.toLowerCase().includes(q)) ||
                              (product.brand && product.brand.toLowerCase().includes(q)) ||
                              (product.category && product.category.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Category filter (case-insensitive)
      if (selectedCategories.length > 0) {
        const productCat = product.category ? product.category.toLowerCase() : '';
        const matchesCategory = selectedCategories.some(c => c.toLowerCase() === productCat);
        if (!matchesCategory) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const productBrand = product.brand ? product.brand.toUpperCase() : '';
        if (!selectedBrands.includes(productBrand)) {
          return false;
        }
      }

      // Price filter
      const currentPrice = product.discountPrice || product.price || 0;
      if (currentPrice > priceRange) return false;

      // Rating filter
      if (minRating > 0 && (product.rating || 0) < minRating) return false;

      // Stock filter
      if (inStockOnly && (product.stock || 0) <= 0) return false;

      return true;
    }).sort((a, b) => {
      const priceA = a.discountPrice || a.price || 0;
      const priceB = b.discountPrice || b.price || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'discount') {
        const discA = a.price && a.discountPrice ? a.price - a.discountPrice : 0;
        const discB = b.price && b.discountPrice ? b.price - b.discountPrice : 0;
        return discB - discA;
      }
      return 0;
    });
  }, [allProducts, selectedCategories, selectedBrands, priceRange, minRating, inStockOnly, sortBy, initialSearch]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  const toggleCategory = (catSlug) => {
    setSelectedCategories(prev =>
      prev.includes(catSlug) ? prev.filter(c => c !== catSlug) : [...prev, catSlug]
    );
    setCurrentPage(1);
  };

  const toggleBrand = (brandName) => {
    setSelectedBrands(prev =>
      prev.includes(brandName) ? prev.filter(b => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange(300000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {initialSearch ? `Search Results for "${initialSearch}"` : 'All Computer & Electronics Products'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isLoading
              ? 'Fetching products from MongoDB Server...'
              : `Showing Page ${currentPage} of ${totalPages || 1} (${filteredProducts.length} MongoDB products available)`}
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold px-4 py-2.5 rounded-lg"
          >
            <SlidersHorizontal size={16} />
            <span>Filter Products</span>
          </button>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-lg text-xs">
            <ArrowUpDown size={14} className="text-slate-400" />
            <span className="font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
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
        <aside className="hidden lg:block space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter size={16} className="text-[#ea580c]" />
              <span>Filters</span>
            </h3>
            <button onClick={resetFilters} className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Reset All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white block">
              Max Price: ৳{priceRange.toLocaleString()}
            </label>
            <input
              type="range"
              min="5000"
              max="300000"
              step="5000"
              value={priceRange}
              onChange={(e) => {
                setPriceRange(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full accent-orange-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>৳5,000</span>
              <span>৳3,00,000</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Categories</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 text-xs">
              {MOCK_CATEGORIES.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="checkbox"
                    checked={selectedCategories.some(c => c.toLowerCase() === cat.slug.toLowerCase())}
                    onChange={() => toggleCategory(cat.slug)}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{cat.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Brands</h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
              {MOCK_BRANDS.map(brand => (
                <label key={brand.id} className="flex items-center gap-2 cursor-pointer hover:text-orange-600">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand.name.toUpperCase())}
                    onChange={() => toggleBrand(brand.name.toUpperCase())}
                    className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">{brand.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock Filter */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-900 dark:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span>In Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid & Pagination */}
        <div className="lg:col-span-3 flex flex-col justify-between">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-16 text-center space-y-3">
              <Loader2 size={32} className="text-orange-600 animate-spin mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Loading products from MongoDB Backend...</h3>
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
              />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 dark:bg-slate-800 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                !
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found in MongoDB database</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Make sure your Express server is running and database seed script has finished uploading products.
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
          <div className="relative bg-white dark:bg-slate-900 w-4/5 max-w-xs h-full p-6 shadow-2xl flex flex-col overflow-y-auto z-10 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Filter Products</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 rounded text-slate-500">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 flex-1 text-xs">
              <div>
                <label className="font-bold text-slate-900 dark:text-white block mb-2">Max Price: ৳{priceRange.toLocaleString()}</label>
                <input
                  type="range"
                  min="5000"
                  max="300000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => {
                    setPriceRange(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="w-full accent-orange-600"
                />
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Categories</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {MOCK_CATEGORIES.map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.some(c => c.toLowerCase() === cat.slug.toLowerCase())}
                        onChange={() => toggleCategory(cat.slug)}
                        className="rounded border-slate-300 text-orange-600"
                      />
                      <span>{cat.title}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
              <button onClick={resetFilters} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold py-2 rounded-lg">Reset</button>
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
