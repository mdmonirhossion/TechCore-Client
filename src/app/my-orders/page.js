"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Truck, Calendar, ChevronRight, Eye } from 'lucide-react';

const MOCK_MY_ORDERS = [
  {
    id: 'TC-10025',
    date: '2026-09-27',
    products: 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6',
    total: 39999,
    status: 'Processing',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    id: 'TC-10018',
    date: '2026-09-15',
    products: 'Intel Core i7-14700K Processor + Corsair 32GB RAM',
    total: 62499,
    status: 'Delivered',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'TC-09945',
    date: '2026-08-30',
    products: 'Samsung 990 PRO 1TB NVMe SSD',
    total: 13999,
    status: 'Shipped',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200'
  }
];

export default function MyOrdersPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Orders</h1>
          <p className="text-xs text-slate-500">Track and manage your recent TechCore purchases</p>
        </div>
        <Link
          href="/track-order"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm"
        >
          <Truck size={14} />
          <span>Track Any Order</span>
        </Link>
      </div>

      <div className="space-y-4">
        {MOCK_MY_ORDERS.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-sm text-slate-900">Order #{order.id}</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${order.statusColor}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">{order.products}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar size={12} /> {order.date}
                </span>
                <span>Total: <strong className="text-slate-900">৳{order.total.toLocaleString()}</strong></span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0">
              <Link
                href={`/track-order?id=${order.id}`}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Eye size={14} /> View Status
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
