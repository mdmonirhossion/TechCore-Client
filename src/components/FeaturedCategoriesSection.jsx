"use client";

import React from 'react';
import Link from 'next/link';
import { MOCK_CATEGORIES } from '@/data/mock-products';
import {
  HardDrive,
  Laptop,
  Cpu,
  Server,
  Monitor,
  MemoryStick,
  Database,
  Zap,
  Box,
  Wifi,
  Headphones,
  Watch,
  Ear,
  Camera,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

const ICON_MAP = {
  HardDrive,
  Laptop,
  Cpu,
  Server,
  Monitor,
  MemoryStick,
  Database,
  Zap,
  Box,
  Wifi,
  Headphones,
  Watch,
  Ear,
  Camera,
  ShieldCheck,
  Smartphone
};

export default function FeaturedCategoriesSection() {
  return (
    <section className="my-10">
      
      {/* Title Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Featured Category
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Get Your Desired Product from Featured Category!
        </p>
      </div>

      {/* Grid: 5 to 8 per row on desktop, 2-3 per row on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {MOCK_CATEGORIES.map((cat) => {
          const IconComponent = ICON_MAP[cat.iconName] || Cpu;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#ea580c] hover:shadow-lg hover:shadow-orange-500/10 group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center mb-2 group-hover:bg-orange-50 group-hover:text-[#ea580c] transition-colors">
                <IconComponent size={20} />
              </div>
              <h3 className="font-bold text-xs text-slate-800 group-hover:text-[#ea580c] transition-colors line-clamp-1">
                {cat.title}
              </h3>
              <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {cat.count}
              </span>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
