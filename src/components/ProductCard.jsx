"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShoppingCart, Zap, Heart, Scale, Star } from 'lucide-react';

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareItems } = useShop();

  if (!product) return null;

  const pId = product.id || product._id;
  const pName = product.name || 'Unnamed Product';
  const pPrice = Number(product.discountPrice || product.price || 0);
  const pOldPrice = Number(product.price && product.discountPrice ? product.price : 0);
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

  return (
    <div className="product-card group">
      {/* Badge Tag */}
      {product.badge && (
        <span className="badge-tag z-10">
          {product.badge}
        </span>
      )}

      {/* Quick Quick Wishlist & Compare Hover Actions */}
      <div className="absolute top-2 right-2 z-10 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
            isWishlisted ? 'text-rose-600 bg-rose-50' : 'text-gray-400 hover:text-rose-600'
          }`}
          title="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCompare(product);
          }}
          className={`w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center transition-colors ${
            isCompared ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600'
          }`}
          title="Compare"
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

      {/* Image Box */}
      <Link href={`/product/${pSlug}`} className="product-img-box">
        <Image
          src={pImg}
          alt={pName}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 33vw, 20vw"
          className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      {/* Card Content */}
      <div className="product-card-body">
        <div className="product-brand">{product.brand || 'ASUS'}</div>

        <Link href={`/product/${pSlug}`} className="product-title hover:text-[#ea580c] transition-colors" title={pName}>
          {pName}
        </Link>

        {/* Rating stars */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex text-amber-400">
            <Star className="w-3 h-3 fill-current" />
          </div>
          <span className="text-[11px] font-semibold text-gray-500">{product.rating || '4.8'}</span>
          <span className="text-[10px] text-gray-400">({product.reviewsCount || 12})</span>
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="price-main">৳{pPrice.toLocaleString()}</span>
          {pOldPrice > pPrice && (
            <span className="price-old">৳{pOldPrice.toLocaleString()}</span>
          )}
        </div>

        {/* Card Actions: Buy Now & Add to Cart */}
        <div className="product-card-actions">
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-[#ea580c] hover:bg-[#d97706] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1 shadow-sm transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Buy Now</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#3749bb] hover:bg-[#2c3a99] text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center space-x-1 shadow-sm transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Add Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
