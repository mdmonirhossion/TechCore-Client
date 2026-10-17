import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import FilterSidebar from '@/components/category/FilterSidebar';
import MobileFilterSheet from '@/components/category/MobileFilterSheet';
import SortSelect from '@/components/category/SortSelect';
import Pagination from '@/components/category/Pagination';
import {
  getCategoryByPath,
  getCategoryFilters,
  getCategoryProducts,
  deriveFacetsFromProducts
} from '@/lib/categories';
import { ChevronRight, PackageX, Layers, Sparkles } from 'lucide-react';

export const revalidate = 60;

/**
 * Generate SEO metadata:
 * - Real category name in title and description
 * - Canonical points to category URL without filter params
 * - robots noindex when filter params exist
 */
export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slugArray = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : (resolvedParams?.slug ? [resolvedParams.slug] : []);
  const fullPath = slugArray.filter(Boolean).join('/');

  if (!fullPath) {
    return { title: 'Category Not Found | TechCore' };
  }

  const categoryData = await getCategoryByPath(fullPath);
  if (!categoryData?.category) {
    return { title: 'Category Not Found | TechCore' };
  }

  const categoryTitle = categoryData.category.name || categoryData.category.title || slugArray[slugArray.length - 1];
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techcore.com.bd';
  const canonicalUrl = `${baseUrl}/category/${fullPath}`;

  // Check if any filter params exist (minPrice, maxPrice, brand, stockStatus, inStock, sort, page, spec_*)
  const filterKeys = Object.keys(resolvedSearchParams || {}).filter(
    (key) => key !== 'slug' && resolvedSearchParams[key] !== undefined && resolvedSearchParams[key] !== ''
  );
  const hasFilterParams = filterKeys.length > 0;

  return {
    title: `${categoryTitle} Price in Bangladesh | TechCore Store`,
    description: `Shop authentic ${categoryTitle} products in Bangladesh with official brand warranty, 0% EMI facility, and fast express delivery from TechCore.`,
    alternates: {
      canonical: canonicalUrl
    },
    robots: hasFilterParams
      ? { index: false, follow: true }
      : { index: true, follow: true }
  };
}

/**
 * Server Component Category Page
 */
export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const slugArray = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : (resolvedParams?.slug ? [resolvedParams.slug] : []);
  const fullPath = slugArray.filter(Boolean).join('/');

  if (!fullPath) {
    notFound();
  }

  // 1. Fetch category resolution by path (breadcrumb, children)
  const categoryData = await getCategoryByPath(fullPath);
  if (!categoryData || !categoryData.category) {
    notFound();
  }

  const { category, breadcrumb = [], children = [] } = categoryData;
  const categoryTitle = category.name || category.title || slugArray[slugArray.length - 1];

  // 2. Fetch category facets and scoped products in parallel
  const page = Math.max(1, Number(resolvedSearchParams?.page) || 1);
  const [facetsRaw, productsResult] = await Promise.all([
    getCategoryFilters(fullPath),
    getCategoryProducts(fullPath, {
      ...resolvedSearchParams,
      limit: 24,
      page
    })
  ]);

  const { products = [], total = 0, totalPages = 1 } = productsResult || {};

  // If server facet filters are empty or 0 and products are present, derive facets from products
  let facets = facetsRaw;
  const hasServerFacets =
    (facets?.brands && facets.brands.length > 0) ||
    (facets?.priceRange && facets.priceRange.max > 0) ||
    (facets?.specs && facets.specs.length > 0);

  if (!hasServerFacets && products.length > 0) {
    facets = deriveFacetsFromProducts(products);
  }

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="hover:text-orange-600 flex-shrink-0 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        <Link href="/products" className="hover:text-orange-600 flex-shrink-0 transition-colors">
          Categories
        </Link>
        {breadcrumb.map((crumb, idx) => {
          const isLast = idx === breadcrumb.length - 1;
          return (
            <React.Fragment key={crumb.fullPath || crumb.slug || idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {isLast ? (
                <span className="font-bold text-slate-900 dark:text-white capitalize flex-shrink-0">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={`/category/${crumb.fullPath}`}
                  className="hover:text-orange-600 capitalize flex-shrink-0 transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 2. Header Banner */}
      <div className="bg-gradient-to-r from-[#0e1726] via-[#111c30] to-[#1e293b] text-white p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold text-orange-400 uppercase tracking-widest bg-orange-950/70 border border-orange-800/60 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-sm">
              <Sparkles size={12} className="text-orange-400" />
              Category Collection
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {categoryTitle}
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Shop genuine {categoryTitle} products with official manufacturer warranty, 0% EMI facility, and fast shipping across Bangladesh.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-black bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl shadow-md whitespace-nowrap transition-colors">
            {total} {total === 1 ? 'Product' : 'Products'} Available
          </div>
        </div>
      </div>

      {/* 3. Subcategory Chips (Horizontal Scrollable Pills) */}
      {children && children.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Layers size={14} className="text-orange-600" />
            <span>Explore Subcategories</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {children.map((child) => {
              const childPath = child.fullPath || `${fullPath}/${child.slug}`;
              return (
                <Link
                  key={childPath}
                  href={`/category/${childPath}`}
                  className="px-4 py-2 text-xs font-bold rounded-full bg-white dark:bg-slate-900 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-orange-600 dark:hover:border-orange-600 transition-all duration-200 whitespace-nowrap shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span>{child.name || child.title}</span>
                  <ChevronRight size={12} className="text-slate-400 group-hover:text-white" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Main Listing Layout (Sidebar + Product Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Filter Sidebar (hidden on mobile) */}
        <div className="hidden lg:block w-72 flex-shrink-0 sticky top-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <FilterSidebar facets={facets} />
        </div>

        {/* Product Column */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 px-4 shadow-sm">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Showing <span className="text-slate-900 dark:text-white font-black">{products.length}</span> of{' '}
              <span className="text-orange-600 font-black">{total}</span> items
            </span>
            <SortSelect />
          </div>

          {/* Products Grid or Empty State */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-orange-50 dark:bg-slate-800 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                <PackageX size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                No products found matching your filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Try widening your price range, clearing selected brands, or resetting all applied filters to view available inventory.
              </p>
              <div>
                <Link
                  href={`/category/${fullPath}`}
                  className="inline-block bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Reset All Filters
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Mobile Filter Sheet Trigger & Bottom Sheet (below lg) */}
      <MobileFilterSheet facets={facets} totalProducts={total} />
    </div>
  );
}
