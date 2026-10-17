import React from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import FlashSaleSection from '@/components/FlashSaleSection';
import FeaturedCategoriesSection from '@/components/FeaturedCategoriesSection';
import FeaturedProductsTab from '@/components/FeaturedProductsTab';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import {
  Wrench,
  ShieldCheck,
  Truck,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Gamepad2,
  Award,
  Headphones,
  HelpCircle
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await getProducts();
  const popularProducts = products.slice(5, 15);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'TechCore Bangladesh',
    url: 'https://techcorebd.com',
    logo: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
    description: 'Leading Tech & Computer Shop in Bangladesh offering Laptops, Desktops, Components, Monitors and PC Building Services.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Multiplan Center, New Elephant Road',
      addressLocality: 'Dhaka',
      postalCode: '1205',
      addressCountry: 'BD'
    }
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-16">
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* HERO AREA (Carousel + Stacked Promo Cards) */}
      <HeroCarousel />

      {/* FLASH SALE SECTION */}
      <FlashSaleSection products={products} />

      {/* FEATURED CATEGORIES SECTION */}
      <FeaturedCategoriesSection />

      {/* FEATURED PRODUCTS WITH TAB SWITCHING */}
      <FeaturedProductsTab products={products} />

      {/* POPULAR PRODUCTS SECTION */}
      <section>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-600" />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Popular Products</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">Top Selling Electronics & Components in Bangladesh</p>
          </div>
          <Link
            href="/products"
            className="mt-3 sm:mt-0 text-xs font-bold text-[#2563eb] hover:text-[#ea580c] flex items-center gap-1 transition-colors"
          >
            <span>Explore Store</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularProducts.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* GAMING ZONE / PROMOTIONAL BANNER */}
      <section className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl border border-purple-800/30">
        <div className="max-w-xl relative z-10 space-y-4">
          <span className="bg-purple-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full tracking-wider inline-flex items-center gap-1">
            <Gamepad2 size={14} /> TechCore Gaming Zone
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Build Your Ultimate RTX 4090 Liquid-Cooled BattleStation
          </h2>
          <p className="text-xs md:text-sm text-purple-200 leading-relaxed font-sans">
            Get expert guidance from TechCore PC building specialists. Official warranties, 0% EMI financing, and custom cable management.
          </p>
          <div className="pt-2">
            <Link
              href="/pc-builder"
              className="bg-[#ea580c] hover:bg-orange-700 text-white text-xs md:text-sm font-bold px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
            >
              <span>Launch PC Builder</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PC BUILDER CTA SECTION */}
      <section className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center gap-2 text-[#2563eb] font-bold text-xs uppercase tracking-wider">
            <Wrench size={16} /> Custom Rig Configurator
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Build Your Custom PC with Real-Time Compatibility Check
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Select your CPU, Motherboard, GPU, RAM, Storage, and Power Supply step-by-step. Get wattage estimates and instant invoice printing!
          </p>
        </div>
        <div className="flex md:justify-end">
          <Link
            href="/pc-builder"
            className="w-full md:w-auto bg-[#2563eb] hover:bg-blue-700 text-white text-sm font-extrabold px-6 py-3.5 rounded-xl text-center shadow-lg transition-all hover:scale-105"
          >
            Start Building Now →
          </Link>
        </div>
      </section>

      {/* WHY CHOOSE TECHCORE (Trust Badges) */}
      <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center flex-shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Fast Nationwide Delivery</h4>
            <p className="text-xs text-slate-500">Express delivery across all 64 districts in BD</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#ea580c] flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">100% Authentic Products</h4>
            <p className="text-xs text-slate-500">Official manufacturer warranty guaranteed</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">0% EMI Facilities</h4>
            <p className="text-xs text-slate-500">Up to 36 months EMI on 30+ leading banks</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Headphones size={24} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">Expert Technical Support</h4>
            <p className="text-xs text-slate-500">Dedicated hardware team ready to assist</p>
          </div>
        </div>
      </section>

      {/* SEO RICH CONTENT & FAQ SECTION */}
      <section className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-xl font-black text-slate-900 mb-2">
            Leading Computer, Laptop & Component Shop in Bangladesh - TechCore
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            TechCore is Bangladesh’s premier retail and online computer store, offering custom PC building, gaming laptops, high-performance graphics cards, Intel and AMD processors, monitors, and official tech accessories. Whether you are building a budget workstation or an extreme liquid-cooled gaming rig, TechCore provides 100% genuine components with official manufacturer warranty, fast nationwide shipping, and flexible 0% EMI financing across 30+ partner banks.
          </p>
        </div>

        <div>
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-[#2563eb]" /> Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-3">
            <details className="group border rounded-xl p-4 bg-slate-50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-bold text-xs text-slate-900 cursor-pointer">
                <span>How can I place an order online at TechCore?</span>
                <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Browse your desired laptop or component, click &quot;Buy Now&quot; to proceed straight to checkout or &quot;Add Cart&quot; to add multiple items, fill in your shipping details, choose Cash on Delivery or SSLCommerz payment, and confirm your order.
              </p>
            </details>

            <details className="group border rounded-xl p-4 bg-slate-50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-bold text-xs text-slate-900 cursor-pointer">
                <span>Does TechCore provide official brand warranty in Bangladesh?</span>
                <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes! All products sold at TechCore are 100% authentic and carry official manufacturer warranty served directly through our authorized service centers across Bangladesh.
              </p>
            </details>

            <details className="group border rounded-xl p-4 bg-slate-50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-bold text-xs text-slate-900 cursor-pointer">
                <span>How does the PC Builder tool work?</span>
                <span className="ml-2 text-slate-400 group-open:rotate-180 transition-transform">&darr;</span>
              </summary>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Our custom PC Builder lets you select compatible CPU, Motherboard, RAM, GPU, Storage, and PSU step-by-step with real-time total price calculation, wattage estimates, and one-click add to cart or print quotation features.
              </p>
            </details>
          </div>
        </div>
      </section>

    </div>
  );
}
