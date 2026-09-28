"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { XCircle, RefreshCw, Home } from 'lucide-react';

function FailContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get('tran_id') || searchParams.get('orderId') || '';

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <XCircle size={40} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Payment Failed or Cancelled</h1>
        <p className="text-sm text-slate-600">
          Your payment transaction could not be completed.
        </p>
        {tranId && (
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 font-mono text-xs px-3 py-1.5 rounded-lg">
            Ref: {tranId}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Don&apos;t worry, no charges were incurred or your transaction was declined by the payment gateway. You can try checkout again or select Cash on Delivery.
      </p>

      <div className="flex justify-center gap-3 pt-4">
        <Link
          href="/checkout"
          className="bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} /> Try Checkout Again
        </Link>
        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Home size={16} /> Return to Storefront
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading payment status...</div>}>
      <FailContent />
    </Suspense>
  );
}
