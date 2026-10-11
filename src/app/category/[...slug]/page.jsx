import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, PackageX, RotateCcw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import {
  getCategoryByPath,
  getCategoryFilters,
  getCategoryProducts,
  deriveFacetsFromProducts
} from '@/lib/categories';
import FilterSidebar from '@/components/category/FilterSidebar';
import MobileFilterSheet from '@/components/category/MobileFilterSheet';
import SortSelect from '@/components/category/SortSelect';
import Pagination from '@/components/category/Pagination';

export const revalidate = 60;

export async function generateMetadata({ params, searchParams }) {
  const resolvedParams = await params;
  const sParams = await searchParams;
  const slugArray = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : (resolvedParams?.slug ? [resolvedParams.slug] : []);
  const fullPath = slugArray.join('/');

  const categoryData = await getCategoryByPath(fullPath);
  if (!categoryData || !categoryData.category) {
    return {
      title: 'Category Not Found | TechCore'
    };
  }

  const category = categoryData.category;
  const catName = category.name || category.title || fullPath;
  const title = category.seoTitle || `${catName} Price in Bangladesh | TechCore`;
  const description =
    category.seoDescription ||
    `Buy authentic ${catName} at the best price in Bangladesh with official brand warranty, 0% EMI, and fast nationwide delivery.`;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techcorebd.com';
  const canonicalUrl = `${baseUrl.replace(/\/+$/, '')}/category/${fullPath}`;

  // Check if any filter params exist in searchParams
  const hasFilterParams = Object.keys(sParams || {}).some(
    (k) =>
      ['brand', 'stockStatus', 'minPrice', 'maxPrice', 'sort', 'inStock'].includes(k) ||
      k.startsWith('spec_')
  );

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    robots: {
      index: !hasFilterParams,
      follow: true
    }
  };
}

export default async function CategoryListingPage({ params, searchParams }) {
  const resolvedParams = await params;
  const sParams = await searchParams;
  const slugArray = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : (resolvedParams?.slug ? [resolvedParams.slug] : []);
  const fullPath = slugArray.join('/');

  if (!fullPath) {
    notFound();
  }

  // 1. Fetch category resolution by path (breadcrumb, children)
  const categoryData = await getCategoryByPath(fullPath);
  if (!categoryData || !categoryData.category) {
    notFound();
  }

  const { category, breadcrumb = [], children = [] } = categoryData;
  const categoryTitle = category.name || category.title || fullPath;

  // 2. Fetch products and filter facets concurrently
  const [productsData, rawFacets] = await Promise.all([
    getCategoryProducts(fullPath, sParams),
    getCategoryFilters(fullPath)
  ]);

  const products = productsData.products || [];
  const totalProducts = productsData.total ?? products.length;
  const currentPage = productsData.page || 1;
  const totalPages = productsData.totalPages || 1;

  // Use facets from backend or derive from available products
  const facets =
    rawFacets && (rawFacets.brands?.length > 0 || rawFacets.specs?.length > 0 || rawFacets.priceRange?.max > 0)
      ? rawFacets
      : deriveFacetsFromProducts(products);

  // Check if any filter is active
  const hasActiveFilters = Object.keys(sParams || {}).some(
    (k) =>
      ['brand', 'stockStatus', 'minPrice', 'maxPrice', 'inStock'].includes(k) ||
      k.startsWith('spec_')
  );

  return (
    <div className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Breadcrumb Trail */}
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
            <React.Fragment key={crumb.id || idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              {isLast ? (
                <span className="font-bold text-slate-900 dark:text-white capitalize flex-shrink-0">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={`/category/${crumb.fullPath || crumb.slug}`}
                  className="hover:text-orange-600 capitalize flex-shrink-0 transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* 2. Category Showcase Banner */}
      <div className="bg-gradient-to-r from-[#0e1726] to-[#1e293b] text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-2.5 py-1 rounded-full inline-block mb-1.5">
            Category Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{categoryTitle}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            {category.seoDescription || `Explore 100% authentic ${categoryTitle} products with official brand warranty in Bangladesh.`}
          </p>
        </div>
        <div className="text-xs font-black bg-orange-600 text-white px-4 py-2 rounded-xl shadow-md whitespace-nowrap">
          {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'} Found
        </div>
      </div>

      {/* 3. Subcategory Chips (from children) */}
      {children.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subcategories</div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {children.map((child) => (
              <Link
                key={child.id || child.slug}
                href={`/category/${child.fullPath}`}
                className="whitespace-nowrap px-3.5 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50 transition-all shadow-sm flex-shrink-0"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 4. Main Listing Content: Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24">
          <FilterSidebar facets={facets} />
        </div>

        {/* Products Grid & Controls */}
        <div className="lg:col-span-3 space-y-5">
          {/* Controls Bar: Item count & Sort Select */}
          <div className="bg-white dark:bg-slate-900 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Showing <span className="font-bold text-slate-900 dark:text-white">{products.length}</span> of{' '}
              <span className="font-bold text-slate-900 dark:text-white">{totalProducts}</span> items
            </span>
            <SortSelect />
          </div>

          {/* Product Grid or Friendly Empty State */}
          {products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-orange-50 dark:bg-slate-800 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                <PackageX size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No products found matching your filters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Try loosening your filters or resetting them to view all products in {categoryTitle}.
              </p>
              {hasActiveFilters ? (
                <Link
                  href={`/category/${fullPath}`}
                  className="inline-flex items-center gap-1.5 bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Reset filters</span>
                </Link>
              ) : (
                <Link
                  href="/products"
                  className="inline-block bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Explore Catalog Products
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 5. Mobile Sticky Filter Sheet */}
      <MobileFilterSheet facets={facets} totalProducts={totalProducts} />
    </div>
  );
}
