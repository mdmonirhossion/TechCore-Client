"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronLeft, ChevronRight, Scale } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/mock-products';

// Swiper React Components & Modules
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const bannerSlides = [
  {
    id: 'b1',
    tag: 'SPECIAL MEGA OFFER',
    title: 'KOORUI & SAMSUNG Gaming Monitors',
    subtitle: '165Hz to 240Hz Curved IPS Display with Official Brand Warranty & 0% EMI!',
    linkText: 'Shop Monitors',
    link: '/category/monitor',
    bgGradient: 'linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #4c1d95 100%)',
    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop'
  },
  {
    id: 'b2',
    tag: 'RTX 40 SERIES GAMING',
    title: 'ASUS & MSI GeForce RTX 4060 / 4070 OC',
    subtitle: 'Ultimate Ray Tracing & DLSS 3 FPS Boost with 0% EMI Facility!',
    linkText: 'Shop Graphics Cards',
    link: '/category/gpu',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #0f172a 100%)',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop'
  },
  {
    id: 'b3',
    tag: 'INTEL 14TH GEN DESKTOP',
    title: 'Core i7-14700K & i9-14900K Processors',
    subtitle: 'Build your custom workstation with TechCore official brand warranty!',
    linkText: 'Build Custom PC',
    link: '/pc-builder',
    bgGradient: 'linear-gradient(135deg, #581c87 0%, #3b0764 50%, #0f172a 100%)',
    img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop'
  }
];

export default function HeroCarousel() {
  const router = useRouter();
  const [prod1, setProd1] = useState('');
  const [prod2, setProd2] = useState('');
  const swiperRef = useRef(null);

  const handleCompareSubmit = (e) => {
    e.preventDefault();
    if (prod1 || prod2) {
      router.push(`/compare?p1=${encodeURIComponent(prod1)}&p2=${encodeURIComponent(prod2)}`);
    } else {
      router.push('/compare');
    }
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto my-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      
      {/* LEFT MAIN BANNER CAROUSEL powered by Swiper JS */}
      <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-xl text-white group border border-slate-800/40">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          loop={true}
          speed={700}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: '.hero-swiper-pagination',
            bulletActiveClass: '!w-8 !bg-[#e11d48]',
            bulletClass: 'inline-block h-2.5 w-2.5 rounded-full bg-white/50 cursor-pointer transition-all duration-300 mx-1',
          }}
          onBeforeInit={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-full h-full min-h-[380px] md:min-h-[420px]"
        >
          {bannerSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="h-full">
              <div
                className="w-full h-full min-h-[380px] md:min-h-[420px] flex items-center p-6 md:p-10 relative"
                style={{ background: slide.bgGradient }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full z-10">
                  {/* Left Text */}
                  <div className="space-y-4">
                    <span className="inline-block bg-[#ea580c] text-white text-[11px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
                      {slide.tag}
                    </span>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
                      {slide.subtitle}
                    </p>
                    <div>
                      <Link
                        href={slide.link}
                        className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs md:text-sm px-6 py-3 rounded-full shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105"
                      >
                        <span>{slide.linkText}</span>
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                  {/* Right Image */}
                  <div className="relative w-full h-48 md:h-72 flex items-center justify-center">
                    <Image
                      src={slide.img}
                      alt={slide.title}
                      fill
                      priority
                      className="object-contain drop-shadow-2xl transition-all duration-700 hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-20"
          aria-label="Next Slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Custom Pagination Bullets Container */}
        <div className="hero-swiper-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20" />
      </div>

      {/* RIGHT SIDEBAR: MONARCH IT COMPARE WIDGET & PROMO BANNER */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        
        {/* MONARCH IT COMPARE PRODUCTS WIDGET (Yellow Box) */}
        <div className="bg-[#fef9c3] border border-amber-300 rounded-2xl p-5 shadow-sm text-slate-900 flex flex-col justify-between">
          <div>
            <div className="text-center mb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
                <Scale size={18} className="text-blue-700" />
                <span>Compare Products</span>
              </h3>
              <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                Choose Two Products to Compare
              </p>
            </div>

            <form onSubmit={handleCompareSubmit} className="space-y-2.5">
              <div className="relative">
                <select
                  value={prod1}
                  onChange={(e) => setProd1(e.target.value)}
                  className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 cursor-pointer appearance-none shadow-sm"
                >
                  <option value="">Search and Select Product 1</option>
                  {MOCK_PRODUCTS.slice(0, 8).map(p => (
                    <option key={p.id} value={p.slug || p.id}>
                      {p.name} (৳{p.discountPrice || p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <select
                  value={prod2}
                  onChange={(e) => setProd2(e.target.value)}
                  className="w-full bg-white text-slate-800 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-600 cursor-pointer appearance-none shadow-sm"
                >
                  <option value="">Search and Select Product 2</option>
                  {MOCK_PRODUCTS.slice(4, 12).map(p => (
                    <option key={p.id} value={p.slug || p.id}>
                      {p.name} (৳{p.discountPrice || p.price})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-transparent hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold py-2 rounded-lg border-2 border-blue-600 transition-colors shadow-sm"
              >
                View Comparison
              </button>
            </form>
          </div>
        </div>

        {/* PROMO IMAGE BANNER CARD */}
        <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 text-white rounded-2xl overflow-hidden shadow-sm relative min-h-[170px] p-5 flex flex-col justify-between border border-purple-700/30 group">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-purple-950/70 px-2 py-0.5 rounded">
              LIMITED OFFER
            </span>
            <h4 className="text-sm font-black text-white mt-2 leading-tight">
              HYPERX USB ELECTRET CONDENSER MIC
            </h4>
            <p className="text-xs text-purple-200 mt-1">
              Special Price: <span className="font-extrabold text-amber-300">৳15,800</span>
            </p>
          </div>
          <div className="relative z-10 mt-3">
            <Link
              href="/category/accessories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-amber-[#facc15] px-3.5 py-1.5 rounded-lg shadow transition-colors"
            >
              <span>Buy Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}


