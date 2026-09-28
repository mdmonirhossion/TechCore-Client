"use client";

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        <div className="footer-grid">
          
          <div>
            <div className="logo-brand" style={{ marginBottom: '1rem' }}>
              <span style={{ color: '#ea580c', fontWeight: 900 }}>Tech</span>
              <span style={{ color: '#0f172a', fontWeight: 900 }}>Core</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
              TechCore BD is Bangladesh's premier technology e-commerce portal providing official warranty laptops, desktop computers, graphics cards, processors, and smart gadgets.
            </p>
            <div style={{ fontSize: '0.84rem', color: '#0f172a', fontWeight: 700 }}>
              Hotline: 01700-000000 | Support: support@techcorebd.com
            </div>
          </div>

          <div>
            <h4 className="footer-title">Popular Categories</h4>
            <ul className="footer-links">
              <li><Link href="/gpu">NVIDIA & AMD Graphics Cards</Link></li>
              <li><Link href="/processor">Intel & AMD Processors</Link></li>
              <li><Link href="/laptop">Gaming & Business Laptops</Link></li>
              <li><Link href="/monitor">4K & 144Hz Gaming Monitors</Link></li>
              <li><Link href="/ram">DDR4 & DDR5 Desktop RAM</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Customer Support</h4>
            <ul className="footer-links">
              <li><Link href="/page/about">About Us</Link></li>
              <li><Link href="/page/contact">Contact Us</Link></li>
              <li><Link href="/outlets">Store Outlets & Locations</Link></li>
              <li><Link href="/emi">EMI Facilities & Calculator</Link></li>
              <li><Link href="/page/warranty">Warranty Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-title">Policies & Info</h4>
            <ul className="footer-links">
              <li><Link href="/page/privacy-policy">Privacy Policy</Link></li>
              <li><Link href="/page/terms">Terms & Conditions</Link></li>
              <li><Link href="/page/refund-policy">Refund & Return Policy</Link></li>
              <li><Link href="/page/online-delivery">Online Delivery System</Link></li>
              <li><Link href="/page/point-policy">Star Point Policy</Link></li>
            </ul>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
          © {new Date().getFullYear()} TechCore Computer & Electronics BD. All Rights Reserved. Powered by TechCore Engine.
        </div>

      </div>
    </footer>
  );
}
