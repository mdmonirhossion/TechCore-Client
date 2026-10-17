"use client";

import React from 'react';
import Link from 'next/link';
import { Cpu, Phone, Mail, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-6 text-slate-800 dark:text-slate-200 font-sans transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <Cpu size={20} className="stroke-[2.5]" />
              </div>
              <div className="text-xl font-black tracking-tight">
                <span className="text-slate-900 dark:text-white">TECH</span>
                <span className="text-orange-600">CORE</span>
              </div>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              {t('tagline')}
            </p>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300 font-semibold pt-1">
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-orange-600" />
                <span>{t('hotline')}: 01700-000000 (9 AM - 8 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-600" />
                <span>{t('email')}: support@techcorebd.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-600" />
                <span>{t('address')}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              {t('customerService')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">{t('warrantyClaim')}</Link></li>
              <li><Link href="/service-center" className="hover:text-orange-600 hover:underline">{t('serviceCenter')}</Link></li>
              <li><Link href="/track-order" className="hover:text-orange-600 hover:underline">{t('trackOrder')}</Link></li>
              <li><Link href="/my-orders" className="hover:text-orange-600 hover:underline">{t('myOrders')}</Link></li>
              <li><Link href="/pc-builder" className="hover:text-orange-600 hover:underline">{t('pcBuilderTool')}</Link></li>
              <li><Link href="/laptop-finder" className="hover:text-orange-600 hover:underline">{t('laptopFinder')}</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              {t('popularCategories')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/category/laptop" className="hover:text-orange-600 hover:underline">Gaming Laptop</Link></li>
              <li><Link href="/category/desktop-pc" className="hover:text-orange-600 hover:underline">Desktop PC</Link></li>
              <li><Link href="/category/component/graphics-card" className="hover:text-orange-600 hover:underline">Graphics Card</Link></li>
              <li><Link href="/category/monitor" className="hover:text-orange-600 hover:underline">Gaming Monitor</Link></li>
              <li><Link href="/category/component/processor" className="hover:text-orange-600 hover:underline">Processor</Link></li>
              <li><Link href="/category/component/ram" className="hover:text-orange-600 hover:underline">RAM Memory</Link></li>
              <li><Link href="/category/component/storage" className="hover:text-orange-600 hover:underline">SSD Storage</Link></li>
            </ul>
          </div>

          {/* Information & Policies */}
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              {t('aboutPolicies')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">About TechCore</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Warranty Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Delivery Information</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Return & Refund Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Privacy Policy</Link></li>
              <li><Link href="/warranty" className="hover:text-orange-600 hover:underline">Terms & Conditions</Link></li>
            </ul>
          </div>

        </div>

        {/* SSLCommerz Payment Partners Banner */}
        <div className="py-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>{t('verifiedSecure')}</span>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.sslcommerz.com/"
            title="SSLCommerz"
            className="inline-block hover:opacity-90 transition-opacity"
          >
            <img
              style={{ width: '300px', height: 'auto' }}
              src="https://securepay.sslcommerz.com/public/image/SSLCommerz-Pay-With-logo-All-Size-01.png"
              alt="SSLCommerz"
            />
          </a>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            {t('copyright')}
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="footer" />
          </div>
        </div>

      </div>
    </footer>
  );
}
