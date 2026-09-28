"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Star, 
  Heart, 
  Scale, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareItems } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState('cash'); // 'cash' or 'emi'
  const [activeTab, setActiveTab] = useState('specs');
  const [activeImage, setActiveImage] = useState(
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop')
  );

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'];

  const pId = product.id || product._id;
  const isWishlisted = wishlist.some(p => (p.id || p._id) === pId);
  const isCompared = compareItems.some(p => (p.id || p._id) === pId);

  const cashPrice = Number(product.discountPrice || product.price || 0);
  const regularPrice = Number(product.price || cashPrice + 3500);
  const emiMonthly = Math.round(regularPrice / 12);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  return (
    <div className="space-y-8">
      {/* Top Product Summary Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-gray-200 bg-[#f8fafc] flex items-center justify-center p-4">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain p-4 hover:scale-105 transition-transform duration-300"
              priority
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#ea580c] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 bg-gray-50 ${
                    activeImage === img ? 'border-[#3749bb]' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#081621] leading-tight mb-2">
              {product.name}
            </h1>

            {/* Quick Metadata Strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="bg-blue-50 text-[#3749bb] font-semibold px-2.5 py-1 rounded-md">
                Price: ৳{cashPrice.toLocaleString()}
              </span>
              <span className="bg-green-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                Product Code: <strong className="text-gray-900">{product.productCode || 'GPU-BD-4060'}</strong>
              </span>
              <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md">
                Brand: <strong className="text-gray-900">{product.brand || 'ASUS'}</strong>
              </span>
            </div>
          </div>

          {/* Price & Payment Radio Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
            {/* Cash Option */}
            <label
              onClick={() => setPaymentOption('cash')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentOption === 'cash'
                  ? 'border-[#ea580c] bg-orange-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentOption === 'cash'}
                    onChange={() => setPaymentOption('cash')}
                    className="text-[#ea580c] focus:ring-[#ea580c]"
                  />
                  <span className="font-bold text-xs text-[#081621]">Cash Discount Price</span>
                </div>
                <span className="text-[10px] bg-red-100 text-[#ea580c] font-extrabold px-1.5 py-0.5 rounded">
                  Best Value
                </span>
              </div>
              <div className="mt-2 pl-6">
                <div className="text-xl font-black text-[#ea580c]">
                  ৳{cashPrice.toLocaleString()}
                </div>
                {regularPrice > cashPrice && (
                  <div className="text-xs text-gray-400 line-through">
                    Regular Price: ৳{regularPrice.toLocaleString()}
                  </div>
                )}
              </div>
            </label>

            {/* EMI Option */}
            <label
              onClick={() => setPaymentOption('emi')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentOption === 'emi'
                  ? 'border-[#3749bb] bg-blue-50/40 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="paymentOption"
                  checked={paymentOption === 'emi'}
                  onChange={() => setPaymentOption('emi')}
                  className="text-[#3749bb] focus:ring-[#3749bb]"
                />
                <span className="font-bold text-xs text-[#081621]">Monthly EMI Offer</span>
              </div>
              <div className="mt-2 pl-6">
                <div className="text-xl font-black text-[#3749bb]">
                  ৳{emiMonthly.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ mo</span>
                </div>
                <div className="text-xs text-gray-500">0% EMI for 12 months (30+ Banks)</div>
              </div>
            </label>
          </div>

          {/* Stepper Quantity & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-xs font-bold text-[#081621] w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buy Now & Add to Cart Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <Zap className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#3749bb] hover:bg-[#2c3a99] text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Wishlist & Compare Quick Links */}
            <div className="flex items-center space-x-4 text-xs pt-2 text-gray-600">
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex items-center space-x-1.5 hover:text-[#ea580c] transition-colors ${
                  isWishlisted ? 'text-[#ea580c] font-bold' : ''
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
              </button>

              <button
                onClick={() => toggleCompare(product)}
                className={`flex items-center space-x-1.5 hover:text-[#3749bb] transition-colors ${
                  isCompared ? 'text-[#3749bb] font-bold' : ''
                }`}
              >
                <Scale className="w-4 h-4" />
                <span>{isCompared ? 'Added to Compare' : 'Add to Compare'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Specification & Details Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6">
        <div className="flex items-center space-x-4 border-b pb-2">
          <button
            onClick={() => setActiveTab('specs')}
            className={`font-bold text-sm pb-2 border-b-2 transition-all ${
              activeTab === 'specs'
                ? 'border-[#ea580c] text-[#ea580c]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Specification
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`font-bold text-sm pb-2 border-b-2 transition-all ${
              activeTab === 'features'
                ? 'border-[#ea580c] text-[#ea580c]'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Key Features
          </button>
        </div>

        {activeTab === 'specs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {(product.specifications || []).map((spec, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 font-semibold text-gray-700 w-1/3 border-b">{spec.key}</td>
                    <td className="p-3 text-gray-900 border-b">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'features' && (
          <ul className="space-y-3 text-xs text-gray-700 leading-relaxed list-disc pl-5">
            {(product.keyFeatures || []).map((feat, idx) => (
              <li key={idx} className="marker:text-[#ea580c]">{feat}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
