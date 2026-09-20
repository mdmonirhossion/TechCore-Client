import React from 'react';
import { Cpu, Phone, Mail, MapPin, ShieldCheck, Wrench, CreditCard } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo-brand" style={{ marginBottom: '1rem' }}>
              <Cpu className="gradient-text" size={28} />
              <span>TECH<span className="gradient-text">CORE</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
              TechCore is Bangladesh's premier Computer & Electronics retailer, PC Builder specialist, and authorised service management platform.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span><MapPin size={14} style={{ verticalAlign: 'middle' }} /> 28 Kazi Nazrul Islam Ave, Dhaka 1215</span>
              <span><Phone size={14} style={{ verticalAlign: 'middle' }} /> 09678002003 / 16793</span>
              <span><Mail size={14} style={{ verticalAlign: 'middle' }} /> support@techcore.com.bd</span>
            </div>
          </div>

          <div>
            <h4 className="footer-title">Customer Service</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('track-order'); }}>Track Your Order</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('service-center'); }}>Service Center & Repair</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('warranty'); }}>Warranty Claim Policy</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('pc-builder'); }}>Custom PC Builder</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('laptop-finder'); }}>Laptop Finder Assistant</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Popular Categories</h4>
            <ul className="footer-links">
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('products:category=gpu'); }}>NVIDIA & AMD Graphics Cards</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('products:category=processor'); }}>Intel 14th Gen & AMD AM5 CPUs</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('products:category=motherboard'); }}>B650 & Z790 Gaming Motherboards</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('products:category=laptop'); }}>ROG & Legion Gaming Laptops</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActivePage('products:category=ram'); }}>DDR5 & DDR4 Memory Kits</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Payment & Support</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              We support Cash on Delivery, bKash, Nagad, Visa, Mastercard & EMI facilities up to 36 months.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="glass-panel" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-cyan)' }}>bKash</span>
              <span className="glass-panel" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Nagad</span>
              <span className="glass-panel" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, color: '#3b82f6' }}>Visa / MC</span>
              <span className="glass-panel" style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', fontWeight: 700, color: '#10b981' }}>COD</span>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          © 2026 TechCore Bangladesh. All Rights Reserved. Complete MERN Computer & ERP System.
        </div>
      </div>
    </footer>
  );
}
