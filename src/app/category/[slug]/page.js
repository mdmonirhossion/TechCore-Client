import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { MOCK_CATEGORIES } from '@/data/mock-products';
import { ChevronRight, Filter } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const catObj = MOCK_CATEGORIES.find(c => c.slug === slug);
  const catTitle = catObj ? catObj.title : slug.toUpperCase();

  return {
    title: `${catTitle} Price in Bangladesh | TechCore Store`,
    description: `Shop genuine ${catTitle} with official manufacturer warranty, 0% EMI facility, and fast nationwide shipping in Bangladesh from TechCore.`
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const allProducts = await getProducts();

  const categoryObj = MOCK_CATEGORIES.find(c => c.slug === slug);
  const categoryTitle = categoryObj ? categoryObj.title : slug.toUpperCase();

  const categoryProducts = allProducts.filter(p =>
    p.category.toLowerCase() === slug.toLowerCase() ||
    (slug === 'gpu' && p.category === 'gpu') ||
    (slug === 'processor' && p.category === 'processor') ||
    (slug === 'laptop' && p.category === 'laptop') ||
    (slug === 'desktop' && p.category === 'desktop') ||
    (slug === 'monitor' && p.category === 'monitor')
  );

  const displayList = categoryProducts.length > 0 ? categoryProducts : allProducts.slice(0, 8);

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/products" className="hover:text-orange-600">Categories</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900 capitalize">{categoryTitle}</span>
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
          {displayList.length} Items Found
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayList.map(product => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>

    </div>
  );
}
