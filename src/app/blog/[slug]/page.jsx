import React from 'react';
import Link from 'next/link';

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const titleFormatted = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${titleFormatted} | TechCore Blog`,
    description: `Read our comprehensive guide on ${titleFormatted} at TechCore Bangladesh.`,
    alternates: {
      canonical: `https://techcorebd.com/blog/${slug}`,
    }
  };
}

export default async function BlogPostPage({ params }) {
  const slug = (await params).slug;
  const titleFormatted = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: titleFormatted,
    description: `Comprehensive guide on ${titleFormatted} for computer enthusiasts in Bangladesh.`,
    author: {
      '@type': 'Organization',
      name: 'TechCore Bangladesh'
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechCore Bangladesh',
      logo: {
        '@type': 'ImageObject',
        url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'
      }
    },
    datePublished: '2026-09-25T10:00:00+06:00'
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="space-y-3 text-center border-b pb-6">
        <span className="text-xs font-bold text-[#3749bb] bg-blue-50 px-3 py-1 rounded-full uppercase">
          Buying Guide
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#081621] leading-tight">
          {titleFormatted}
        </h1>
        <div className="text-xs text-gray-500">
          Published by <strong>TechCore Editorial</strong> &bull; Updated September 25, 2026
        </div>
      </div>

      <div className="prose max-w-none text-xs text-gray-700 leading-relaxed space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <p>
          Selecting the right PC hardware in Bangladesh can be challenging due to rapidly shifting prices and wide variety of options. In this guide, we break down performance metrics, gaming benchmarks, cooling efficiency, and value for money.
        </p>
        <h2 className="text-base font-extrabold text-[#081621]">1. Key Performance Factors</h2>
        <p>
          When evaluating graphics cards or processors, ensure your power supply (PSU) wattage meets the recommended manufacturer thresholds. Pairing a high-end GPU with an inadequate PSU can cause system instability.
        </p>
        <h2 className="text-base font-extrabold text-[#081621]">2. Warranty & Service Center Support</h2>
        <p>
          Always purchase components with official manufacturer warranty. At TechCore, all processors, motherboards, RAM, and graphics cards carry 1 to 3 years of replacement warranty.
        </p>
      </div>
    </article>
  );
}
