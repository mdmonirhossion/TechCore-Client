"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { CheckCircle2, ShoppingBag, Home } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useShop();

  const tranId = searchParams.get('tran_id') || searchParams.get('orderId') || searchParams.get('val_id') || 'TC-BD-SUCCESS';

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle2 size={40} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Payment Successful!</h1>
        <p className="text-sm text-slate-600">
          Thank you for your order. Your transaction / order ID is:
        </p>
        <div className="inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-black text-base px-4 py-2 rounded-xl">
          {tranId}
        </div>
      </div>

      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        Your payment has been validated by SSLCommerz and confirmed by TechCore. Our dispatch team is processing your shipment.
      </p>

      <div className="flex justify-center gap-3 pt-4">
        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Home size={16} /> Return to Home
        </Link>
        <Link
          href="/track-order"
          className="bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ShoppingBag size={16} /> Track Order
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Processing payment confirmation...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
