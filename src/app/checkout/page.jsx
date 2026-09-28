"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, Award } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, coupon, clearCart } = useShop();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'dhaka',
    notes: '',
    paymentMethod: 'sslcommerz' // 'sslcommerz', 'bkash', 'nagad', 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  // Delivery Charge Logic: Free Delivery over ৳10,000!
  const isFreeDelivery = subtotal >= 10000;
  const shippingCost = isFreeDelivery ? 0 : (formData.city === 'dhaka' ? 60 : 120);
  const grandTotal = Math.max(0, subtotal - coupon.discount) + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const orderId = `TC-BD-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      id: orderId,
      customer: formData,
      items: cart,
      subtotal,
      discount: coupon.discount,
      shippingCost,
      grandTotal,
      paymentMethod: formData.paymentMethod,
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setOrderPlaced(orderPayload);
      clearCart();
      setIsSubmitting(false);
    }, 600);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Order Confirmed!</h1>
          <p className="text-sm text-slate-600">
            Thank you for shopping at TechCore. Your Order ID is:
          </p>
          <div className="inline-block bg-orange-50 border border-orange-200 text-[#ea580c] font-extrabold text-base px-4 py-2 rounded-lg">
            {orderPlaced.id}
          </div>
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          We have sent a confirmation message to <strong>{orderPlaced.customer.phone}</strong>. Our customer executive will call you to confirm dispatch.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Checkout & Payment</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your shipping address and Bangladesh payment method</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Shipping Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-600" /> Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Tanvir Hasan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="01700000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Address *</label>
              <textarea
                required
                rows={3}
                placeholder="House, Road, Apartment, Area details..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Location / District *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl bg-white"
                >
                  <option value="dhaka">Inside Dhaka</option>
                  <option value="outside">Outside Dhaka (All Districts)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Order Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Special instructions for courier"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Payment Gateway Options */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#ea580c]" /> Bangladesh Payment Methods
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-600 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="sslcommerz"
                  checked={formData.paymentMethod === 'sslcommerz'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">SSLCommerz (bKash, Nagad, Rocket, Cards)</span>
                  <span className="text-[11px] text-slate-500">Pay securely via any BD debit/credit card or mobile wallet</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-600 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-blue-600"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-slate-500">Pay cash to courier upon receiving product</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6 sticky top-20">
            <h2 className="font-extrabold text-base text-slate-900 border-b pb-3">Order Summary</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="line-clamp-1 text-slate-700 w-3/4">
                    {item.name} <strong className="text-slate-900">x{item.quantity}</strong>
                  </span>
                  <span className="font-bold text-slate-900">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
              </div>
              
              {coupon.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-৳{coupon.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Shipping Charge</span>
                {isFreeDelivery ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    FREE Shipping (Over ৳10,000)
                  </span>
                ) : (
                  <span className="font-bold text-slate-900">৳{shippingCost}</span>
                )}
              </div>

              <div className="flex justify-between text-lg font-black text-slate-900 border-t pt-3">
                <span>Grand Total</span>
                <span className="text-[#d92d20]">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all disabled:opacity-50 text-xs uppercase"
            >
              {isSubmitting ? 'Processing Order...' : 'Confirm Order Now'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
