"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartQty, removeFromCart, clearCart, subtotal, coupon, applyCouponCode } = useShop();
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const result = applyCouponCode(inputCoupon);
    setCouponMsg(result.message);
  };

  const finalTotal = Math.max(0, subtotal - coupon.discount);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-[#3749bb] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-extrabold text-[#081621]">Your Shopping Cart is Empty</h1>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Looks like you haven&apos;t added any tech gear to your cart yet. Explore our featured products or components!
        </p>
        <Link
          href="/"
          className="inline-block bg-[#ef4a23] hover:bg-[#d63a15] text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621] flex items-center">
          <ShoppingBag className="w-6 h-6 mr-2 text-[#ef4a23]" /> Shopping Cart ({cart.length} items)
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-red-600 hover:underline font-semibold"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative w-16 h-16 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border">
                  <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#081621] line-clamp-2">{item.name}</h3>
                  <div className="text-xs font-extrabold text-[#ef4a23] mt-1">
                    ৳{item.price.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                {/* Qty Stepper */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                  <button
                    onClick={() => updateCartQty(item.id, -1)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#081621]">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQty(item.id, 1)}
                    className="p-1.5 text-gray-600 hover:bg-gray-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-[#081621]">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
            <h2 className="font-extrabold text-base text-[#081621] border-b pb-3">Order Summary</h2>

            {/* Coupon Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-bold text-gray-700 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1 text-[#3749bb]" /> Apply Coupon Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter code (e.g. TECH10)"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  className="w-full text-xs p-2.5 border rounded-xl focus:outline-none focus:border-[#3749bb] uppercase"
                />
                <button
                  type="submit"
                  className="bg-[#081621] hover:bg-[#3749bb] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className="text-[11px] font-semibold text-emerald-600">{couponMsg}</p>
              )}
            </form>

            <div className="space-y-2 text-xs text-gray-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#081621]">৳{subtotal.toLocaleString()}</span>
              </div>
              {coupon.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount ({coupon.code})</span>
                  <span>-৳{coupon.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-xs text-gray-500">Calculated at Checkout</span>
              </div>
              <div className="flex justify-between items-center text-base font-extrabold text-[#081621] border-t pt-3">
                <span className="flex items-center gap-1">
                  Estimated Total <span className="text-[10px] bg-slate-100 text-slate-600 font-normal px-1.5 py-0.5 rounded border">(Display-only)</span>
                </span>
                <span className="text-[#ef4a23]">৳{finalTotal.toLocaleString()}</span>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Note: Total shown is estimated. Final grandTotal will be calculated securely by the server at checkout.
              </p>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-[#ef4a23] hover:bg-[#d63a15] text-white font-extrabold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center text-[11px] text-gray-500 space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Encrypted & Safe Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
