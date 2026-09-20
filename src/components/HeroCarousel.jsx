import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Zap, ArrowRight, Gift, Cpu, Laptop, Sparkles } from 'lucide-react';

const bannerSlides = [
  {
    id: 1,
    tag: 'SPECIAL MEGA OFFER',
    title: 'লেভো -এর AMD প্রসেসর যুক্ত ল্যাপটপ',
    subtitle: 'নির্দিষ্ট ল্যাপটপ কিনলেই পেয়ে যাচ্ছেন স্মার্টওয়াচ অথবা এয়ারবাডস সম্পূর্ণ ফ্রি!',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=1200&auto=format&fit=crop',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)',
    buttonText: 'অফারটি দেখুন',
    target: 'laptop-finder',
    badgeColor: '#ec4899'
  },
  {
    id: 2,
    tag: 'FLAGSHIP GRAPHICS CARD',
    title: 'ASUS Dual GeForce RTX 4060 OC 8GB',
    subtitle: 'DLSS 3, Ray Tracing & Ultra Gaming Performance - NOW ৳39,999!',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop',
    bgGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #0f172a 100%)',
    buttonText: 'Buy RTX 4060',
    target: 'product-detail:prod-301',
    badgeColor: '#0284c7'
  },
  {
    id: 3,
    tag: 'SMART PC BUILDER',
    title: 'AM5 & DDR5 Gaming Desktop Custom Build',
    subtitle: 'Real-time CPU Socket, RAM & Wattage TDP compatibility validator!',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&auto=format&fit=crop',
    bgGradient: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #0f172a 100%)',
    buttonText: 'Launch PC Builder',
    target: 'pc-builder',
    badgeColor: '#6366f1'
  },
  {
    id: 4,
    tag: 'EXPRESS SERVICE & REPAIR',
    title: 'Instant Service & Live Warranty Tracking',
    subtitle: 'Official Brand Authorized Tech Center for Laptops, GPUs & Motherboards',
    image: 'https://images.unsplash.com/photo-1597872250970-45dca889b703?w=1200&auto=format&fit=crop',
    bgGradient: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f172a 100%)',
    buttonText: 'Request Repair',
    target: 'service-center',
    badgeColor: '#10b981'
  }
];

export default function HeroCarousel({ onNavigate }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Automatic slide rotation every 4 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const slide = bannerSlides[currentSlide];

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
        minHeight: '340px',
        background: slide.bgGradient,
        color: '#ffffff',
        transition: 'background 0.5s ease'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '2rem 2.5rem', alignItems: 'center', minHeight: '340px' }}>
        
        {/* Left Text & CTA */}
        <div style={{ zIndex: 2 }}>
          <span style={{
            background: slide.badgeColor,
            color: '#ffffff',
            padding: '0.35rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            marginBottom: '0.85rem'
          }}>
            <Sparkles size={13} /> {slide.tag}
          </span>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '0.75rem',
            color: '#ffffff'
          }}>
            {slide.title}
          </h2>

          <p style={{
            color: 'rgba(255, 255, 255, 0.85)',
            fontSize: '0.98rem',
            marginBottom: '1.5rem',
            maxWidth: '480px',
            lineHeight: 1.4
          }}>
            {slide.subtitle}
          </p>

          <button
            className="btn-primary"
            onClick={() => onNavigate(slide.target)}
            style={{
              background: '#ffffff',
              color: '#0f172a',
              fontWeight: 800,
              padding: '0.75rem 1.6rem',
              borderRadius: '24px',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
            }}
          >
            {slide.buttonText} <ArrowRight size={18} />
          </button>
        </div>

        {/* Right Image Banner */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <img
            src={slide.image}
            alt={slide.title}
            style={{
              maxWidth: '100%',
              maxHeight: '260px',
              objectFit: 'cover',
              borderRadius: '14px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              transform: 'scale(1)',
              transition: 'transform 0.4s ease'
            }}
          />
        </div>

      </div>

      {/* Prev & Next Controls */}
      <button
        onClick={handlePrev}
        style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.4)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(4px)',
          transition: 'background 0.2s ease'
        }}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={handleNext}
        style={{
          position: 'absolute',
          right: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.4)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50%',
          width: '38px',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(4px)',
          transition: 'background 0.2s ease'
        }}
        aria-label="Next Slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Slide Indicators / Dots */}
      <div style={{
        position: 'absolute',
        bottom: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {bannerSlides.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlide(idx)}
            style={{
              width: currentSlide === idx ? '28px' : '10px',
              height: '8px',
              borderRadius: '4px',
              background: currentSlide === idx ? '#ea580c' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

    </div>
  );
}
