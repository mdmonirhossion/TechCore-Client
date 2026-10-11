"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, isApiError } from '@/lib/api';
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

function getCategoryIcon(cat) {
  const s = (cat.slug || cat.name || cat.title || '').toLowerCase();
  if (s.includes('laptop')) return Laptop;
  if (s.includes('monitor')) return Monitor;
  if (s.includes('processor') || s.includes('cpu')) return Cpu;
  if (s.includes('storage') || s.includes('ssd') || s.includes('hdd')) return HardDrive;
  if (s.includes('ram') || s.includes('memory')) return MemoryStick;
  if (s.includes('audio') || s.includes('headphone')) return Headphones;
  if (s.includes('camera')) return Camera;
  if (s.includes('wifi') || s.includes('router')) return Wifi;
  if (s.includes('server')) return Server;
  if (s.includes('watch')) return Watch;
  if (s.includes('phone') || s.includes('mobile')) return Smartphone;
  if (cat.iconName && ICON_MAP[cat.iconName]) return ICON_MAP[cat.iconName];
  return Box;
}

export default function FeaturedCategoriesSection() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCategories()
      .then((data) => {
        if (!isMounted) return;
        if (isApiError(data)) {
          setHasError(true);
          setCategories([]);
        } else {
          setCategories(Array.isArray(data) ? data : []);
          setHasError(false);
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setHasError(true);
        setCategories([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasError && categories.length === 0) {
    return null;
  }

  const displayList = categories.slice(0, 16);
  if (!isLoading && displayList.length === 0) {
    return null;
  }

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
        {isLoading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 mb-2" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
              </div>
            ))
          : displayList.map((cat) => {
              const IconComponent = getCategoryIcon(cat);
              const title = cat.name || cat.title || cat.slug;
              const link = `/category/${cat.fullPath || cat.slug}`;

              return (
                <Link
                  key={cat._id || cat.id || cat.slug}
                  href={link}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#ea580c] hover:shadow-lg hover:shadow-orange-500/10 group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center mb-2 group-hover:bg-orange-50 group-hover:text-[#ea580c] transition-colors">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="font-bold text-xs text-slate-800 group-hover:text-[#ea580c] transition-colors line-clamp-1">
                    {title}
                  </h3>
                  {cat.count && (
                    <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                      {cat.count}
                    </span>
                  )}
                </Link>
              );
            })}
      </div>
    </section>
  );
}
