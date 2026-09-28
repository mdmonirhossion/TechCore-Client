"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { Scale, Trash2, ShoppingCart, Eye, Printer } from 'lucide-react';

export default function ComparePage() {
  const { compareItems, toggleCompare, addToCart } = useShop();
  const [highlightDiff, setHighlightDiff] = useState(false);

  if (compareItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-[#3749bb] rounded-full flex items-center justify-center mx-auto">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#081621]">No Products Selected for Comparison</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Add up to 4 products from any category or product detail page to compare their specs side-by-side.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#3749bb] hover:bg-[#2c3a99] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#081621] flex items-center">
            <Scale className="w-6 h-6 mr-2 text-[#3749bb]" /> Product Comparison
          </h1>
          <p className="text-xs text-gray-500 mt-1">Comparing {compareItems.length} products side-by-side</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setHighlightDiff(!highlightDiff)}
            className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors ${
              highlightDiff ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{highlightDiff ? 'Highlighting Differences' : 'Highlight Differences'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1 bg-[#081621] hover:bg-[#3749bb] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Spec Sheet</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-4 font-bold text-gray-700 w-48 min-w-[12rem]">Product Info</th>
              {compareItems.map((prod) => {
                const pImg = Array.isArray(prod.images) && prod.images.length > 0
                  ? prod.images[0]
                  : (prod.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

                return (
                  <th key={prod.id || prod._id} className="p-4 border-l min-w-[16rem]">
                    <div className="space-y-3">
                      <button
                        onClick={() => toggleCompare(prod)}
                        className="text-xs text-red-500 hover:underline flex items-center float-right"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </button>
                      <div className="relative w-32 h-32 mx-auto bg-gray-50 rounded-xl overflow-hidden border">
                        <Image src={pImg} alt={prod.name} fill className="object-contain p-2" />
                      </div>
                      <h3 className="font-bold text-xs text-[#081621] text-center line-clamp-2">{prod.name}</h3>
                      <div className="text-center font-extrabold text-sm text-[#ef4a23]">
                        ৳{Number(prod.discountPrice || prod.price || 0).toLocaleString()}
                      </div>
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="w-full bg-[#3749bb] hover:bg-[#2c3a99] text-white font-bold py-2 rounded-lg flex items-center justify-center space-x-1"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr className={highlightDiff ? 'bg-amber-50/60' : ''}>
              <td className="p-4 font-bold text-gray-700 bg-gray-50">Brand</td>
              {compareItems.map((prod) => (
                <td key={prod.id || prod._id} className="p-4 border-l font-semibold text-gray-900">
                  {prod.brand || 'ASUS'}
                </td>
              ))}
            </tr>
            <tr className={highlightDiff ? 'bg-amber-50/60' : ''}>
              <td className="p-4 font-bold text-gray-700 bg-gray-50">Category</td>
              {compareItems.map((prod) => (
                <td key={prod.id || prod._id} className="p-4 border-l text-gray-800">
                  {prod.category || 'Component'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-gray-700 bg-gray-50">Availability</td>
              {compareItems.map((prod) => (
                <td key={prod.id || prod._id} className="p-4 border-l font-bold text-emerald-600">
                  {prod.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
