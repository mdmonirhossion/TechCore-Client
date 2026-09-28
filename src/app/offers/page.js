import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { Gift, Zap, Flame, Clock, Sparkles } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'Latest Offers, Gadget Fest & Flash Deals | TechCore BD',
    description: 'Explore active discount offers, gadget fest, happy hour deals, and promotional laptop & computer component prices in Bangladesh.'
  };
}

export default async function OffersPage() {
  const products = await getProducts();
  const offerProducts = products.filter(p => p.discountPrice && p.price > p.discountPrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-700 text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-white/20 text-white text-xs font-black uppercase px-3.5 py-1 rounded-full backdrop-blur-md inline-flex items-center gap-1">
            <Gift size={14} /> Official Gadget Fest 2026
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Special Mega Offers & Flash Deals
          </h1>
          <p className="text-xs md:text-sm text-orange-100 max-w-lg">
            Get up to 25% discount, free gifts (smartwatch/earbuds), and 0% EMI up to 36 months on selected laptops and PC components.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center space-y-2">
          <span className="text-xs font-extrabold uppercase text-amber-200 block">Offer Ends In</span>
          <div className="font-mono text-2xl font-black text-white flex items-center gap-2">
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg">02</span>:
            <span className="bg-slate-900 px-3 py-1.5 rounded-lg">14</span>:
            <span className="bg-orange-500 px-3 py-1.5 rounded-lg">45</span>
          </div>
        </div>
      </div>

      {/* Offer Products Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Flame className="text-orange-600" />
            <span>Active Promotion Products ({offerProducts.length})</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {offerProducts.map(product => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>

    </div>
  );
}
