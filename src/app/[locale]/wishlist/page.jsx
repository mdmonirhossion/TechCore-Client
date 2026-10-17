"use client";

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useShop } from '@/context/ShopContext';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 text-[#ef4a23] rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#081621]">Your Wishlist is Empty</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Save your favorite laptops, components or gaming accessories by clicking the heart icon on any product card!
        </p>
        <Link
          href="/"
          className="inline-block bg-[#ef4a23] hover:bg-[#d63a15] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          Discover Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621] flex items-center">
          <Heart className="w-6 h-6 mr-2 text-[#ef4a23]" /> My Wishlist ({wishlist.length} saved)
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
