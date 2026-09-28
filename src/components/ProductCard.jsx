"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShoppingCart, Zap, Heart, Scale, Star, ShieldCheck, Eye } from 'lucide-react';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareItems } = useShop();
  const [showQuickView, setShowQuickView] = useState(false);

  if (!product) return null;

  const pId = product.id || product._id;
  const pName = product.name || 'Unnamed Product';
  const pPrice = Number(product.discountPrice || product.price || 0);
  const pOldPrice = Number(product.price && product.discountPrice && product.price > product.discountPrice ? product.price : 0);
  const pImg = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop');

  const pSlug = product.slug || pId;
  const isWishlisted = wishlist.some(p => (p.id || p._id) === pId);
  const isCompared = compareItems.some(p => (p.id || p._id) === pId);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const discountAmount = pOldPrice > pPrice ? pOldPrice - pPrice : 0;
  const discountPercent = pOldPrice > pPrice ? Math.round((discountAmount / pOldPrice) * 100) : 0;

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300 relative group">
        
        {/* Top Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {discountPercent > 0 ? (
            <span className="bg-[#6b21a8] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              Save: {discountAmount.toLocaleString()}৳ (-{discountPercent}%)
            </span>
          ) : product.badge ? (
            <span className="bg-[#6b21a8] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {product.badge}
            </span>
          ) : null}

          {product.warranty && (
            <span className="bg-slate-800/80 text-white text-[9px] font-medium px-1.5 py-0.5 rounded flex items-center gap-0.5 backdrop-blur-sm">
              <ShieldCheck size={10} className="text-emerald-400" />
              {product.warranty}
            </span>
          )}
        </div>

        {/* Quick Actions (Wishlist, Compare, Quick View) */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
              isWishlisted ? 'text-red-500 bg-red-50' : 'text-slate-400 hover:text-red-500'
            }`}
            title="Wishlist"
          >
            <Heart size={14} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product);
            }}
            className={`w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
              isCompared ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600'
            }`}
            title="Compare"
          >
            <Scale size={14} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowQuickView(true);
            }}
            className="w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-orange-600 transition-colors"
            title="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Product Image Area (~200px) */}
        <Link href={`/products/${pSlug}`} className="w-full h-48 bg-slate-50 flex items-center justify-center relative overflow-hidden p-4">
          <div className="relative w-full h-full">
            <Image
              src={pImg}
              alt={pName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1200px) 33vw, 20vw"
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Content Area */}
        <div className="p-3.5 flex flex-col flex-1">
          
          {/* Brand & Rating */}
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-[#0284c7] uppercase text-[11px] tracking-wider">
              {product.brand || 'ASUS'}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{product.rating || '5.0'}</span>
            </div>
          </div>

          {/* Product Title (2-line clamp) */}
          <Link
            href={`/products/${pSlug}`}
            className="font-bold text-xs text-slate-900 hover:text-[#ea580c] line-clamp-2 min-h-[2.4rem] transition-colors leading-tight mb-2"
            title={pName}
          >
            {pName}
          </Link>

          {/* Pricing */}
          <div className="mt-auto pt-2 flex items-baseline gap-2 border-t border-slate-100">
            <span className="text-base font-extrabold text-[#d92d20]">
              ৳{pPrice.toLocaleString()}
            </span>
            {pOldPrice > pPrice && (
              <span className="text-xs text-slate-400 line-through">
                ৳{pOldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            <button
              onClick={handleBuyNow}
              className="bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-orange-700 hover:to-orange-800 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Zap size={12} />
              <span>Buy Now</span>
            </button>
            <button
              onClick={handleAddToCart}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <ShoppingCart size={12} />
              <span>Add Cart</span>
            </button>
          </div>

        </div>

      </div>

      {/* Quick View Modal */}
      {showQuickView && (
        <QuickViewModal product={product} onClose={() => setShowQuickView(false)} />
      )}
    </>
  );
}
