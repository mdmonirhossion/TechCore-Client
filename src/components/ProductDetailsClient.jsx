"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { API_BASE_URL } from '@/lib/api';
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
  HelpCircle,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';

export default function ProductDetailsClient({ product }) {
  const router = useRouter();
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareItems, user, token } = useShop();

  const [quantity, setQuantity] = useState(1);
  const [paymentOption, setPaymentOption] = useState('cash'); // 'cash' or 'emi'
  const [activeTab, setActiveTab] = useState('specs');

  // Real Reviews state
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [submittingReview, setSubmittingReview] = useState(false);

  // Real Q&A state
  const [qasList, setQasList] = useState([]);
  const [loadingQa, setLoadingQa] = useState(true);
  const [newQuestion, setNewQuestion] = useState({ name: '', question: '' });
  const [submittingQa, setSubmittingQa] = useState(false);

  const [activeImage, setActiveImage] = useState(
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : (product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop')
  );

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'];

  const pId = product.id || product._id || product.slug;
  const isWishlisted = wishlist.some(p => (p.id || p._id) === pId);
  const isCompared = compareItems.some(p => (p.id || p._id) === pId);

  const brandName = product.brand || 'Generic';
  const skuOrCode = product.productCode || product.sku || pId;
  const emiAvailable = product.emiAvailable !== false;

  const cashPrice = Number(product.discountPrice || product.price || 0);
  const regularPrice = Number(product.price || cashPrice);
  const emiMonthly = Math.round(regularPrice / 12);

  // Fetch real reviews and Q&A from backend server
  useEffect(() => {
    let isMounted = true;
    async function loadReviewsAndQa() {
      if (!pId) return;

      // 1. Fetch real reviews
      try {
        setLoadingReviews(true);
        const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(pId)}/reviews`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            const list = Array.isArray(data.reviews) ? data.reviews : (Array.isArray(data) ? data : []);
            setReviewsList(list);
          }
        }
      } catch (err) {
        console.error('Failed to load reviews from server:', err);
      } finally {
        if (isMounted) setLoadingReviews(false);
      }

      // 2. Fetch real Q&A
      try {
        setLoadingQa(true);
        const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(pId)}/qa`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setQasList(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        console.error('Failed to load Q&A from server:', err);
      } finally {
        if (isMounted) setLoadingQa(false);
      }
    }

    loadReviewsAndQa();
    return () => { isMounted = false; };
  }, [pId]);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    try {
      setSubmittingReview(true);
      const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(pId)}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          rating: Number(newReview.rating),
          comment: newReview.comment,
          name: newReview.name
        })
      });
      if (res.ok) {
        alert('✅ Review submitted successfully! It will appear once approved by moderators.');
        setNewReview({ name: '', comment: '', rating: 5 });
      } else {
        const data = await res.json();
        alert(`Notice: ${data.message || 'Review submitted'}`);
        setNewReview({ name: '', comment: '', rating: 5 });
      }
    } catch (err) {
      alert('Unable to submit review to server. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestion.question) return;
    try {
      setSubmittingQa(true);
      const res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(pId)}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newQuestion.name || (user?.name || 'Customer'),
          question: newQuestion.question
        })
      });
      if (res.ok) {
        alert('✅ Question submitted! Our technical team will answer shortly.');
        setNewQuestion({ name: '', question: '' });
      } else {
        const data = await res.json();
        alert(`Notice: ${data.message || 'Question submitted'}`);
      }
    } catch (err) {
      alert('Unable to submit question to server. Please try again.');
    } finally {
      setSubmittingQa(false);
    }
  };

  // Safely extract specifications whether plain object, Map, or empty
  const getSpecsList = () => {
    if (!product.specifications) return [];
    if (typeof product.specifications === 'object') {
      if (product.specifications instanceof Map) {
        return Array.from(product.specifications.entries());
      }
      return Object.entries(product.specifications).filter(([k, v]) => v !== undefined && v !== null && v !== '');
    }
    return [];
  };
  const specsList = getSpecsList();

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
              {brandName}
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
                Product Code: <strong className="text-slate-900">{skuOrCode}</strong>
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                Warranty: <strong className="text-slate-900">{product.warranty || '3 Years Official Warranty'}</strong>
              </span>
            </div>
          </div>

          {/* Price & Payment Selector */}
          <div className={`grid grid-cols-1 ${emiAvailable ? 'sm:grid-cols-2' : ''} gap-4 pt-2 border-t border-slate-100`}>
            {/* Cash Option */}
            <label
              onClick={() => setPaymentOption('cash')}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                paymentOption === 'cash' || !emiAvailable
                  ? 'border-[#ea580c] bg-orange-50/40 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="paymentOption"
                    checked={paymentOption === 'cash' || !emiAvailable}
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

            {/* EMI Option - conditionally rendered only if emiAvailable is true */}
            {emiAvailable && (
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
            )}
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

      {/* Specification, Features, Reviews & Q&A Tabs */}
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
              {tab === 'specs'
                ? 'Specifications'
                : tab === 'features'
                ? 'Key Features'
                : tab === 'reviews'
                ? `Customer Reviews (${reviewsList.length})`
                : `Product Q&A (${qasList.length})`}
            </button>
          ))}
        </div>

        {/* Specs Table */}
        {activeTab === 'specs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {specsList.length > 0 ? (
                  specsList.map(([key, value], idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="p-3 font-semibold text-slate-700 w-1/3 border-b">{key}</td>
                      <td className="p-3 text-slate-900 border-b">{String(value)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-slate-50">
                    <td className="p-4 text-slate-500 text-center" colSpan={2}>
                      Standard factory specifications apply. Covered by {product.warranty || 'official brand warranty'} from {brandName}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Key Features */}
        {activeTab === 'features' && (
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc pl-5">
            {(Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0
              ? product.keyFeatures
              : ['High Performance Hardware Component', 'Official TechCore Authorized Warranty', 'Fast Nationwide Shipping']
            ).map((feat, idx) => (
              <li key={idx} className="marker:text-[#ea580c]">{feat}</li>
            ))}
          </ul>
        )}

        {/* Real Customer Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {loadingReviews ? (
              <div className="flex items-center justify-center p-8 text-slate-400 gap-2 text-xs">
                <Loader2 className="animate-spin" size={16} />
                <span>Loading customer reviews...</span>
              </div>
            ) : reviewsList.length > 0 ? (
              <div className="space-y-4">
                {reviewsList.map((rev, idx) => (
                  <div key={rev._id || rev.id || idx} className="p-4 bg-slate-50 rounded-xl border space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{rev.name || rev.userName || 'Verified Buyer'}</span>
                      <span className="text-[10px] text-slate-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : (rev.date || 'Recent')}
                      </span>
                    </div>
                    <div className="flex text-amber-400">
                      {Array.from({ length: Number(rev.rating) || 5 }).map((_, i) => (
                        <Star key={i} size={12} className="fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 mt-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-xs border border-dashed">
                <p className="font-semibold text-slate-700">No reviews yet for this product.</p>
                <p className="text-[11px] text-slate-400 mt-1">Be the first to share your experience with other customers!</p>
              </div>
            )}

            {/* Submit Review Form */}
            <form onSubmit={handleAddReview} className="p-4 border rounded-xl space-y-3 bg-white">
              <h4 className="font-bold text-xs text-slate-900">Write a Review for {product.name}</h4>
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
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3/5 Good)</option>
                  <option value={2}>⭐⭐ (2/5 Fair)</option>
                  <option value={1}>⭐ (1/5 Poor)</option>
                </select>
              </div>
              <textarea
                rows={3}
                required
                placeholder="Share your experience with performance, build quality, and value..."
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-xs"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {submittingReview ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                <span>Submit Review</span>
              </button>
            </form>
          </div>
        )}

        {/* Real Product Q&A Tab */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {loadingQa ? (
              <div className="flex items-center justify-center p-8 text-slate-400 gap-2 text-xs">
                <Loader2 className="animate-spin" size={16} />
                <span>Loading product questions...</span>
              </div>
            ) : qasList.length > 0 ? (
              <div className="space-y-4">
                {qasList.map((qa, idx) => (
                  <div key={qa._id || idx} className="p-4 bg-slate-50 rounded-xl space-y-2 border text-xs">
                    <div className="font-bold text-slate-900 flex items-start gap-1.5">
                      <HelpCircle size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Q: {qa.question}</span>
                    </div>
                    <div className="pl-5 text-slate-600">
                      {qa.answer ? (
                        <p className="bg-white p-2.5 rounded-lg border border-slate-200">
                          <strong className="text-slate-900">TechCore Team:</strong> {qa.answer}
                        </p>
                      ) : (
                        <span className="text-[11px] text-amber-600 italic">
                          Awaiting answer from TechCore technical staff...
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500 text-xs border border-dashed">
                <p className="font-semibold text-slate-700">No questions asked about this product yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Have a question regarding compatibility, warranty, or stock? Ask below!</p>
              </div>
            )}

            {/* Ask a Question Form */}
            <form onSubmit={handleAddQuestion} className="p-4 border rounded-xl space-y-3 bg-white">
              <h4 className="font-bold text-xs text-slate-900">Ask a Question About This Product</h4>
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={newQuestion.name}
                onChange={(e) => setNewQuestion({ ...newQuestion, name: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-xs"
              />
              <textarea
                rows={2}
                required
                placeholder="Type your question here (e.g. power supply requirement, physical dimension, compatibility)..."
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                className="w-full p-2.5 border rounded-lg text-xs"
              />
              <button
                type="submit"
                disabled={submittingQa}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                {submittingQa ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
                <span>Ask Question</span>
              </button>
            </form>
          </div>
        )}

      </div>

    </div>
  );
}
