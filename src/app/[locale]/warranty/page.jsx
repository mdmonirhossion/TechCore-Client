"use client";

import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

export default function WarrantyPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setSearched(true);
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/warranty/check?serial=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (res.ok && data && (data.serialNumber || data.success)) {
        setResult({
          serialNumber: data.serialNumber || query.toUpperCase(),
          invoiceId: data.invoiceId || 'INV-BD-2026-9842',
          productName: data.productName || 'Verified Hardware Component',
          purchaseDate: data.purchaseDate || '2025-10-15',
          warrantyPeriod: data.warrantyYears || '3 Years (36 Months)',
          expiryDate: data.expiryDate || '2028-10-15',
          status: data.status || 'Active',
          serviceCenter: data.serviceCenter || 'Multiplan Center Branch (Level 4, Shop #408)'
        });
      } else {
        setErrorMsg(data?.message || 'Serial number not found in official warranty database (404) / ?? ??????? ??????? ???? ???? ????????? ???? ????? ??????');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to warranty database server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-[#081621] text-white p-8 rounded-2xl text-center space-y-3 shadow-xl">
        <div className="w-16 h-16 bg-[#ef4a23] text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-black">Official Warranty Checker</h1>
        <p className="text-xs text-gray-300 max-w-lg mx-auto">
          Check your product&apos;s official manufacturer warranty status, validity period, and claim service history by entering your product Serial Number (S/N) or Invoice ID.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-lg mx-auto flex space-x-2 pt-4">
          <input
            type="text"
            placeholder="Enter Serial No (e.g. SN-ASUS-9842) or Invoice ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs p-3.5 rounded-xl border-0 text-[#081621] focus:outline-none font-semibold"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#ef4a23] hover:bg-[#d63a15] text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center whitespace-nowrap disabled:opacity-50"
          >
            <Search className="w-4 h-4 mr-1" /> {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold max-w-lg mx-auto flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Results Display */}
      {searched && result && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase bg-blue-50 text-[#3749bb] px-2.5 py-1 rounded-md">
                Verified Product
              </span>
              <h2 className="text-base font-extrabold text-[#081621] mt-2">{result.productName}</h2>
            </div>
            <span className="flex items-center text-xs font-extrabold bg-green-50 text-emerald-700 px-3 py-1.5 rounded-full border border-green-200">
              <CheckCircle2 className="w-4 h-4 mr-1" /> {result.status} Warranty
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-500 font-semibold block">Serial Number</span>
              <strong className="text-gray-900 font-mono text-sm">{result.serialNumber}</strong>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-500 font-semibold block">Invoice Number</span>
              <strong className="text-gray-900 font-mono text-sm">{result.invoiceId}</strong>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-500 font-semibold block">Purchase Date</span>
              <strong className="text-gray-900">{result.purchaseDate}</strong>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-1">
              <span className="text-gray-500 font-semibold block">Warranty Expiration</span>
              <strong className="text-emerald-600">{result.expiryDate} ({result.warrantyPeriod})</strong>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-[#ef4a23]" />
              <span>Assigned Service Center: <strong>{result.serviceCenter}</strong></span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Claim Turnaround Time: 3 to 7 working days</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

