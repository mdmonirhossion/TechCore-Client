"use client";

import React, { useState } from 'react';
import { Truck, Search, CheckCircle2, Clock, PackageCheck, MapPin } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [phone, setPhone] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim() && !phone.trim()) return;

    setSearched(true);
    const mockStatus = {
      id: orderId.toUpperCase() || 'TC-BD-984120',
      date: '2026-09-27',
      customerName: 'Tanvir Hasan',
      deliveryAddress: 'House 14, Road 5, Dhanmondi, Dhaka',
      courierPartner: 'Steadfast Courier (Tracking #SF-88912)',
      currentStep: 3, // 1: Placed, 2: Confirmed, 3: In Transit, 4: Delivered
      items: [
        { name: 'ASUS Dual GeForce RTX 4060 OC 8GB', qty: 1, price: 39999 }
      ],
      total: 40059
    };
    setOrderStatus(mockStatus);
  };

  const steps = [
    { title: 'Order Placed', desc: 'Order received into system' },
    { title: 'Confirmed', desc: 'Verified by customer support' },
    { title: 'Out for Delivery', desc: 'Handed over to courier partner' },
    { title: 'Delivered', desc: 'Received and signed by customer' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="bg-[#081621] text-white p-8 rounded-2xl text-center space-y-3 shadow-xl">
        <div className="w-16 h-16 bg-[#ef4a23] text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Truck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black">Track Your Order</h1>
        <p className="text-xs text-gray-300 max-w-lg mx-auto">
          Monitor real-time delivery status, courier tracking details, and estimated time of arrival for your TechCore order.
        </p>

        <form onSubmit={handleTrack} className="max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-2 gap-2 pt-4">
          <input
            type="text"
            placeholder="Order ID (e.g. TC-BD-984120)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl border-0 text-[#081621] font-semibold"
          />
          <input
            type="tel"
            placeholder="Or Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl border-0 text-[#081621] font-semibold"
          />
          <button
            type="submit"
            className="sm:col-span-2 bg-[#ef4a23] hover:bg-[#d63a15] text-white text-xs font-bold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center"
          >
            <Search className="w-4 h-4 mr-1" /> Track Order Status
          </button>
        </form>
      </div>

      {searched && orderStatus && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-2">
            <div>
              <span className="text-xs text-gray-500 font-semibold">Order ID</span>
              <h2 className="text-lg font-black text-[#081621]">{orderStatus.id}</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 block">Courier Partner</span>
              <span className="text-xs font-bold text-[#3749bb]">{orderStatus.courierPartner}</span>
            </div>
          </div>

          {/* Stepper Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4 border-b">
            {steps.map((step, idx) => {
              const stepNumber = idx + 1;
              const isPassed = stepNumber <= orderStatus.currentStep;
              const isCurrent = stepNumber === orderStatus.currentStep;

              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                      isPassed
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
                  </div>
                  <div>
                    <h3 className={`font-extrabold text-xs ${isCurrent ? 'text-[#ef4a23]' : 'text-[#081621]'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Delivery Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-500 font-semibold block">Customer Name</span>
              <strong className="text-gray-900">{orderStatus.customerName}</strong>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-500 font-semibold block">Delivery Address</span>
              <strong className="text-gray-900">{orderStatus.deliveryAddress}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
