"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Calculator, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

const PARTNER_BANKS = [
  'City Bank (AMEX & Visa)', 'Eastern Bank Limited (EBL)', 'BRAC Bank', 'Dutch-Bangla Bank (DBBL)',
  'Standard Chartered Bank (SCB)', 'Mutual Trust Bank (MTB)', 'Prime Bank', 'United Commercial Bank (UCB)',
  'NCC Bank', 'Standard Bank', 'South East Bank', 'Jamuna Bank', 'Mercantile Bank', 'NRB Bank',
  'LankaBangla Finance', 'IPDC Finance', 'IDLC Finance', 'CVC Finance'
];

export default function EMIPage() {
  const [productPrice, setProductPrice] = useState(120000);
  const [emiMonths, setEmiMonths] = useState(12);

  const monthlyInstallment = Math.round(productPrice / emiMonths);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">0% EMI Facilities</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-[#0e1726] text-white p-8 md:p-12 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-emerald-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
            <ShieldCheck size={14} /> 0% Interest EMI
          </span>
          <h1 className="text-3xl font-black text-white">
            0% EMI Financing Facilities up to 36 Months
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-xl">
            Purchase your dream laptop, graphics card, desktop PC, or monitor with zero interest monthly installment plans across 30+ leading Bangladeshi banks.
          </p>
        </div>
      </div>

      {/* Interactive EMI Calculator Tool */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-orange-600 uppercase tracking-wider">
            <Calculator size={18} /> EMI Monthly Calculator
          </div>
          <h2 className="text-xl font-black text-slate-900">Calculate Your Monthly Installment</h2>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Product Price (BDT) *</label>
            <input
              type="number"
              min="10000"
              max="500000"
              step="5000"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full text-sm font-bold p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Select Tenure (Months)</label>
            <div className="grid grid-cols-6 gap-1.5 text-xs font-bold">
              {[3, 6, 9, 12, 18, 24].map(m => (
                <button
                  key={m}
                  onClick={() => setEmiMonths(m)}
                  className={`py-2 rounded-lg border transition-all ${
                    emiMonths === m
                      ? 'bg-slate-900 text-white border-slate-900 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m}M
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Output Box */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 text-center space-y-3">
          <span className="text-xs font-bold uppercase text-orange-700 tracking-wider">Estimated Monthly Payment</span>
          <div className="text-4xl font-black text-[#d92d20]">
            ৳{monthlyInstallment.toLocaleString()} <span className="text-xs font-semibold text-slate-500">/ month</span>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            For <strong>{emiMonths} Months</strong> EMI on product price of ৳{productPrice.toLocaleString()}
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#ea580c] hover:bg-orange-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md transition-all mt-2"
          >
            Browse EMI Eligible Products
          </Link>
        </div>
      </div>

      {/* Partner Banks Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 border-b pb-3">Supported Partner Banks & Financial Institutions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-semibold text-slate-700">
          {PARTNER_BANKS.map((bank, idx) => (
            <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{bank}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
