"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, MessageSquare, Briefcase } from 'lucide-react';

const bannerSlides = [
  {
    id: 'b1',
    tag: 'SPECIAL MEGA OFFER',
    title: 'লেনোভো-এর AMD প্রসেসর যুক্ত ল্যাপটপ',
    subtitle: 'নির্দিষ্ট ল্যাপটপ কিনলেই পেয়ে যাচ্ছেন স্মার্টওয়াচ অথবা এয়ারবাডস সম্পূর্ণ ফ্রি!',
    linkText: 'অফারটি দেখুন',
    link: '/category/laptop',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop'
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
    subtitle: ' Build your custom workstation with TechCore official brand warranty!',
    linkText: 'Build Custom PC',
    link: '/pc-builder',
    bgGradient: 'linear-gradient(135deg, #581c87 0%, #3b0764 50%, #0f172a 100%)',
    img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = bannerSlides[currentSlide];

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? bannerSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 my-4">
      
      {/* 9. HERO CAROUSEL (Left 2 cols on desktop) */}
      <div
        className="lg:col-span-2 relative rounded-2xl overflow-hidden shadow-xl text-white min-h-[350px] flex items-center p-6 md:p-10 transition-all duration-500 group"
        style={{ background: slide.bgGradient }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full z-10">
          
          {/* Left Text */}
          <div className="space-y-4">
            <span className="inline-block bg-[#ea580c] text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-sm">
              {slide.tag}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {slide.title}
            </h1>
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              {slide.subtitle}
            </p>
            <div>
              <Link
                href={slide.link}
                className="inline-flex items-center gap-2 bg-[#ea580c] hover:bg-orange-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-orange-500/30 transition-all hover:scale-105"
              >
                <span>{slide.linkText}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative w-full h-48 md:h-64 flex items-center justify-center">
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              priority
              className="object-contain drop-shadow-2xl transition-all duration-700 hover:scale-105"
            />
          </div>

        </div>

        {/* Carousel Navigation Buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-orange-600 text-white flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {bannerSlides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-7 bg-[#ea580c]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* 10. RIGHT PROMOTIONAL CARDS (Stacked) */}
      <div className="flex flex-col gap-4">
        
        {/* CUSTOMER FEEDBACK CARD (Blue Gradient) */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white p-6 rounded-2xl shadow-lg border border-blue-700/40 hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all flex flex-col justify-between h-full min-h-[165px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-blue-300 uppercase bg-blue-950/60 px-2.5 py-1 rounded-md">
                CUSTOMER FEEDBACK
              </span>
              <MessageSquare size={20} className="text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white mt-2.5 mb-1">
              টেককোর নিয়ে আপনার অভিযোগ বা মতামত
            </h3>
            <p className="text-xs text-blue-100/80 leading-relaxed font-sans">
              আপনার প্রতিটি পরামর্শ আমাদের সেবার মান আরও বৃদ্ধি করতে সাহায্য করে।
            </p>
          </div>
          <div className="mt-3">
            <Link
              href="/service-center"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 rounded-lg shadow transition-colors"
            >
              <span>জানান এখানে</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* CAREER CARD (Orange Gradient) */}
        <div className="bg-gradient-to-br from-orange-800 via-orange-600 to-amber-700 text-white p-6 rounded-2xl shadow-lg border border-orange-500/40 hover:shadow-orange-500/10 hover:-translate-y-0.5 transition-all flex flex-col justify-between h-full min-h-[165px]">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black tracking-widest text-amber-200 uppercase bg-orange-950/60 px-2.5 py-1 rounded-md">
                APPLY NOW
              </span>
              <Briefcase size={20} className="text-amber-300" />
            </div>
            <h3 className="text-base font-bold text-white mt-2.5 mb-1">
              Shape Your Career With Us!
            </h3>
            <p className="text-xs text-orange-100/90 leading-relaxed font-sans">
              Join TechCore team as Hardware & Service Engineer.
            </p>
          </div>
          <div className="mt-3">
            <Link
              href="/service-center"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-white hover:bg-amber-100 px-3.5 py-1.5 rounded-lg shadow transition-colors"
            >
              <span>Join Our Team</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
