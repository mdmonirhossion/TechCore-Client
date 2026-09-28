"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { MOCK_PRODUCTS } from '@/data/mock-products';
import {
  Wrench,
  Plus,
  Trash2,
  ShoppingCart,
  Printer,
  Zap,
  Share2,
  Check,
  AlertTriangle,
  X,
  Cpu,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const BUILDER_CATEGORIES = [
  { key: 'CPU', name: 'Processor / CPU', required: true, icon: '⚡', categorySlug: 'processor', watts: 105 },
  { key: 'CPU Cooler', name: 'CPU Cooler', required: false, icon: '❄️', categorySlug: 'accessories', watts: 15 },
  { key: 'Motherboard', name: 'Motherboard', required: true, icon: '🔌', categorySlug: 'motherboard', watts: 45 },
  { key: 'RAM', name: 'RAM Memory', required: true, icon: '🧠', categorySlug: 'ram', watts: 15 },
  { key: 'GPU', name: 'Graphics Card', required: false, icon: '🎮', categorySlug: 'gpu', watts: 220 },
  { key: 'Storage', name: 'Storage (SSD/HDD)', required: true, icon: '💾', categorySlug: 'storage', watts: 10 },
  { key: 'PSU', name: 'Power Supply Unit', required: true, icon: '🔋', categorySlug: 'psu', watts: 0 },
  { key: 'Casing', name: 'Desktop Casing', required: true, icon: '📦', categorySlug: 'casing', watts: 15 },
  { key: 'Monitor', name: 'Gaming Monitor', required: false, icon: '🖥️', categorySlug: 'monitor', watts: 0 }
];

export default function PCBuilderPage() {
  const { builderSlots, setBuilderComponent, removeBuilderComponent, resetBuilder, addToCart } = useShop();
  const [copied, setCopied] = useState(false);
  const [activeSelectCategory, setActiveSelectCategory] = useState(null);

  const selectedList = Object.values(builderSlots).filter(Boolean);
  const totalPrice = selectedList.reduce((sum, item) => sum + Number(item.discountPrice || item.price || 0), 0);

  // Power Calculation
  const totalWatts = BUILDER_CATEGORIES.reduce((sum, cat) => {
    return builderSlots[cat.key] ? sum + cat.watts : sum;
  }, 0);

  const recommendedPSU = totalWatts > 0 ? Math.ceil((totalWatts * 1.3) / 50) * 50 : 550;

  // Compatibility Checks
  const cpu = builderSlots['CPU'];
  const mobo = builderSlots['Motherboard'];
  let compatibilityStatus = { status: 'compatible', text: '✓ All selected components are compatible' };

  if (cpu && mobo) {
    const isIntelCpu = cpu.name.toLowerCase().includes('intel');
    const isAmdCpu = cpu.name.toLowerCase().includes('amd') || cpu.name.toLowerCase().includes('ryzen');
    const isIntelMobo = mobo.name.toLowerCase().includes('z790') || mobo.name.toLowerCase().includes('b760') || mobo.name.toLowerCase().includes('lga1700');
    const isAmdMobo = mobo.name.toLowerCase().includes('am5') || mobo.name.toLowerCase().includes('am4') || mobo.name.toLowerCase().includes('b650');

    if (isIntelCpu && isAmdMobo) {
      compatibilityStatus = { status: 'incompatible', text: '✕ Incompatible: Intel CPU cannot be used with AMD Socket Motherboard' };
    } else if (isAmdCpu && isIntelMobo) {
      compatibilityStatus = { status: 'incompatible', text: '✕ Incompatible: AMD Ryzen CPU cannot be used with Intel Socket Motherboard' };
    }
  }

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

  const handleAddAllToCart = () => {
    selectedList.forEach(item => addToCart(item, 1));
    alert('All PC components added to your cart!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Printable Invoice Header (Visible only when printing) */}
      <div id="printable-invoice-area" className="hidden print:block p-8">
        <div className="flex justify-between border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">TECHCORE BD</h1>
            <p className="text-xs text-slate-500">Official Computer Quotation & Custom Rig Spec</p>
          </div>
          <div className="text-right text-xs">
            <p>Date: {new Date().toLocaleDateString()}</p>
            <p>Quotation Ref: #TC-BUILD-8819</p>
          </div>
        </div>

        <table className="w-full text-xs border-collapse border border-slate-200 mb-6">
          <thead>
            <tr className="bg-slate-100 border-b">
              <th className="p-2 border text-left">Component</th>
              <th className="p-2 border text-left">Product Title</th>
              <th className="p-2 border text-right">Price (BDT)</th>
            </tr>
          </thead>
          <tbody>
            {BUILDER_CATEGORIES.map(cat => {
              const item = builderSlots[cat.key];
              return (
                <tr key={cat.key} className="border-b">
                  <td className="p-2 border font-bold">{cat.name}</td>
                  <td className="p-2 border">{item ? item.name : 'Not Selected'}</td>
                  <td className="p-2 border text-right">
                    {item ? `৳${(item.discountPrice || item.price).toLocaleString()}` : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex justify-between items-center text-sm font-bold border-t pt-4">
          <span>Total Estimated Quotation:</span>
          <span className="text-base">৳{totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="print:hidden space-y-6">
        
        {/* Banner */}
        <div className="bg-[#0e1726] text-white p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md">
              <Wrench size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black">Custom PC Builder</h1>
              <p className="text-xs text-slate-300">Select components step-by-step with live wattage & compatibility check</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleShare}
              className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-700 text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer size={14} />
              <span>Print Quote</span>
            </button>
            <button
              onClick={handleAddAllToCart}
              disabled={selectedList.length === 0}
              className="bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md disabled:opacity-50"
            >
              <ShoppingCart size={14} />
              <span>Add All Cart</span>
            </button>
          </div>
        </div>

        {/* Sticky Status & Wattage Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Total Est. Wattage</span>
            <strong className="text-sm text-blue-600 flex items-center gap-1 mt-0.5">
              <Zap size={16} className="text-amber-500 fill-amber-500" /> {totalWatts}W (Rec. PSU: {recommendedPSU}W)
            </strong>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block">Compatibility Status</span>
            <span className={`text-xs font-bold block mt-0.5 ${
              compatibilityStatus.status === 'incompatible' ? 'text-red-600' : 'text-emerald-600'
            }`}>
              {compatibilityStatus.text}
            </span>
          </div>

          <div className="md:text-right">
            <span className="text-[11px] font-semibold text-slate-400 block">Estimated Price</span>
            <strong className="text-xl font-black text-[#d92d20]">৳{totalPrice.toLocaleString()}</strong>
          </div>
        </div>

        {/* Component Selector Slots */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-sm">
          {BUILDER_CATEGORIES.map((cat) => {
            const item = builderSlots[cat.key];
            return (
              <div key={cat.key} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1">
                      <span>{cat.name}</span>
                      {cat.required && <span className="text-red-500">*</span>}
                    </h4>
                    {item ? (
                      <p className="text-xs font-semibold text-blue-600 line-clamp-1 mt-0.5">{item.name}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-0.5">No item selected</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  {item ? (
                    <>
                      <span className="text-xs font-black text-[#d92d20]">
                        ৳{Number(item.discountPrice || item.price || 0).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeBuilderComponent(cat.key)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove component"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setActiveSelectCategory(cat)}
                      className="bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} />
                      <span>Choose</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Select Component Modal */}
      {activeSelectCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveSelectCategory(null)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl p-6 overflow-y-auto z-10 text-slate-900 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Select {activeSelectCategory.name}
              </h3>
              <button onClick={() => setActiveSelectCategory(null)} className="p-1 rounded text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {MOCK_PRODUCTS.filter(p => p.category.toLowerCase() === activeSelectCategory.categorySlug.toLowerCase() || activeSelectCategory.categorySlug === 'processor').map((prod) => (
                <div
                  key={prod.id || prod._id}
                  className="flex items-center justify-between p-3 border rounded-xl hover:border-blue-500 cursor-pointer transition-all hover:bg-blue-50/40"
                  onClick={() => {
                    setBuilderComponent(activeSelectCategory.key, prod);
                    setActiveSelectCategory(null);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative bg-slate-50 rounded border flex-shrink-0">
                      <Image src={Array.isArray(prod.images) ? prod.images[0] : prod.image} alt={prod.name} fill className="object-contain p-1" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{prod.name}</h4>
                      <span className="text-[11px] text-slate-500">{prod.brand}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-xs text-[#d92d20]">
                      ৳{(prod.discountPrice || prod.price).toLocaleString()}
                    </div>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded mt-1 inline-block">
                      Select
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
