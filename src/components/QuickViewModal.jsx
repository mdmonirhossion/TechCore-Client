"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { X, ShoppingCart, Zap, Star, ShieldCheck, Heart, Scale, Plus, Minus } from 'lucide-react';

export default function QuickViewModal({ product, onClose }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareItems } = useShop();

  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const pId = product.id || product._id;
  const pName = product.name || 'Product Details';
  const price = Number(product.discountPrice || product.price || 0);
  const oldPrice = Number(product.price && product.discountPrice ? product.price : 0);
  const pImg = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

  const isWishlisted = wishlist.some(p => (p.id || p._id) === pId);
  const isCompared = compareItems.some(p => (p.id || p._id) === pId);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 overflow-hidden z-10 text-slate-900 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close Quick View"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Left: Product Image */}
          <div className="relative w-full h-64 md:h-80 bg-slate-50 rounded-xl overflow-hidden p-4 border flex items-center justify-center">
            <Image
              src={pImg}
              alt={pName}
              fill
              className="object-contain p-2"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#6b21a8] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="space-y-4">
            
            <div>
              <span className="text-[11px] font-extrabold text-[#0284c7] uppercase tracking-wider">
                {product.brand || 'ASUS'}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 leading-tight mt-0.5">
                {pName}
              </h2>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span>{product.rating || '5.0'}</span>
                </div>
                <span className="text-slate-300">•</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  (product.stock ?? 10) > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                }`}>
                  {(product.stock ?? 10) > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500">{product.warranty || 'Official Warranty'}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-baseline gap-2">
              <span className="text-2xl font-black text-[#d92d20]">
                ৳{price.toLocaleString()}
              </span>
              {oldPrice > price && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Key Features Bullet List */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                {product.keyFeatures.slice(0, 3).map((kf, i) => (
                  <li key={i}>{kf}</li>
                ))}
              </ul>
            )}

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-2.5 py-1 text-slate-600 hover:bg-slate-200"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleBuyNow}
                className="bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-orange-700 hover:to-orange-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <Zap size={14} />
                <span>Buy Now</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <ShoppingCart size={14} />
                <span>Add Cart</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
