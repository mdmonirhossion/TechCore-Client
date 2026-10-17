import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Lock, Award, FileText } from 'lucide-react';

export const revalidate = 60;

const POLICY_DATA = {
  'about': {
    title: 'About TechCore Bangladesh',
    subtitle: 'Leading Computer, Laptop & Electronics Retailer in Bangladesh',
    content: `
      <h2>Welcome to TechCore</h2>
      <p>TechCore is Bangladesh's premier technology e-commerce platform and retail chain. Established with a vision to deliver 100% genuine electronics, custom liquid-cooled gaming PCs, laptops, graphics cards, and server hardware, TechCore serves over 100,000+ satisfied customers nationwide.</p>
      <h3>Our Core Pillars</h3>
      <ul>
        <li><strong>Official Manufacturer Warranty:</strong> Every product sold at TechCore is sourced through official distributor channels carrying valid warranty support.</li>
        <li><strong>0% EMI Financing:</strong> Flexible installment plans across 30+ leading Bangladeshi banks.</li>
        <li><strong>Expert Hardware Team:</strong> Dedicated technicians for liquid cooling, custom cable sleeve routing, and workstation benchmarking.</li>
      </ul>
    `
  },
  'contact': {
    title: 'Contact Us',
    subtitle: 'Get in touch with TechCore customer service and support team',
    content: `
      <h2>How Can We Help You?</h2>
      <p>Whether you have questions about custom PC building, order delivery tracking, warranty claims, or product availability, our team is ready to assist you.</p>
      <h3>Contact Information</h3>
      <p><strong>Hotline:</strong> 01700-000000 (9 AM - 8 PM daily)</p>
      <p><strong>Support Email:</strong> support@techcorebd.com</p>
      <p><strong>Head Office:</strong> Level 4, Shop #408, Multiplan Center, New Elephant Road, Dhaka-1205</p>
    `
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    subtitle: 'How TechCore protects your personal data and account security',
    content: `
      <h2>Your Privacy Matters</h2>
      <p>At TechCore Bangladesh, we respect your privacy and are committed to protecting your personal information. This privacy policy outlines how we collect, use, and safeguard your data when you visit or make a purchase at techcorebd.com.</p>
      <h3>Information We Collect</h3>
      <p>We collect customer name, shipping address, phone number, and email address strictly for order processing, shipping delivery, and warranty validation.</p>
    `
  },
  'terms': {
    title: 'Terms & Conditions',
    subtitle: 'Standard user agreement for purchasing at TechCore BD',
    content: `
      <h2>Terms of Service</h2>
      <p>By accessing or purchasing from TechCore, you agree to comply with our online store terms, warranty guidelines, and delivery conditions.</p>
      <h3>Pricing & Availability</h3>
      <p>All prices listed on TechCore are in Bangladeshi Taka (BDT). Prices and stock availability are subject to market fluctuations without prior notice.</p>
    `
  },
  'refund-policy': {
    title: 'Return & Refund Policy',
    subtitle: 'Hassle-free 7-day replacement and refund process',
    content: `
      <h2>7-Day Return Policy</h2>
      <p>If you receive a defective or damaged product, you can request an instant replacement or full refund within 7 days of delivery.</p>
      <h3>Eligibility Criteria</h3>
      <p>The product must be returned with its original brand box, packaging materials, warranty sticker, and purchase receipt intact.</p>
    `
  },
  'online-delivery': {
    title: 'Online Delivery System',
    subtitle: 'Express delivery across all 64 districts in Bangladesh',
    content: `
      <h2>Nationwide Fast Courier Shipping</h2>
      <p>TechCore partners with Steadfast Courier, RedX, and Paperfly to deliver orders safely across all districts in Bangladesh.</p>
      <h3>Shipping Rates & Free Delivery</h3>
      <p><strong>Orders over ৳10,000 receive FREE Nationwide Shipping!</strong> For orders under ৳10,000: Inside Dhaka shipping is ৳60 (24-48 hours delivery), and Outside Dhaka shipping is ৳120 (48-72 hours delivery).</p>
    `
  },
  'point-policy': {
    title: 'Star Tech Reward Point Policy',
    subtitle: 'Earn reward points on every tech purchase and redeem discounts',
    content: `
      <h2>Earn Points while Shopping</h2>
      <p>For every ৳100 spent at TechCore, registered customers earn 1 TechCore Star Point. Accumulate points and redeem them for instant cash discounts on future laptop or component purchases!</p>
    `
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const pageInfo = POLICY_DATA[slug] || { title: slug.toUpperCase() };

  return {
    title: `${pageInfo.title} | TechCore Bangladesh`,
    description: pageInfo.subtitle || `Read ${pageInfo.title} policy at TechCore BD.`
  };
}

export default async function StaticPolicyPage({ params }) {
  const { slug } = await params;
  const pageInfo = POLICY_DATA[slug] || {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    subtitle: 'Official TechCore Document',
    content: `<p>Policy details for ${slug} are updated regularly. Contact support@techcorebd.com for specific inquiries.</p>`
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">{pageInfo.title}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-[#0e1726] text-white p-8 rounded-2xl shadow-xl space-y-2">
        <h1 className="text-3xl font-black text-white">{pageInfo.title}</h1>
        <p className="text-xs text-slate-300">{pageInfo.subtitle}</p>
      </div>

      {/* Content Block */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-slate-800 text-xs leading-relaxed space-y-4 font-sans border-t-4 border-t-orange-600">
        <div
          className="prose max-w-none text-xs space-y-4 [&_h2]:text-lg [&_h2]:font-black [&_h2]:text-slate-900 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-slate-800 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:text-slate-600"
          dangerouslySetInnerHTML={{ __html: pageInfo.content }}
        />
      </div>

    </div>
  );
}
