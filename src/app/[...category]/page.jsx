import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { ChevronRight, Filter, PackageX } from 'lucide-react';

export const revalidate = 60; // ISR for category pages

export async function generateMetadata({ params }) {
  const categorySegments = (await params).category || [];
  const titleFormatted = categorySegments
    .map(s => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    .join(' - ');

  return {
    title: `${titleFormatted || 'Products'} Price in Bangladesh | TechCore`,
    description: `Buy ${titleFormatted || 'Tech Products'} at best price in Bangladesh with warranty and fast delivery.`
  };
}

export default async function CategoryPage({ params }) {
  const categorySegments = (await params).category || [];
  const lastSegment = categorySegments.length > 0 ? categorySegments[categorySegments.length - 1] : '';

  const allProducts = await getProducts();

  const slugNorm = lastSegment.toLowerCase().replace(/[^a-z0-9]/g, '');

  const categoryProducts = allProducts.filter(p => {
    if (!p.category) return false;
    const catNorm = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (catNorm === slugNorm || catNorm.includes(slugNorm) || slugNorm.includes(catNorm)) return true;
    if (slugNorm === 'psu' && (catNorm.includes('power') || catNorm.includes('psu'))) return true;
    if (slugNorm === 'gpu' && (catNorm.includes('graphics') || catNorm.includes('gpu') || catNorm.includes('card'))) return true;
    if (slugNorm === 'processor' && (catNorm.includes('cpu') || catNorm.includes('processor'))) return true;
    if (slugNorm === 'ram' && (catNorm.includes('memory') || catNorm.includes('ram'))) return true;
    if (slugNorm === 'storage' && (catNorm.includes('ssd') || catNorm.includes('hdd') || catNorm.includes('storage'))) return true;
    if (slugNorm === 'casing' && (catNorm.includes('case') || catNorm.includes('casing'))) return true;
    if (slugNorm === 'smartwatch' && (catNorm.includes('watch') || catNorm.includes('smart'))) return true;
    return false;
  });

  const categoryTitle = lastSegment ? lastSegment.replace(/-/g, ' ').toUpperCase() : 'ALL PRODUCTS';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb Trail */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        {categorySegments.map((seg, idx) => {
          const path = `/${categorySegments.slice(0, idx + 1).join('/')}`;
          const isLast = idx === categorySegments.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
              {isLast ? (
                <span className="font-semibold text-slate-900 dark:text-white capitalize">
                  {seg.replace(/-/g, ' ')}
                </span>
              ) : (
                <Link href={path} className="hover:text-orange-600 capitalize">
                  {seg.replace(/-/g, ' ')}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="hidden lg:block space-y-6 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
              <Filter className="w-4 h-4 mr-2 text-[#ea580c]" /> Filter Products
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Reset</span>
          </div>

          {/* Availability */}
          <div className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h4 className="font-semibold text-xs text-slate-900 dark:text-white">Availability</h4>
            <label className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              <input type="checkbox" className="rounded text-orange-600" defaultChecked />
              <span>In Stock Only</span>
            </label>
          </div>
        </div>

        {/* Product Grid Header & Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white">{categoryTitle}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Showing {categoryProducts.length} items found</p>
            </div>
          </div>

          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-orange-50 dark:bg-slate-800 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                <PackageX size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No products found in {categoryTitle}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Currently there are no active products under this category.
              </p>
              <Link
                href="/products"
                className="inline-block bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
              >
                Explore All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
