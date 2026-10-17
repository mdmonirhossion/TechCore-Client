"use client";

import React, { useState } from 'react';
import { Wrench, CheckCircle2, MapPin, Phone, Clock, Send, ShieldCheck } from 'lucide-react';

export default function ServiceCenterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    deviceType: 'Laptop',
    brandModel: '',
    serialNumber: '',
    issueDescription: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-[#0e1726] text-white p-8 rounded-2xl text-center space-y-3 shadow-xl">
        <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-2">
          <Wrench size={32} />
        </div>
        <h1 className="text-3xl font-black">TechCore Authorized Service Center</h1>
        <p className="text-xs text-slate-300 max-w-lg mx-auto">
          Official repair & component diagnostic service for laptops, custom desktop PCs, graphics cards, and motherboards.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Service Request Received!</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your service ticket number is <strong className="text-orange-600">#SRV-2026-8812</strong>. Our hardware technician will call you within 2 hours to confirm device drop-off.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-[#ea580c] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 border-b pb-3">Submit Device Repair Request</h2>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Tanvir Hasan"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="01700000000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Device Type *</label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    className="w-full p-3 border rounded-xl bg-white"
                  >
                    <option value="Laptop">Gaming Laptop</option>
                    <option value="Desktop">Desktop PC / Custom Rig</option>
                    <option value="GPU">Graphics Card (GPU)</option>
                    <option value="Motherboard">Motherboard</option>
                    <option value="Monitor">Gaming Monitor</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Serial Number (S/N)</label>
                  <input
                    type="text"
                    placeholder="SN-ASUS-9842"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full p-3 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Issue Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the issue (e.g. No display output, overheating, liquid cooler pump noise...)"
                  value={formData.issueDescription}
                  onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
                  className="w-full p-3 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#ea580c] hover:bg-orange-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase"
              >
                Submit Ticket
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white border-b border-slate-800 pb-2">Main Service Hub</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <span>Level 4, Shop #408, Multiplan Center, New Elephant Road, Dhaka</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-400 shrink-0" />
                  <span>01700-000000 (Ext. Service)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-emerald-400 shrink-0" />
                  <span>Sat - Thu (10 AM - 7 PM)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
