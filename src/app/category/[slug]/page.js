import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { MOCK_CATEGORIES } from '@/data/mock-products';
import { ChevronRight, PackageX } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const catObj = MOCK_CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  const catTitle = catObj ? catObj.title : slug.toUpperCase();

  return {
    title: `${catTitle} Price in Bangladesh | TechCore Store`,
    description: `Shop genuine ${catTitle} with official manufacturer warranty, 0% EMI facility, and fast nationwide shipping in Bangladesh from TechCore.`
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const allProducts = await getProducts();

  const categoryObj = MOCK_CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
  const categoryTitle = categoryObj ? categoryObj.title : slug.toUpperCase();

  const slugNorm = slug.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Strict category matching - NEVER fallback to random products from other categories!
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

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/products" className="hover:text-orange-600">Categories</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900 dark:text-white capitalize">{categoryTitle}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e1726] to-[#1e293b] text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-3 py-1 rounded-full inline-block mb-2">
            Category Showcase
          </span>
          <h1 className="text-3xl font-black text-white">{categoryTitle}</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Explore 100% authentic {categoryTitle} products with official brand warranty in Bangladesh.
          </p>
        </div>
        <div className="text-xs font-extrabold bg-orange-600 text-white px-4 py-2 rounded-xl shadow-md">
          {categoryProducts.length} Items Found
        </div>
      </div>

      {/* Product Grid or Clean Empty State */}
      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categoryProducts.map(product => (
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
            Currently there are no active products under this category in MongoDB database.
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition-colors"
          >
            Explore All Catalog Products
          </Link>
        </div>
      )}

    </div>
  );
}
