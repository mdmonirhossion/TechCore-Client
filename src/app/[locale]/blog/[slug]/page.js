import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MOCK_BLOGS } from '@/data/category-tree';
import { Calendar, User, ChevronRight, Share2, BookOpen } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = MOCK_BLOGS.find(b => b.slug === slug) || MOCK_BLOGS[0];

  return {
    title: `${blog.title} | TechCore Blog`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [blog.image]
    }
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const blog = MOCK_BLOGS.find(b => b.slug === slug) || MOCK_BLOGS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs text-slate-500 pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link href="/blog" className="hover:text-orange-600">Blog</Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="font-semibold text-slate-900 truncate max-w-xs">{blog.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-3">
        <span className="bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-200 inline-block">
          {blog.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 border-b pb-4">
          <span className="flex items-center gap-1"><Calendar size={14} /> {blog.date}</span>
          <span className="flex items-center gap-1"><User size={14} /> {blog.author}</span>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-md">
        <Image src={blog.image} alt={blog.title} fill className="object-cover" priority />
      </div>

      {/* Article Content Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm font-sans text-xs text-slate-800 leading-relaxed space-y-4">
        <div
          className="prose max-w-none text-xs space-y-4 [&_h2]:text-xl [&_h2]:font-black [&_h2]:text-slate-900 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-slate-800 [&_p]:text-slate-600 [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

    </div>
  );
}
