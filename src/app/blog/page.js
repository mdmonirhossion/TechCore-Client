import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_BLOGS } from '@/data/category-tree';
import { Calendar, User, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: 'TechCore Hardware & Tech Blog | Laptop & CPU Buying Guides BD',
    description: 'Read the latest computer component reviews, GPU benchmarks, laptop buying guides, and custom PC building tips in Bangladesh.'
  };
}

export default function BlogListingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900">Tech Blog</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0e1726] to-[#1e293b] text-white p-8 md:p-12 rounded-3xl shadow-xl space-y-3">
        <span className="bg-orange-600 text-white text-xs font-black uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
          <BookOpen size={14} /> Hardware Intelligence
        </span>
        <h1 className="text-3xl font-black text-white">TechCore Hardware & Buying Guides</h1>
        <p className="text-xs text-slate-300 max-w-xl">
          Expert GPU benchmarks, laptop reviews, thermal performance tests, and custom PC building tutorials written by our lead engineers.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_BLOGS.map(blog => (
          <div key={blog.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-lg transition-all group">
            <div className="relative w-full h-56 bg-slate-100 overflow-hidden">
              <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded">
                {blog.category}
              </span>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {blog.author}</span>
                </div>
                <h2 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                  {blog.title}
                </h2>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t">
                <Link
                  href={`/blog/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-orange-600 transition-colors"
                >
                  <span>Read Full Article</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
