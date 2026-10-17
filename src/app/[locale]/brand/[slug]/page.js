import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts, getBrands, isApiError } from '@/lib/api';
import { ChevronRight, Award, AlertCircle } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brandName = slug.toUpperCase();

  return {
    title: `${brandName} Products & Laptops Price in Bangladesh | TechCore`,
    description: `Buy official ${brandName} laptops, graphics cards, processors, and monitors with official manufacturer warranty in Bangladesh at TechCore.`
  };
}

export default async function BrandLandingPage({ params }) {
  const { slug } = await params;
  const [allProducts, brands] = await Promise.all([getProducts(), getBrands()]);

  const brandName = slug.toUpperCase();
  const brandObj = (brands || []).find(
    (b) =>
      (b.slug && b.slug.toLowerCase() === slug.toLowerCase()) ||
      (b.id && String(b.id).toLowerCase() === slug.toLowerCase()) ||
      (b._id && String(b._id).toLowerCase() === slug.toLowerCase()) ||
      (b.name && b.name.toLowerCase() === slug.toLowerCase())
  );

  const brandProducts = (allProducts || []).filter(
    (p) =>
      (p.brand || '').toLowerCase() === slug.toLowerCase() ||
      (p.brand || '').toUpperCase() === brandName ||
      (brandObj && (p.brand || '').toLowerCase() === (brandObj.name || '').toLowerCase())
  );

  const hasProductError = isApiError(allProducts);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/brands" className="hover:text-orange-600">Brands</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">{brandName}</span>
      </nav>

      {/* Brand Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2">
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/80 px-3 py-1 rounded-full inline-block">
            Official Brand Showcase
          </span>
          <h1 className="text-3xl font-black text-white">{brandObj ? brandObj.name : brandName} Bangladesh</h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Browse official {brandObj ? brandObj.name : brandName} laptops, PC components, and accessories with authorized warranty support.
          </p>
        </div>

        <div className="bg-white text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md">
          {brandProducts.length} Products Available
        </div>
      </div>

      {/* Brand Products Grid or Error State */}
      {hasProductError ? (
        <div className="bg-white border border-rose-200 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">Could Not Load Products</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Unable to connect to the store server. Please check your connection or try again later.
          </p>
        </div>
      ) : brandProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {brandProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs">
          No products currently available for {brandObj ? brandObj.name : brandName}.
        </div>
      )}
    </div>
  );
}
