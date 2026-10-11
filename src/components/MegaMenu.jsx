"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ChevronRight, 
  Cpu, 
  Laptop, 
  Monitor, 
  HardDrive, 
  Headphones, 
  Wifi, 
  Layers, 
  Gamepad2, 
  ShieldCheck,
  Server,
  Database,
  MemoryStick,
  Box,
  Smartphone,
  Watch,
  Camera
} from 'lucide-react';

const ICON_MAP = {
  Cpu,
  Laptop,
  Monitor,
  Tv: Monitor,
  HardDrive,
  Headphones,
  Wifi,
  Layers,
  Gamepad2,
  ShieldCheck,
  Server,
  Database,
  MemoryStick,
  Box,
  Smartphone,
  Watch,
  Camera
};

function resolveCategoryIcon(iconProp) {
  if (!iconProp) return Cpu;
  if (typeof iconProp === 'function') return iconProp;
  if (typeof iconProp === 'object' && iconProp.$$typeof) return iconProp;
  if (typeof iconProp === 'string' && ICON_MAP[iconProp]) return ICON_MAP[iconProp];
  return Cpu;
}

export default function MegaMenu({ categoryTree = [], categories = categoryTree, isOpen, onClose }) {
  if (isOpen === false) return null;

  const list = Array.isArray(categories) && categories.length > 0 ? categories : (Array.isArray(categoryTree) ? categoryTree : []);
  const [activeCat, setActiveCat] = useState(list[0] || null);

  if (list.length === 0) {
    return null;
  }

  return (
    <div className="relative bg-[#081621] text-white border-t border-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 py-1 text-sm font-medium overflow-x-auto scrollbar-none">
          {list.map((cat, idx) => {
            const Icon = resolveCategoryIcon(cat.icon);
            const catTitle = cat.name || cat.title || '';
            const catPath = cat.fullPath || cat.slug || '';
            const subcategories = cat.children || cat.subcategories || [];

            return (
              <div 
                key={cat.id || idx} 
                className="group relative inline-block text-left"
                onMouseEnter={() => setActiveCat(cat)}
              >
                <Link
                  href={`/category/${catPath}`}
                  className="flex items-center space-x-2 px-3 py-2.5 rounded-md hover:bg-[#3749bb] transition-colors whitespace-nowrap text-gray-200 hover:text-white"
                >
                  <Icon className="w-4 h-4 text-[#ef4a23] group-hover:text-white" />
                  <span>{catTitle}</span>
                </Link>

                {/* Dropdown Flyout */}
                {subcategories.length > 0 && (
                  <div className="hidden group-hover:block fixed left-0 right-0 top-[110px] w-full bg-white text-gray-800 shadow-2xl z-50 border-t-2 border-[#3749bb]">
                    <div className="max-w-7xl mx-auto p-6 grid grid-cols-4 gap-6">
                      {subcategories.map((sub, sIdx) => {
                        const subTitle = sub.name || sub.title || '';
                        const subPath = sub.fullPath || sub.slug || '';
                        const items = sub.children || sub.items || [];

                        return (
                          <div key={sub.id || sIdx} className="space-y-2">
                            <Link 
                              href={`/category/${subPath}`}
                              className="font-bold text-sm text-[#081621] hover:text-[#3749bb] flex items-center group/title border-b pb-1"
                            >
                              <span>{subTitle}</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover/title:opacity-100 transition-opacity text-[#ef4a23]" />
                            </Link>
                            {items.length > 0 && (
                              <ul className="space-y-1 text-xs text-gray-600">
                                {items.map((item, itemIdx) => {
                                  const itemTitle = item.name || item.title || (typeof item === 'string' ? item : '');
                                  const itemPath = item.fullPath || item.slug || (typeof item === 'string' ? `${subPath}/${item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}` : subPath);

                                  return (
                                    <li key={item.id || itemIdx}>
                                      <Link 
                                        href={`/category/${itemPath}`} 
                                        className="hover:text-[#ef4a23] hover:underline block py-0.5"
                                      >
                                        {itemTitle}
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
