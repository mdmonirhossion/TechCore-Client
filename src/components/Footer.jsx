"use client";

import React from 'react';
import Link from 'next/link';
import { Cpu, Phone, Mail, MapPin, ShieldCheck, Share2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-6 text-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <Cpu size={20} className="stroke-[2.5]" />
              </div>
              <div className="text-xl font-black tracking-tight">
                <span className="text-slate-900">TECH</span>
                <span className="text-orange-600">CORE</span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              TechCore is Bangladesh's premier technology e-commerce destination for gaming laptops, custom desktop PCs, graphics cards, processors, monitors, and official tech accessories.
            </p>
            <div className="space-y-2 text-xs text-slate-700 font-semibold pt-1">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-orange-600" />
                <span>Hotline: 01700-000000 (9 AM - 8 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-600" />
                <span>Email: support@techcorebd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-600" />
                <span>Multiplan Center, New Elephant Road, Dhaka-1205</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Customer Service
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Warranty Claim</Link></li>
              <li><Link href="/service-center" className="hover:text-orange-600 hover:underline">Service Center</Link></li>
              <li><Link href="/track-order" className="hover:text-orange-600 hover:underline">Track Your Order</Link></li>
              <li><Link href="/my-orders" className="hover:text-orange-600 hover:underline">My Orders</Link></li>
              <li><Link href="/pc-builder" className="hover:text-orange-600 hover:underline">PC Builder Tool</Link></li>
              <li><Link href="/laptop-finder" className="hover:text-orange-600 hover:underline">Laptop Finder</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/category/laptop" className="hover:text-orange-600 hover:underline">Gaming Laptop</Link></li>
              <li><Link href="/category/desktop" className="hover:text-orange-600 hover:underline">Desktop PC</Link></li>
              <li><Link href="/category/gpu" className="hover:text-orange-600 hover:underline">Graphics Card</Link></li>
              <li><Link href="/category/monitor" className="hover:text-orange-600 hover:underline">Gaming Monitor</Link></li>
              <li><Link href="/category/processor" className="hover:text-orange-600 hover:underline">Processor</Link></li>
              <li><Link href="/category/ram" className="hover:text-orange-600 hover:underline">RAM Memory</Link></li>
              <li><Link href="/category/storage" className="hover:text-orange-600 hover:underline">SSD Storage</Link></li>
            </ul>
          </div>

          {/* Information & Policies */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
              About & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">About TechCore</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Warranty Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Delivery Information</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Return & Refund Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Privacy Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 TechCore. All rights reserved. Premium Electronics & Computer Store Bangladesh.
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer">
              <Globe size={14} /> English / বাংলা
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
