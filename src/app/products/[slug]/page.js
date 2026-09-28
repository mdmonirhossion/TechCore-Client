import React from 'react';
import Link from 'next/link';
import { getProductBySlug } from '@/lib/api';
import ProductDetailsClient from '@/app/product/[slug]/ProductDetailsClient';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: `${product.name} - Price in BD | TechCore`,
    description: `Buy ${product.name} at best price ৳${(product.discountPrice || product.price).toLocaleString()} in Bangladesh with ${product.warranty || 'Official Warranty'} and fast delivery from TechCore.`,
    openGraph: {
      title: product.name,
      description: `Buy ${product.name} for ৳${(product.discountPrice || product.price).toLocaleString()} at TechCore BD`,
      images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : [],
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center space-x-2 text-xs text-slate-500 overflow-x-auto pb-2 border-b border-slate-200">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <Link href="/products" className="hover:text-orange-600">Products</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="font-semibold text-slate-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <ProductDetailsClient product={product} />
    </div>
  );
}
