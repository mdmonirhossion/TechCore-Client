"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useShop, createCompareSnapshot } from '@/context/ShopContext';
import { getProductBySlug, getProducts } from '@/lib/api';
import { Scale, Trash2, ShoppingCart, Eye, Printer, ArrowLeft } from 'lucide-react';

function CompareSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-pulse">
      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="h-7 w-56 bg-slate-200 rounded-lg" />
          <div className="h-4 w-40 bg-slate-100 rounded mt-2" />
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-36 bg-slate-200 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-xs min-w-[700px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 w-44 min-w-[11rem] bg-gray-100">
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </th>
              {[1, 2].map((i) => (
                <th key={i} className="p-4 border-l min-w-[16rem]">
                  <div className="space-y-3">
                    <div className="w-32 h-32 mx-auto bg-slate-100 rounded-xl" />
                    <div className="h-4 w-3/4 mx-auto bg-slate-200 rounded" />
                    <div className="h-5 w-24 mx-auto bg-slate-200 rounded" />
                    <div className="h-9 w-full bg-slate-200 rounded-lg" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <tr key={i}>
                <td className="p-4 bg-gray-50 w-44">
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </td>
                {[1, 2].map((j) => (
                  <td key={j} className="p-4 border-l">
                    <div className="h-4 w-32 bg-slate-100 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatSpecKey(key) {
  if (!key) return '';
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

function formatSpecValue(val) {
  if (val === undefined || val === null || val === '') return '—';
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function normalizeForDiff(val) {
  if (val === undefined || val === null) return '';
  return String(val).trim().toLowerCase().replace(/\s+/g, ' ');
}

function getAvailabilityData(prod) {
  const status = prod.stockStatus || (Number(prod.stock) > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK');
  switch (status) {
    case 'IN_STOCK':
      return { label: 'In Stock', className: 'text-emerald-600 font-bold' };
    case 'OUT_OF_STOCK':
      return { label: 'Out of Stock', className: 'text-rose-600 font-bold' };
    case 'PRE_ORDER':
      return { label: 'Pre Order', className: 'text-amber-600 font-bold' };
    case 'UPCOMING':
      return { label: 'Upcoming', className: 'text-blue-600 font-bold' };
    default:
      return { label: status.replace(/_/g, ' '), className: 'text-gray-800 font-medium' };
  }
}

function CompareContent() {
  const searchParams = useSearchParams();
  const {
    compareItems,
    toggleCompare,
    addToCart,
    isHydrated,
    setCompareItems,
    setCompareMessage
  } = useShop();

  const [highlightDiff, setHighlightDiff] = useState(false);
  const [loadingParams, setLoadingParams] = useState(false);
  const processedParamsRef = useRef(false);

  // Parse and fetch query params: ?ids=a,b,c or ?p1=...&p2=...
  useEffect(() => {
    if (!isHydrated || processedParamsRef.current) return;

    const idsParam = searchParams.get('ids');
    const p1Param = searchParams.get('p1');
    const p2Param = searchParams.get('p2');

    if (!idsParam && !p1Param && !p2Param) return;

    processedParamsRef.current = true;
    setLoadingParams(true);

    const loadParams = async () => {
      try {
        const fetchedList = [];

        // 1. Fetch each from ?ids=a,b,c using getProductBySlug (slug endpoint with fallback to id)
        if (idsParam) {
          const rawIds = idsParam.split(',').map((s) => s.trim()).filter(Boolean);
          for (const identifier of rawIds) {
            const product = await getProductBySlug(identifier);
            if (product) {
              const snapshot = createCompareSnapshot(product);
              if (snapshot) fetchedList.push(snapshot);
            }
          }
        }

        // 2. Fetch ?p1= search text: GET /api/products?search=<text>&limit=1 and add first match
        if (p1Param && p1Param.trim()) {
          const results = await getProducts({ search: p1Param.trim(), limit: 1 });
          if (Array.isArray(results) && results.length > 0) {
            const snapshot = createCompareSnapshot(results[0]);
            if (snapshot) fetchedList.push(snapshot);
          }
        }

        // 3. Fetch ?p2= search text: GET /api/products?search=<text>&limit=1 and add first match
        if (p2Param && p2Param.trim()) {
          const results = await getProducts({ search: p2Param.trim(), limit: 1 });
          if (Array.isArray(results) && results.length > 0) {
            const snapshot = createCompareSnapshot(results[0]);
            if (snapshot) fetchedList.push(snapshot);
          }
        }

        if (fetchedList.length > 0) {
          setCompareItems((prev) => {
            const combined = [...fetchedList, ...prev];
            const deduped = [];
            const seen = new Set();
            for (const item of combined) {
              const idKey = String(item.id || item._id);
              const slugKey = String(item.slug || '');
              if (seen.has(idKey) || (slugKey && seen.has(slugKey))) continue;
              seen.add(idKey);
              if (slugKey) seen.add(slugKey);
              deduped.push(item);
            }
            if (deduped.length > 4) {
              setCompareMessage('You can compare a maximum of 4 products at a time.');
            }
            return deduped.slice(0, 4);
          });
        }
      } catch (err) {
        console.error('Error fetching compare products from query params:', err);
      } finally {
        setLoadingParams(false);
      }
    };

    loadParams();
  }, [isHydrated, searchParams, setCompareItems, setCompareMessage]);

  // Show skeleton during hydration or while initial URL params are resolving to prevent flash
  if (!isHydrated || loadingParams) {
    return <CompareSkeleton />;
  }

  // Clean empty state only after full hydration
  if (compareItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-[#3749bb] rounded-full flex items-center justify-center mx-auto">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#081621]">No Products Selected for Comparison</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Add up to 4 products from any category or product detail page to compare their specs side-by-side.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[#3749bb] hover:bg-[#2c3a99] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          <ArrowLeft size={16} />
          <span>Browse Products</span>
        </Link>
      </div>
    );
  }

  // Specifications union across all compared products
  const specKeysUnion = Array.from(
    new Set(
      compareItems.flatMap((p) =>
        p.specifications && typeof p.specifications === 'object'
          ? Object.keys(p.specifications)
          : []
      )
    )
  );

  // Helper to determine if row has differing values among compared items
  const checkRowDiff = (values) => {
    if (values.length <= 1) return false;
    const first = normalizeForDiff(values[0]);
    return values.some((v) => normalizeForDiff(v) !== first);
  };

  // Pre-calculate differences for each built-in row
  const priceValues = compareItems.map((p) => Number(p.discountPrice || p.price || 0));
  const isPriceDiff = checkRowDiff(priceValues);

  const brandValues = compareItems.map((p) => p.brand || '');
  const isBrandDiff = checkRowDiff(brandValues);

  const categoryValues = compareItems.map((p) => p.category || '');
  const isCategoryDiff = checkRowDiff(categoryValues);

  const availabilityValues = compareItems.map((p) => getAvailabilityData(p).label);
  const isAvailabilityDiff = checkRowDiff(availabilityValues);

  const warrantyValues = compareItems.map((p) => p.warranty || '');
  const isWarrantyDiff = checkRowDiff(warrantyValues);

  const ratingValues = compareItems.map((p) => (p.rating !== undefined ? Number(p.rating).toFixed(1) : ''));
  const isRatingDiff = checkRowDiff(ratingValues);

  const emiValues = compareItems.map((p) => (p.emiAvailable ? 'Available' : 'Not Available'));
  const isEmiDiff = checkRowDiff(emiValues);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header Bar */}
      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#081621] flex items-center">
            <Scale className="w-6 h-6 mr-2 text-[#3749bb]" /> Product Comparison
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Comparing {compareItems.length} {compareItems.length === 1 ? 'product' : 'products'} side-by-side (Max 4)
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setHighlightDiff(!highlightDiff)}
            className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
              highlightDiff
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{highlightDiff ? 'Highlighting Differences' : 'Highlight Differences'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 bg-[#081621] hover:bg-[#3749bb] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Spec Sheet</span>
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Table with Sticky First Column */}
      <div className="overflow-x-auto rounded-2xl shadow-sm border border-gray-200 bg-white">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 font-bold text-gray-700 w-44 min-w-[11rem] sticky left-0 z-20 bg-gray-50 border-r border-gray-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                Product Info
              </th>
              {compareItems.map((prod) => {
                const pImg = Array.isArray(prod.images) && prod.images.length > 0
                  ? prod.images[0]
                  : (prod.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

                return (
                  <th key={prod.id} className="p-4 border-r last:border-r-0 border-gray-200 min-w-[16rem] w-[16rem] align-top bg-white">
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleCompare(prod)}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline flex items-center float-right transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>
                      <div className="relative w-32 h-32 mx-auto bg-gray-50 rounded-xl overflow-hidden border border-slate-200">
                        <Image src={pImg} alt={prod.name} fill className="object-contain p-2" />
                      </div>
                      <Link
                        href={`/products/${prod.slug || prod.id}`}
                        className="font-bold text-xs text-[#081621] hover:text-[#3749bb] text-center line-clamp-2 block transition-colors leading-tight"
                        title={prod.name}
                      >
                        {prod.name}
                      </Link>
                      <div className="text-center font-extrabold text-sm text-[#ef4a23]">
                        ৳{Number(prod.discountPrice || prod.price || 0).toLocaleString()}
                        {prod.discountPrice && prod.price && prod.price > prod.discountPrice && (
                          <span className="text-gray-400 line-through text-[11px] block sm:inline sm:ml-1.5 font-normal">
                            ৳{Number(prod.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="w-full bg-[#3749bb] hover:bg-[#2c3a99] text-white font-bold py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Price (with discount) */}
            <tr className={highlightDiff && isPriceDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isPriceDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Price (with discount)
              </td>
              {compareItems.map((prod) => (
                <td
                  key={prod.id}
                  className={`p-4 border-r last:border-r-0 border-gray-200 font-extrabold text-sm ${
                    highlightDiff && isPriceDiff ? 'bg-amber-50/80 text-[#ef4a23]' : 'text-[#ef4a23]'
                  }`}
                >
                  ৳{Number(prod.discountPrice || prod.price || 0).toLocaleString()}
                  {prod.discountPrice && prod.price && prod.price > prod.discountPrice && (
                    <span className="text-gray-400 line-through text-[11px] font-normal ml-2">
                      ৳{Number(prod.price).toLocaleString()}
                    </span>
                  )}
                </td>
              ))}
            </tr>

            {/* Brand */}
            <tr className={highlightDiff && isBrandDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isBrandDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Brand
              </td>
              {compareItems.map((prod) => (
                <td
                  key={prod.id}
                  className={`p-4 border-r last:border-r-0 border-gray-200 font-semibold ${
                    highlightDiff && isBrandDiff ? 'bg-amber-50/80 text-gray-900' : 'text-gray-900'
                  }`}
                >
                  {prod.brand || '—'}
                </td>
              ))}
            </tr>

            {/* Category */}
            <tr className={highlightDiff && isCategoryDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isCategoryDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Category
              </td>
              {compareItems.map((prod) => (
                <td
                  key={prod.id}
                  className={`p-4 border-r last:border-r-0 border-gray-200 ${
                    highlightDiff && isCategoryDiff ? 'bg-amber-50/80 text-gray-900 font-medium' : 'text-gray-800'
                  }`}
                >
                  {prod.category || '—'}
                </td>
              ))}
            </tr>

            {/* Availability (from stockStatus) */}
            <tr className={highlightDiff && isAvailabilityDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isAvailabilityDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Availability
              </td>
              {compareItems.map((prod) => {
                const avail = getAvailabilityData(prod);
                return (
                  <td
                    key={prod.id}
                    className={`p-4 border-r last:border-r-0 border-gray-200 ${avail.className} ${
                      highlightDiff && isAvailabilityDiff ? 'bg-amber-50/80' : ''
                    }`}
                  >
                    {avail.label}
                  </td>
                );
              })}
            </tr>

            {/* Warranty */}
            <tr className={highlightDiff && isWarrantyDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isWarrantyDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Warranty
              </td>
              {compareItems.map((prod) => (
                <td
                  key={prod.id}
                  className={`p-4 border-r last:border-r-0 border-gray-200 ${
                    highlightDiff && isWarrantyDiff ? 'bg-amber-50/80 text-gray-900 font-medium' : 'text-gray-800'
                  }`}
                >
                  {prod.warranty || '—'}
                </td>
              ))}
            </tr>

            {/* Rating */}
            <tr className={highlightDiff && isRatingDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isRatingDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                Rating
              </td>
              {compareItems.map((prod) => (
                <td
                  key={prod.id}
                  className={`p-4 border-r last:border-r-0 border-gray-200 font-semibold text-amber-600 ${
                    highlightDiff && isRatingDiff ? 'bg-amber-50/80' : ''
                  }`}
                >
                  {prod.rating !== undefined && prod.rating !== null ? `★ ${Number(prod.rating).toFixed(1)}` : '—'}
                </td>
              ))}
            </tr>

            {/* EMI */}
            <tr className={highlightDiff && isEmiDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}>
              <td
                className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                  highlightDiff && isEmiDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                }`}
              >
                EMI
              </td>
              {compareItems.map((prod) => (
                <td
                  key={prod.id}
                  className={`p-4 border-r last:border-r-0 border-gray-200 font-medium ${
                    prod.emiAvailable ? 'text-blue-700' : 'text-gray-500'
                  } ${highlightDiff && isEmiDiff ? 'bg-amber-50/80' : ''}`}
                >
                  {prod.emiAvailable ? 'Available' : 'Not Available'}
                </td>
              ))}
            </tr>

            {/* Dynamic Specification Rows from the UNION of all products' specifications */}
            {specKeysUnion.map((key) => {
              const specValues = compareItems.map((p) => formatSpecValue(p.specifications?.[key]));
              const isSpecDiff = checkRowDiff(specValues);

              return (
                <tr
                  key={key}
                  className={highlightDiff && isSpecDiff ? 'bg-amber-50/70' : 'hover:bg-slate-50/50'}
                >
                  <td
                    className={`p-4 font-bold border-r border-gray-200 sticky left-0 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)] ${
                      highlightDiff && isSpecDiff ? 'bg-amber-100/90 text-amber-950 font-extrabold' : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {formatSpecKey(key)}
                  </td>
                  {compareItems.map((prod) => {
                    const formatted = formatSpecValue(prod.specifications?.[key]);
                    return (
                      <td
                        key={prod.id}
                        className={`p-4 border-r last:border-r-0 border-gray-200 ${
                          highlightDiff && isSpecDiff ? 'bg-amber-50/80 text-gray-900 font-semibold' : 'text-gray-800'
                        }`}
                      >
                        {formatted}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<CompareSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
