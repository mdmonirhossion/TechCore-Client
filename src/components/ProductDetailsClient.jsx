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
  CheckCircle2,
  MessageSquare,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareItems } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState('cash'); // 'cash' or 'emi'
  const [activeTab, setActiveTab] = useState('specs');
  const [reviewsList, setReviewsList] = useState([
    { id: 1, name: 'Tanvir Hasan', rating: 5, date: 'Sept 20, 2026', comment: 'Extremely good performance! Running Cyberpunk 2077 at 1080p Ultra at 95+ FPS with DLSS 3. Official TechCore warranty verified.' },
    { id: 2, name: 'Sabbir Ahmed', rating: 5, date: 'Sept 14, 2026', comment: 'Very fast delivery to Chittagong within 48 hours. Packaging was 100% secure.' }
  ]);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });

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

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    const rev = {
      id: Date.now(),
      name: newReview.name,
      rating: Number(newReview.rating),
      date: 'Just Now',
      comment: newReview.comment
    };
    setReviewsList([rev, ...reviewsList]);
    setNewReview({ name: '', comment: '', rating: 5 });
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Product Summary Grid */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-slate-200 bg-[#f8fafc] flex items-center justify-center p-4">
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain p-4 hover:scale-105 transition-transform duration-300"
              priority
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-[#6b21a8] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
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
                  className={`relative w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 bg-slate-50 ${
                    activeImage === img ? 'border-[#3749bb]' : 'border-slate-200 hover:border-slate-400'
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
            <span className="text-xs font-bold text-[#0284c7] uppercase tracking-wider block mb-1">
              {product.brand || 'ASUS'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-2">
              {product.name}
            </h1>

            {/* Quick Metadata Strip */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {(product.stock ?? 10) > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                Product Code: <strong className="text-slate-900">{product.productCode || 'GPU-BD-4060'}</strong>
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                Warranty: <strong className="text-slate-900">{product.warranty || '3 Years Warranty'}</strong>
              </span>
            </div>
          </div>

          {/* Price & Payment Radio Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            {/* Cash Option */}
            <label
              onClick={() => setPaymentOption('cash')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentOption === 'cash'
                  ? 'border-[#ea580c] bg-orange-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
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
                  <span className="font-bold text-xs text-slate-900">Cash Discount Price</span>
                </div>
                <span className="text-[10px] bg-red-100 text-[#ea580c] font-extrabold px-1.5 py-0.5 rounded">
                  Best Value
                </span>
              </div>
              <div className="mt-2 pl-6">
                <div className="text-2xl font-black text-[#d92d20]">
                  ৳{cashPrice.toLocaleString()}
                </div>
                {regularPrice > cashPrice && (
                  <div className="text-xs text-slate-400 line-through">
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
                  : 'border-slate-200 hover:border-slate-300 bg-white'
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
                <span className="font-bold text-xs text-slate-900">0% Monthly EMI</span>
              </div>
              <div className="mt-2 pl-6">
                <div className="text-xl font-black text-[#3749bb]">
                  ৳{emiMonthly.toLocaleString()} <span className="text-xs font-normal text-slate-500">/ mo</span>
                </div>
                <div className="text-[11px] text-slate-500">Available on 30+ BD Partner Banks</div>
              </div>
            </label>
          </div>

          {/* Stepper Quantity & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold text-slate-700">Quantity:</span>
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-xs font-bold text-slate-900 w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buy Now & Add to Cart Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-[#ea580c] to-[#c2410c] hover:from-orange-700 hover:to-orange-800 text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <Zap className="w-5 h-5" />
                <span>Buy Now</span>
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Wishlist & Compare Links */}
            <div className="flex items-center space-x-6 text-xs pt-2 text-slate-600">
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

      {/* Specification, Reviews & Q&A Tabs */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center space-x-6 border-b pb-2 overflow-x-auto text-xs font-bold">
          {['specs', 'features', 'reviews', 'qa'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 uppercase tracking-wider border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-[#ea580c] text-[#ea580c]'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'specs' ? 'Specifications' : tab === 'features' ? 'Key Features' : tab === 'reviews' ? `Customer Reviews (${reviewsList.length})` : 'Product Q&A'}
            </button>
          ))}
        </div>

        {/* Specs Table */}
        {activeTab === 'specs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {product.specifications ? (
                  Object.entries(product.specifications).map(([key, value], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="p-3 font-semibold text-slate-700 w-1/3 border-b">{key}</td>
                      <td className="p-3 text-slate-900 border-b">{value}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-slate-50">
                    <td className="p-3 font-semibold text-slate-700">Brand</td>
                    <td className="p-3 text-slate-900">{product.brand || 'ASUS'}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Key Features */}
        {activeTab === 'features' && (
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-5">
            {(product.keyFeatures || ['Official Brand Warranty', 'Fast Nationwide Shipping', '0% EMI Facility Available']).map((feat, idx) => (
              <li key={idx} className="marker:text-[#ea580c]">{feat}</li>
            ))}
          </ul>
        )}

        {/* Customer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="space-y-4">
              {reviewsList.map(rev => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{rev.name}</span>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 mt-1">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Submit Review Form */}
            <form onSubmit={handleAddReview} className="p-4 border rounded-xl space-y-3 bg-white">
              <h4 className="font-bold text-xs text-slate-900">Write a Product Review</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="p-2.5 border rounded-lg"
                />
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                  className="p-2.5 border rounded-lg bg-white"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                </select>
              </div>
              <textarea
                rows={3}
                required
                placeholder="Share your experience with this product..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-xs"
              />
              <button
                type="submit"
                className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}

        {/* Q&A Tab */}
        {activeTab === 'qa' && (
          <div className="space-y-4 text-xs text-slate-600">
            <div className="p-4 bg-slate-50 rounded-xl space-y-1 border">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <HelpCircle size={14} className="text-blue-600" /> Q: Does this graphics card require a 12VHPWR cable?
              </div>
              <p className="text-slate-600 pl-5">A: No, the ASUS Dual RTX 4060 uses a standard 1 x 8-pin PCIe power connector.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
