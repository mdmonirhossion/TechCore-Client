import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import HeroCarousel from '../components/HeroCarousel';
import {
  Cpu, Zap, Laptop, ShieldCheck, Wrench, ChevronRight, Scale, Sparkles, Award, ArrowRight,
  Tv, Smartphone, Headphones, Activity, Video, Watch, Radio, HardDrive
} from 'lucide-react';

const featuredCategories = [
  { id: 'c1', name: 'Desktop PC', slug: 'desktop', icon: Cpu },
  { id: 'c2', name: 'Gaming Laptop', slug: 'laptop', icon: Laptop },
  { id: 'c3', name: 'Graphics Card', slug: 'gpu', icon: Zap },
  { id: 'c4', name: 'Processor', slug: 'processor', icon: Cpu },
  { id: 'c5', name: 'Motherboard', slug: 'motherboard', icon: ShieldCheck },
  { id: 'c6', name: 'Gaming Monitor', slug: 'monitor', icon: Tv },
  { id: 'c7', name: 'RAM Memory', slug: 'ram', icon: Award },
  { id: 'c8', name: 'Power Station', slug: 'power', icon: Zap },
  { id: 'c9', name: 'Mobile Phone', slug: 'phone', icon: Smartphone },
  { id: 'c10', name: 'Mobile Gear', slug: 'phone', icon: Headphones },
  { id: 'c11', name: 'Health Monitor', slug: 'gadget', icon: Activity },
  { id: 'c12', name: 'WiFi Camera', slug: 'security', icon: Video },
  { id: 'c13', name: 'Smart Watch', slug: 'gadget', icon: Watch },
  { id: 'c14', name: 'Earbuds', slug: 'gadget', icon: Headphones },
  { id: 'c15', name: 'WiFi Router', slug: 'networking', icon: Radio },
  { id: 'c16', name: 'SSD Storage', slug: 'storage', icon: HardDrive }
];

export default function Home({ onNavigate, onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 25, seconds: 42 });

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : (data.products || data.data || []);
        setProducts(list);
      })
      .catch(err => console.error(err));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : (data.categories || [])))
      .catch(err => console.error(err));

    // Flash sale timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flashSaleProducts = products.filter(p => p.isFlashSale);
  const featuredProducts = products.slice(0, 10);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '2rem' }}>

      {/* 1. HERO SECTION WITH AUTOMATIC CAROUSEL & SIDE BANNERS */}
      <section style={{ background: '#f8fafc', padding: '1.5rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', alignItems: 'stretch' }}>
          
          {/* Left Automatic Carousel */}
          <div>
            <HeroCarousel onNavigate={onNavigate} />
          </div>

          {/* Right Side Stacked Promo Banners */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Top Banner: Feedback */}
            <div style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              borderRadius: '16px',
              padding: '1.35rem',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.15)'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', letterSpacing: '0.05em' }}>
                  CUSTOMER FEEDBACK
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.3rem 0 0.4rem 0', color: '#ffffff', lineHeight: 1.3 }}>
                  টেককোর নিয়ে আপনার <br />
                  <span style={{ color: '#fde047' }}>অভিযোগ বা মতামত</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.85)' }}>
                  আপনার প্রতিটি পরামর্শ আমাদের সেবার মান আরও বৃদ্ধি করতে সাহায্য করে।
                </p>
              </div>
              <button
                onClick={() => onNavigate('service-center')}
                style={{
                  marginTop: '0.85rem',
                  background: '#ea580c',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                জানান এখানে <ArrowRight size={14} />
              </button>
            </div>

            {/* Bottom Banner: Career */}
            <div style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #9a3412 100%)',
              borderRadius: '16px',
              padding: '1.35rem',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              boxShadow: '0 6px 18px rgba(234, 88, 12, 0.15)'
            }}>
              <div>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em'
                }}>
                  APPLY NOW
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0.4rem 0 0.2rem 0', color: '#ffffff' }}>
                  Shape Your Career With Us!
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.88)' }}>
                  Join TechCore team as Hardware & Service Engineer.
                </p>
              </div>
              <button
                onClick={() => onNavigate('warranty')}
                style={{
                  marginTop: '0.85rem',
                  background: '#ffffff',
                  color: '#9a3412',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5
                }}
              >
                Join Our Team <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 2. FLASH SALE SECTION */}
      {flashSaleProducts.length > 0 && (
        <section className="container">
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(255, 65, 108, 0.1), rgba(255, 75, 43, 0.05))', border: '1px solid rgba(255, 65, 108, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ff4b2b', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  🔥 Flash Sale Deals
                </h2>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontWeight: 800 }}>
                  <span className="glass-panel" style={{ padding: '0.3rem 0.6rem', background: '#ff416c', color: 'white' }}>{String(timeLeft.hours).padStart(2, '0')}</span> :
                  <span className="glass-panel" style={{ padding: '0.3rem 0.6rem', background: '#ff416c', color: 'white' }}>{String(timeLeft.minutes).padStart(2, '0')}</span> :
                  <span className="glass-panel" style={{ padding: '0.3rem 0.6rem', background: '#ff416c', color: 'white' }}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('products'); }} style={{ color: 'var(--primary-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                View All Deals <ChevronRight size={16} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {flashSaleProducts.map(p => (
                <ProductCard key={p.id || p._id} product={p} onSelectProduct={onSelectProduct} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED CATEGORY (STAR TECH STYLE GRID) */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a' }}>
            Featured Category
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 600, marginTop: '0.2rem' }}>
            Get Your Desired Product from Featured Category!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.85rem' }}>
          {featuredCategories.map(cat => {
            const IconComp = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => onNavigate(`products:category=${cat.slug}`)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.25rem 0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = '#ea580c';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(234, 88, 12, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.6rem' }}>
                  <IconComp size={28} color="#334155" />
                </div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>
                  {cat.name}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (GRID MATCHING SCREENSHOT) */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#0f172a' }}>
            Featured Products
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.92rem', fontWeight: 600, marginTop: '0.2rem' }}>
            Check & Get Your Desired Product!
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {featuredProducts.map(p => (
            <ProductCard key={p.id || p._id} product={p} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      </section>

      {/* 5. PC BUILDER & SERVICE CENTER FEATURE BANNER */}
      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)' }}>
          <Cpu size={40} color="var(--primary-cyan)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Smart PC Builder Tool</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Check CPU AM5 socket & DDR5 RAM compatibility with instant watt TDP estimation & print quotation.
          </p>
          <button className="btn-primary" onClick={() => onNavigate('pc-builder')}>
            Build Desktop Now <ArrowRight size={16} />
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, #f3e8ff 0%, #ffffff 100%)' }}>
          <Wrench size={40} color="var(--accent-purple)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Servicing & Warranty Center</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
            Submit online repair requests, verify serial number warranty status, and track live technician job updates.
          </p>
          <button className="btn-secondary" style={{ border: '1px solid var(--accent-purple)' }} onClick={() => onNavigate('service-center')}>
            Request Repair Service <ArrowRight size={16} />
          </button>
        </div>
      </section>

    </div>
  );
}
