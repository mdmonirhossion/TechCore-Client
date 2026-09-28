import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Tech News, PC Buying Guides & Reviews | TechCore Blog',
  description: 'Read the latest computer buying guides, GPU benchmarks, laptop comparisons and tech news in Bangladesh.',
};

const blogPosts = [
  {
    id: 1,
    title: 'Top 5 Gaming Laptops Under 1 Lakh Taka in BD (2026 Edition)',
    slug: 'top-5-gaming-laptops-under-1-lakh-bd',
    excerpt: 'Looking for high-FPS 1080p gaming performance without breaking your bank? Check out our top picks featuring RTX 4050 and Ryzen processors.',
    author: 'TechCore Editorial Team',
    date: 'September 25, 2026',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'RTX 4060 vs RTX 4070: Which Graphics Card Should You Buy?',
    slug: 'rtx-4060-vs-rtx-4070-comparison',
    excerpt: 'Detailed 1440p gaming benchmarks, power consumption and value for money comparison for desktop gamers in Bangladesh.',
    author: 'Hardware Team',
    date: 'September 20, 2026',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'
  }
];

export default function BlogIndexPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621]">Tech News & Buying Guides</h1>
        <p className="text-xs text-gray-500 mt-1">Expert reviews and hardware recommendations for computer enthusiasts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full bg-gray-50">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 space-y-3 flex-grow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="text-[11px] text-[#3749bb] font-semibold">
                  {post.date} &bull; By {post.author}
                </div>
                <h2 className="font-extrabold text-base text-[#081621] hover:text-[#3749bb]">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{post.excerpt}</p>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-bold text-[#ef4a23] hover:underline inline-block pt-2"
              >
                Read Full Article &rarr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
