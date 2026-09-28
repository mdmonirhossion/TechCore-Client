"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { User, Package, Heart, LogOut, ShieldCheck, MapPin } from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logoutUser, wishlist } = useShop();

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-[#081621]">Please Sign In First</h1>
        <p className="text-xs text-gray-500">You must be logged in to view your account profile.</p>
        <button
          onClick={() => router.push('/login')}
          className="bg-[#3749bb] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const mockOrders = [
    {
      id: 'TC-BD-984120',
      date: '2026-09-27',
      total: 40059,
      status: 'Out for Delivery',
      item: 'ASUS Dual GeForce RTX 4060 OC 8GB GDDR6'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-50 text-[#3749bb] rounded-full flex items-center justify-center font-black text-2xl">
            {user.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#081621]">{user.name || 'Valued Customer'}</h1>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            logoutUser();
            router.push('/login');
          }}
          className="flex items-center space-x-1 text-xs text-red-600 hover:bg-red-50 font-bold px-4 py-2 rounded-xl transition-colors border border-red-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Order History */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-extrabold text-base text-[#081621] flex items-center">
              <Package className="w-5 h-5 mr-2 text-[#3749bb]" /> My Orders
            </h2>

            <div className="space-y-3">
              {mockOrders.map((order) => (
                <div key={order.id} className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                  <div>
                    <span className="font-black text-[#081621] block">{order.id}</span>
                    <span className="text-gray-500">{order.item}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-[#ef4a23] block">৳{order.total.toLocaleString()}</span>
                    <span className="text-emerald-600 font-bold bg-green-50 px-2 py-0.5 rounded text-[10px]">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-extrabold text-base text-[#081621]">Account Overview</h2>
            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center"><Heart className="w-4 h-4 mr-2 text-rose-500" /> Saved Wishlist</span>
                <strong className="text-[#081621]">{wishlist.length} Items</strong>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="flex items-center"><ShieldCheck className="w-4 h-4 mr-2 text-emerald-500" /> Active Warranty</span>
                <strong className="text-[#081621]">1 Product</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
