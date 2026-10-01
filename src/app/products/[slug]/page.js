import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import ProductDetailsClient from '@/components/ProductDetailsClient';
import { ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
      return {
        title: 'Product Not Found - TechCore BD',
        description: 'The requested product could not be found in TechCore catalog.'
      };
    }

    return {
      title: `${product.name} - Price in BD | TechCore`,
      description: `Buy ${product.name} at best price ৳${(product.discountPrice || product.price || 0).toLocaleString()} in Bangladesh with ${product.warranty || 'Official Warranty'} and fast delivery from TechCore.`,
      openGraph: {
        title: product.name,
        description: `Buy ${product.name} for ৳${(product.discountPrice || product.price || 0).toLocaleString()} at TechCore BD`,
        images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : [],
      }
    };
  } catch (err) {
    return {
      title: 'TechCore - Modern Tech Store BD',
      description: 'Explore genuine computer components, gaming laptops, and accessories.'
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error('Error fetching product page:', err);
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <nav className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="hover:text-orange-600 dark:hover:text-orange-400">Home</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <Link href="/products" className="hover:text-orange-600 dark:hover:text-orange-400">Products</Link>
        <ChevronRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
        <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">{product.name}</span>
      </nav>

      <ProductDetailsClient product={product} />
    </div>
  );
}
