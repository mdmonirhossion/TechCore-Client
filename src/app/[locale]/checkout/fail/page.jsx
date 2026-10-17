"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { trackOrderApi } from '@/lib/api';
import { XCircle, RefreshCw, Home, ShoppingCart } from 'lucide-react';

function FailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || searchParams.get('tran_id') || searchParams.get('val_id') || '';
  const reason = searchParams.get('reason') || '';

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    trackOrderApi(orderId)
      .then((res) => {
        if (res && res.id) {
          setOrder(res);
        }
      })
      .catch(() => {});
  }, [orderId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <XCircle size={40} />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900">Payment Failed or Cancelled</h1>
        <p className="text-sm text-slate-600">
          Your payment transaction could not be completed at this time.
        </p>

        {orderId && (
          <div className="inline-block bg-red-50 border border-red-200 text-red-700 font-mono text-xs px-3 py-1.5 rounded-lg">
            Ref: {orderId}
          </div>
        )}
      </div>

      {order && (
        <div className="bg-white border rounded-2xl p-4 shadow-sm max-w-md mx-auto grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Payment Status</span>
            <span className="font-extrabold text-red-600">
              {order.paymentStatus || 'Failed'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">Order Status</span>
            <span className="font-extrabold text-slate-800">
              {order.orderStatus || 'CANCELLED'}
            </span>
          </div>
        </div>
      )}

      {reason && (
        <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl max-w-md mx-auto">
          Reason: {reason.replace(/_/g, ' ')}
        </p>
      )}

      <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
        No money was charged to your account or your transaction was cancelled by the payment gateway. Reserved inventory items have been restored. You can return to checkout or select Cash on Delivery.
      </p>

      <div className="flex justify-center gap-3 pt-4">
        <Link
          href="/checkout"
          className="bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <RefreshCw size={16} /> Return to Checkout
        </Link>
        <Link
          href="/cart"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ShoppingCart size={16} /> View Shopping Cart
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading status...</div>}>
      <FailContent />
    </Suspense>
  );
}
