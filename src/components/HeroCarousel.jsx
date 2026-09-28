"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    id: 'b1',
    tag: 'STAR TECH FLASH DEAL',
    title: 'Ultimate Gaming Hardware Fest',
    subtitle: 'NVIDIA RTX 40 & 50 Series GPU with 0% EMI up to 12 Months',
    link: '/gpu',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    badgeColor: '#ea580c',
    img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop'
  },
  {
    id: 'b2',
    tag: 'INTEL 14TH GEN PROCESSOR',
    title: 'Intel Core i9 & i7 Performance Series',
    subtitle: 'Build your dream workstation PC with extra 10% Cash Discount',
    link: '/processor',
    bgGradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 60%, #0c4a6e 100%)',
    badgeColor: '#0284c7',
    img: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop'
  },
  {
    id: 'b3',
    tag: 'OFFICIAL LAPTOP FESTIVAL',
    title: 'ASUS TUF & ROG Gaming Laptops',
    subtitle: 'Official 2 Years Warranty with free Gaming Backpack & Mouse',
    link: '/laptop',
    bgGradient: 'linear-gradient(135deg, #6b21a8 0%, #581c87 60%, #3b0764 100%)',
    badgeColor: '#9333ea',
    img: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop'
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = bannerSlides[currentSlide];

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '340px',
        background: slide.bgGradient,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '2.5rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
        transition: 'background 0.5s ease'
      }}
    >
      <div style={{ maxWidth: '480px', zIndex: 2 }}>
        <span
          style={{
            background: slide.badgeColor,
            color: '#ffffff',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            display: 'inline-block',
            marginBottom: '0.85rem'
          }}
        >
          {slide.tag}
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, lineHeight: 1.25, color: '#ffffff', marginBottom: '0.65rem' }}>
          {slide.title}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          {slide.subtitle}
        </p>
        <Link
          href={slide.link}
          style={{
            background: '#ea580c',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            padding: '0.7rem 1.4rem',
            borderRadius: '24px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          Shop Offer Now <ArrowRight size={16} />
        </Link>
      </div>

      {/* Slide Indicators */}
      <div style={{ position: 'absolute', bottom: '15px', right: '25px', display: 'flex', gap: '6px', zIndex: 5 }}>
        {bannerSlides.map((s, idx) => (
          <div
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: idx === currentSlide ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: idx === currentSlide ? '#ea580c' : 'rgba(255, 255, 255, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
}
