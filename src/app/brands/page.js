import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_BRANDS } from '@/data/mock-products';
import { Award, ChevronRight } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'All Computer & Electronics Brands in Bangladesh | TechCore',
    description: 'Browse computer, laptop, GPU, processor, and monitor brands in BD including ASUS, MSI, HP, Lenovo, Intel, AMD, Corsair, Samsung, PowerColor, and Gigabyte.'
  };
}

export default function BrandsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">All Brands</span>
      </nav>

      <div className="bg-[#0e1726] text-white p-8 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 px-3 py-1 rounded-full inline-block mb-2">
            Authorized Brands
          </span>
          <h1 className="text-3xl font-black text-white">Official Brand Partners</h1>
          <p className="text-xs text-slate-300 mt-1">
            Discover top international computer manufacturers with official warranty in BD.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {MOCK_BRANDS.map(brand => (
          <Link
            key={brand.id}
            href={`/brand/${brand.id}`}
            className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg hover:border-orange-500 hover:-translate-y-1 transition-all group"
          >
            <div className="w-16 h-16 relative bg-slate-50 rounded-xl mb-3 flex items-center justify-center p-2 group-hover:scale-105 transition-transform border">
              <Image src={brand.logo} alt={brand.name} fill className="object-contain p-2" />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-orange-600 transition-colors">
              {brand.name}
            </h3>
            <span className="text-[10px] text-slate-400 font-bold mt-1">Explore Products →</span>
          </Link>
        ))}
      </div>

    </div>
  );
}
