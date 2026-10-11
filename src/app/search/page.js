"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { searchProducts, isApiError } from '@/lib/api';
import { Search, Loader2, AlertCircle } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasError(false);

    searchProducts(query.trim())
      .then((data) => {
        if (!isMounted) return;
        if (isApiError(data)) {
          setHasError(true);
          setResults([]);
        } else {
          setResults(Array.isArray(data) ? data : []);
          setHasError(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setHasError(true);
        setResults([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
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
            {isLoading
              ? 'Searching database...'
              : hasError
              ? 'Unable to load results'
              : `Found ${results.length} matching products`}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center space-y-3">
          <Loader2 size={32} className="text-orange-600 animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Searching products...</h3>
        </div>
      ) : hasError ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Could Not Load Search Results</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Unable to connect to the server. Please check your internet connection or try again later.
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            {query ? `No products match "${query}"` : 'Please enter a search term'}
          </h3>
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
