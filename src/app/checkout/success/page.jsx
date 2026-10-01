"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { trackOrderApi } from '@/lib/api';
import { CheckCircle2, ShoppingBag, Home, Clock, AlertCircle, RefreshCw } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useShop();

  const orderId = searchParams.get('orderId') || searchParams.get('tran_id') || searchParams.get('val_id') || '';
  const isPriceChangedParam = searchParams.get('priceChanged') === 'true';

  const [loading, setLoading] = useState(Boolean(orderId));
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(orderId ? null : 'No Order ID found in parameters.');

  const fetchOrderStatus = async () => {
    if (!orderId) {
      setLoading(false);
      setError('No Order ID found in parameters.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await trackOrderApi(orderId);
      if (res && res.id) {
        setOrder(res);
        // Clear cart ONLY when status is Paid OR order is COD
        const isPaid = res.paymentStatus === 'Paid';
        const isCOD = String(res.paymentMethod || '').toUpperCase() === 'COD';
        if (isPaid || isCOD) {
          clearCart();
        }
      } else {
        setError(res?.message || 'Unable to retrieve order details.');
      }
    } catch (err) {
      setError('Server connection error while fetching order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    let isMounted = true;
    trackOrderApi(orderId)
      .then(res => {
        if (!isMounted) return;
        if (res && res.id) {
          setOrder(res);
          // Clear cart ONLY when status is Paid OR order is COD
          const isPaid = res.paymentStatus === 'Paid';
          const isCOD = String(res.paymentMethod || '').toUpperCase() === 'COD';
          if (isPaid || isCOD) {
            clearCart();
          }
        } else {
          setError(res?.message || 'Unable to retrieve order details.');
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setError('Server connection error while fetching order details.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId, clearCart]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-slate-700">Verifying order payment status from server...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle size={36} />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">Order Information Unavailable</h1>
          <p className="text-xs text-slate-600">{error || 'We could not find matching order details.'}</p>
        </div>
        {orderId && (
          <div className="inline-block bg-slate-100 border text-slate-800 font-mono text-xs px-3 py-1 rounded-lg">
            Ref: {orderId}
          </div>
        )}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={fetchOrderStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <RefreshCw size={14} /> Retry Status Check
          </button>
          <Link
            href="/track-order"
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <ShoppingBag size={14} /> Track Order Page
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'Paid';
  const isCOD = String(order.paymentMethod || '').toUpperCase() === 'COD';
  const isPending = !isPaid && !isCOD && (order.paymentStatus === 'Unpaid' || order.paymentStatus === 'Pending' || order.orderStatus === 'PENDING_PAYMENT');

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      {/* Icon Badge */}
      {isPending ? (
        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <Clock size={40} />
        </div>
      ) : (
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={40} />
        </div>
      )}

      {/* Main Title & Status */}
      <div className="space-y-2">
        {isPending ? (
          <h1 className="text-3xl font-black text-slate-900">Payment Processing...</h1>
        ) : (
          <h1 className="text-3xl font-black text-slate-900">Order Confirmed!</h1>
        )}

        <p className="text-xs text-slate-600">
          Order Reference Number:
        </p>

        <div className="inline-block bg-slate-100 border border-slate-300 text-slate-900 font-mono font-black text-base px-4 py-2 rounded-xl">
          {order.invoiceNo || order.id}
        </div>
      </div>

      
      {/* Price / Stock Change Banner */}
      {(isPriceChangedParam || order.priceChanged || order.priceNotice) && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-4 rounded-2xl max-w-md mx-auto text-xs font-semibold text-left space-y-1 shadow-sm">
          <div className="font-extrabold text-amber-800 flex items-center gap-1.5 text-sm">
            <span>⚠️ Notice: Price / Stock Adjustment</span>
          </div>
          <p className="text-amber-800">
            {order.priceNotice || 'Product price or stock availability updated during checkout. Displaying server-calculated grand total.'}
          </p>
          <p className="text-[11px] text-amber-700 pt-1">
            পণ্যের দাম বা স্টকে পরিবর্তন দেখা দিয়েছে। আপনার সার্ভার গণনাকৃত চূড়ান্ত মোট মূল্য: <strong>৳ {(order.grandTotal || 0).toLocaleString()}</strong>
          </p>
        </div>
      )}

      {/* Status Badges Box */}
      <div className="bg-white border rounded-2xl p-4 shadow-sm max-w-md mx-auto grid grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Payment Status</span>
          <span className={`font-extrabold ${isPaid ? 'text-emerald-600' : isCOD ? 'text-blue-600' : 'text-amber-600'}`}>
            {order.paymentStatus || (isCOD ? 'Cash on Delivery' : 'Processing')}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Order Status</span>
          <span className="font-extrabold text-slate-800">
            {order.orderStatus || 'PENDING'}
          </span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 block uppercase">Server Total</span>
          <span className="font-extrabold text-emerald-700">
            ৳ {(order.grandTotal || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Context Description */}
      {isPending ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-4 rounded-xl max-w-md mx-auto space-y-2">
          <p className="font-semibold">Your payment status is currently pending backend verification.</p>
          <p className="text-[11px] text-amber-700">
            If you have completed your payment via SSLCommerz, please click the refresh button below to update your status.
          </p>
          <button
            onClick={fetchOrderStatus}
            className="mt-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all inline-flex items-center gap-1.5"
          >
            <RefreshCw size={12} /> Refresh Order Status
          </button>
        </div>
      ) : (
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          {isCOD
            ? 'Thank you for your order! Your Cash on Delivery order has been logged and our dispatch team will process it shortly.'
            : 'Thank you for your payment! Your transaction was verified by the server and your order is confirmed.'}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-center gap-3 pt-4">
        <Link
          href="/"
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Home size={16} /> Storefront Home
        </Link>
        <Link
          href={`/track-order?query=${encodeURIComponent(order.invoiceNo || order.id)}`}
          className="bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <ShoppingBag size={16} /> Track Order Progress
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-slate-500">Loading order verification...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
