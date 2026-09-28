"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { Wrench, Plus, Trash2, ShoppingCart, Printer, Zap, Share2, Check } from 'lucide-react';

const builderCategories = [
  { key: 'CPU', name: 'Processor / CPU', required: true, icon: '⚡', defaultWatts: 65 },
  { key: 'Motherboard', name: 'Motherboard', required: true, icon: '🔌', defaultWatts: 45 },
  { key: 'RAM', name: 'Memory (RAM)', required: true, icon: '🧠', defaultWatts: 15 },
  { key: 'GPU', name: 'Graphics Card', required: false, icon: '🎮', defaultWatts: 160 },
  { key: 'SSD', name: 'Storage (SSD/HDD)', required: true, icon: '💾', defaultWatts: 10 },
  { key: 'PSU', name: 'Power Supply Unit', required: true, icon: '🔋', defaultWatts: 0 },
  { key: 'Casing', name: 'Desktop Casing', required: true, icon: '📦', defaultWatts: 15 },
  { key: 'Monitor', name: 'Monitor', required: false, icon: '🖥️', defaultWatts: 0 }
];

export default function PCBuilderPage() {
  const { builderSlots, removeBuilderComponent, resetBuilder, addToCart } = useShop();
  const [copied, setCopied] = useState(false);

  const selectedList = Object.values(builderSlots).filter(Boolean);
  const totalPrice = selectedList.reduce((sum, item) => sum + Number(item.discountPrice || item.price || 0), 0);

  // Calculate wattage
  const totalWatts = builderCategories.reduce((sum, cat) => {
    return builderSlots[cat.key] ? sum + cat.defaultWatts : sum;
  }, 0);

  const recommendedPSU = totalWatts > 0 ? Math.ceil((totalWatts * 1.35) / 50) * 50 : 450;

  const handleAddAllToCart = () => {
    selectedList.forEach(item => addToCart(item, 1));
    alert('All selected PC components have been added to your cart!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#081621] text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-[#ef4a23] text-white rounded-xl flex items-center justify-center">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Custom PC Builder</h1>
            <p className="text-xs text-gray-300">Assemble your custom gaming rig or desktop computer step-by-step</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleShare}
            className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Share PC'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1 bg-gray-800 hover:bg-gray-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Quotation</span>
          </button>
          <button
            onClick={handleAddAllToCart}
            disabled={selectedList.length === 0}
            className="flex items-center space-x-1 bg-[#ef4a23] hover:bg-[#d63a15] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add All to Cart</span>
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
        <div>
          <span className="text-[11px] text-gray-500 font-semibold block">Components Chosen</span>
          <strong className="text-sm text-[#081621]">{selectedList.length} / {builderCategories.length} Items</strong>
        </div>
        <div>
          <span className="text-[11px] text-gray-500 font-semibold block">Estimated Power Draw</span>
          <strong className="text-sm text-[#3749bb] flex items-center justify-center sm:justify-start">
            <Zap className="w-4 h-4 mr-1 text-amber-500" /> {totalWatts}W (Rec. PSU: {recommendedPSU}W)
          </strong>
        </div>
        <div className="sm:text-right">
          <span className="text-[11px] text-gray-500 font-semibold block">Total Estimated Price</span>
          <strong className="text-lg font-black text-[#ef4a23]">৳{totalPrice.toLocaleString()}</strong>
        </div>
      </div>

      {/* Component Slots */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100 shadow-sm">
        {builderCategories.map((cat) => {
          const item = builderSlots[cat.key];
          return (
            <div key={cat.key} className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <span className="text-2xl">{cat.icon}</span>
                <div>
                  <h3 className="font-bold text-xs text-[#081621] flex items-center">
                    <span>{cat.name}</span>
                    {cat.required && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  {item ? (
                    <span className="text-xs font-semibold text-[#3749bb] line-clamp-1">{item.name}</span>
                  ) : (
                    <span className="text-[11px] text-gray-400">No component selected</span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                {item ? (
                  <>
                    <div className="text-right">
                      <div className="text-xs font-black text-[#ef4a23]">
                        ৳{Number(item.discountPrice || item.price || 0).toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => removeBuilderComponent(cat.key)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Remove component"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <Link
                    href={`/component`}
                    className="flex items-center space-x-1 bg-blue-50 hover:bg-[#3749bb] text-[#3749bb] hover:text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Choose</span>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
