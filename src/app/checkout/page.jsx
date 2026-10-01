"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { createOrderApi, API_BASE_URL } from '@/lib/api';
import { Truck, CreditCard, AlertCircle } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, coupon, clearCart, token } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    paymentMethod: 'COD'
  });

  const [divisions, setDivisions] = useState(['Dhaka']);
  const [districts, setDistricts] = useState(['Dhaka']);
  const [upazilas, setUpazilas] = useState(['Dhaka Sadar']);

  const [deliveryFee, setDeliveryFee] = useState(60);
  const [isFreeDelivery, setIsFreeDelivery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // 1. Fetch Divisions
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/geography/divisions`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDivisions(data);
        }
      })
      .catch(() => {});
  }, []);

  // 2. Fetch Districts for selected Division
  useEffect(() => {
    if (!formData.division) return;
    fetch(`${API_BASE_URL}/api/geography/districts?division=${encodeURIComponent(formData.division)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDistricts(data);
          if (!data.includes(formData.district)) {
            setFormData(prev => ({ ...prev, district: data[0] }));
          }
        }
      })
      .catch(() => {});
  }, [formData.division]);

  // 3. Fetch Upazilas for selected District
  useEffect(() => {
    if (!formData.district) return;
    fetch(`${API_BASE_URL}/api/geography/upazilas?district=${encodeURIComponent(formData.district)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setUpazilas(data);
          if (!data.includes(formData.upazila)) {
            setFormData(prev => ({ ...prev, upazila: data[0] }));
          }
        }
      })
      .catch(() => {});
  }, [formData.district]);

  // 4. Calculate Delivery Fee from API
  useEffect(() => {
    if (!formData.district) return;
    fetch(`${API_BASE_URL}/api/delivery/calculate?district=${encodeURIComponent(formData.district)}&subtotal=${subtotal}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.deliveryFee === 'number') {
          setDeliveryFee(data.deliveryFee);
          setIsFreeDelivery(Boolean(data.isFree));
        }
      })
      .catch(() => {
        const isInside = formData.district.toLowerCase() === 'dhaka';
        setDeliveryFee(subtotal >= 10000 ? 0 : (isInside ? 60 : 120));
      });
  }, [formData.district, subtotal]);

  // Phone Validation Handler
  const handlePhoneChange = (e) => {
    const val = e.target.value.trim();
    setFormData(prev => ({ ...prev, phone: val }));
    if (val && !/^01[3-9]\d{8}$/.test(val)) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number starting with 01');
    } else {
      setPhoneError('');
    }
  };

  const grandTotal = Math.max(0, subtotal - (coupon?.discount || 0)) + deliveryFee;

  // Form Submit Handler
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMsg('Your shopping cart is empty.');
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(formData.phone)) {
      setPhoneError('Please enter a valid 11-digit Bangladeshi mobile number starting with 01');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Payload: Send ONLY required fields (no prices, totals, or client-generated orderId)
    const orderPayload = {
      items: cart.map(item => ({
        productId: item.productId || item.id,
        quantity: item.quantity
      })),
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email ? formData.email.trim() : undefined,
        address: formData.address,
        division: formData.division,
        district: formData.district,
        upazila: formData.upazila
      },
      paymentMethod: formData.paymentMethod.toUpperCase(),
      couponCode: coupon?.code || undefined,
      clientTotal: grandTotal
    };

    try {
      const estimatedClientTotal = grandTotal;
      const res = await createOrderApi(orderPayload, token);

      // 1. Online Payment Gateway Redirect
      if (res && res.gatewayUrl) {
        // Do NOT clear cart before payment succeeds
        window.location.href = res.gatewayUrl;
        return;
      }

      // 2. Cash on Delivery (COD) Success
      if (res && res.success && res.order) {
        clearCart(); // Clear cart only after COD success response
        const serverTotal = res.order.grandTotal !== undefined ? res.order.grandTotal : res.grandTotal;
        const priceChanged = res.priceChanged || (serverTotal !== undefined && Math.abs(serverTotal - estimatedClientTotal) > 1);
        
        let targetUrl = `/checkout/success?orderId=${encodeURIComponent(res.order.id || res.order.invoiceNo)}`;
        if (serverTotal !== undefined) {
          targetUrl += `&serverGrandTotal=${serverTotal}`;
        }
        if (priceChanged) {
          targetUrl += `&priceChanged=true`;
        }
        router.push(targetUrl);
        return;
      }

      // 3. Server Error Response (NO mock fallback)
      setIsSubmitting(false);
      setErrorMsg(res?.message || res?.error || 'Order creation failed. Stock or price may have changed. Please review your cart.');
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Server connection error. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-black text-slate-900">Checkout & Payment</h1>
        <p className="text-xs text-slate-500 mt-1">Complete your shipping address and Bangladeshi payment method</p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-4 rounded-xl flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="01700000000"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full text-xs p-3 border rounded-xl focus:ring-2 outline-none ${phoneError ? 'border-rose-500 focus:ring-rose-200' : 'focus:ring-blue-500'}`}
                />
                {phoneError && <p className="text-[11px] text-rose-600 mt-1">{phoneError}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="customer@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Address *</label>
              <textarea
                required
                rows={3}
                placeholder="House, Road, Apartment, Area details..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Geography Selects */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Division *</label>
                <select
                  value={formData.division}
                  onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {divisions.map(div => (
                    <option key={div} value={div}>{div}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">District *</label>
                <select
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {districts.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Upazila *</label>
                <select
                  value={formData.upazila}
                  onChange={(e) => setFormData({ ...formData, upazila: e.target.value })}
                  className="w-full text-xs p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {upazilas.map(up => (
                    <option key={up} value={up}>{up}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method Options */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#ea580c]" /> Bangladesh Payment Methods
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer hover:border-blue-600 transition-all">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="SSLCOMMERZ"
                  checked={formData.paymentMethod === 'SSLCOMMERZ'}
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
                  value="COD"
                  checked={formData.paymentMethod === 'COD'}
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
                <div key={item.id || item.productId} className="flex justify-between items-center text-xs">
                  <span className="line-clamp-1 text-slate-700 w-3/4">
                    {item.name} <strong className="text-slate-900">x{item.quantity}</strong>
                  </span>
                  <span className="font-bold text-slate-900">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs text-slate-600 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">৳ {subtotal.toLocaleString()}</span>
              </div>
              
              {coupon?.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({coupon.code})</span>
                  <span>-৳ {coupon.discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Delivery Charge</span>
                {isFreeDelivery ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                    FREE Delivery
                  </span>
                ) : (
                  <span className="font-bold text-slate-900">৳ {deliveryFee}</span>
                )}
              </div>

              <div className="flex justify-between text-lg font-black text-slate-900 border-t pt-3">
                <span>Grand Total <span className="text-[10px] text-slate-500 font-normal">(Display Only)</span></span>
                <span className="text-[#d92d20]">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0 || Boolean(phoneError)}
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
