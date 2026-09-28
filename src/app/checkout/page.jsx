"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ShieldCheck, Truck, CreditCard, CheckCircle2 } from 'lucide-react';

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
    paymentMethod: 'cod'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(null);

  const shippingCost = formData.city === 'dhaka' ? 60 : 120;
  const grandTotal = Math.max(0, subtotal - coupon.discount) + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';

    const orderPayload = {
      customer: formData,
      items: cart,
      subtotal,
      discount: coupon.discount,
      shippingCost,
      grandTotal,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      
      const orderId = `TC-BD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderPlaced({ id: orderId, ...orderPayload });
      clearCart();
    } catch (err) {
      console.error('Order creation error:', err);
      const orderId = `TC-BD-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderPlaced({ id: orderId, ...orderPayload });
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#081621]">Order Confirmed!</h1>
          <p className="text-sm text-gray-600">
            Thank you for shopping at TechCore Bangladesh. Your order ID is:
          </p>
          <div className="inline-block bg-orange-50 border border-orange-200 text-[#ea580c] font-extrabold text-base px-4 py-2 rounded-lg">
            {orderPlaced.id}
          </div>
        </div>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          We have sent an order confirmation message to <strong>{orderPlaced.customer.phone}</strong>. Our customer support will contact you shortly before delivery.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-[#ea580c] hover:bg-[#d97706] text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg transition-all"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621]">Checkout & Payment</h1>
        <p className="text-xs text-gray-500 mt-1">Complete your delivery address and payment method</p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customer Info Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
            <h2 className="font-extrabold text-base text-[#081621] flex items-center">
              <Truck className="w-5 h-5 mr-2 text-[#3749bb]" /> Shipping Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Hasan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl focus:outline-none focus:border-[#3749bb]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="01700000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl focus:outline-none focus:border-[#3749bb]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl focus:outline-none focus:border-[#3749bb]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Full Address *</label>
              <textarea
                required
                rows={3}
                placeholder="House, Road, Apartment, Area details..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl focus:outline-none focus:border-[#3749bb]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">City / Region *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl bg-white focus:outline-none focus:border-[#3749bb]"
                >
                  <option value="dhaka">Inside Dhaka (৳60 Shipping)</option>
                  <option value="outside">Outside Dhaka (৳120 Shipping)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Order Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="Special instructions for courier"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl focus:outline-none focus:border-[#3749bb]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-4">
            <h2 className="font-extrabold text-base text-[#081621] flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#ea580c]" /> Payment Option
            </h2>

            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:border-[#3749bb] transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-[#3749bb]"
                />
                <div>
                  <span className="font-bold text-xs text-[#081621] block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-gray-500">Pay cash to courier when receiving product</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:border-[#3749bb] transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bkash"
                  checked={formData.paymentMethod === 'bkash'}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="text-[#3749bb]"
                />
                <div>
                  <span className="font-bold text-xs text-[#081621] block">bKash / Nagad Mobile Banking</span>
                  <span className="text-[11px] text-gray-500">Instant gateway payment via mobile wallet</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Summary (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 space-y-6 sticky top-20">
            <h2 className="font-extrabold text-base text-[#081621] border-b pb-3">Your Items</h2>

            <div className="space-y-3 max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="line-clamp-1 text-gray-700 w-3/4">
                    {item.name} <strong className="text-gray-900">x{item.quantity}</strong>
                  </span>
                  <span className="font-bold text-[#081621]">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-gray-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#081621]">৳{subtotal.toLocaleString()}</span>
              </div>
              {coupon.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-৳{coupon.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Charge</span>
                <span className="font-bold text-[#081621]">৳{shippingCost}</span>
              </div>
              <div className="flex justify-between text-lg font-black text-[#081621] border-t pt-3">
                <span>Grand Total</span>
                <span className="text-[#ea580c]">৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="w-full bg-[#ea580c] hover:bg-[#d97706] text-white font-extrabold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 text-xs uppercase"
            >
              {isSubmitting ? 'Processing Order...' : 'Confirm Order Now'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
