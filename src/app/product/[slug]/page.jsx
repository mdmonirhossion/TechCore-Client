import React from 'react';
import Link from 'next/link';
import ProductDetailsClient from './ProductDetailsClient';
import { ChevronRight } from 'lucide-react';

export const revalidate = 60; // ISR for product pages

const mockProduct = {
  _id: 'prod-4060',
  id: 'prod-4060',
  slug: 'asus-dual-geforce-rtx-4060-oc-8gb',
  name: 'ASUS Dual GeForce RTX 4060 OC Edition 8GB GDDR6 Graphics Card',
  price: 43500,
  discountPrice: 39999,
  images: [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop'
  ],
  stock: 12,
  badge: 'Save ৳3,501',
  rating: 4.8,
  reviewsCount: 24,
  brand: 'ASUS',
  category: 'Component',
  productCode: 'GPU-ASUS-4060-8G',
  warranty: '3 Years Replacement Warranty',
  keyFeatures: [
    'NVIDIA Ada Lovelace Streaming Multiprocessors: Up to 2x performance and power efficiency',
    '4th Generation Tensor Cores: Up to 4x performance with DLSS 3 vs. brute-force rendering',
    '3rd Generation RT Cores: Up to 2x ray tracing performance',
    'Axial-tech fan design features a smaller fan hub that facilitates longer blades and a barrier ring',
    '0dB Technology lets you enjoy light gaming in relative silence'
  ],
  specifications: [
    { key: 'Graphic Engine', value: 'NVIDIA® GeForce RTX™ 4060' },
    { key: 'Bus Standard', value: 'PCI Express 4.0' },
    { key: 'OpenGL', value: 'OpenGL®4.6' },
    { key: 'Video Memory', value: '8GB GDDR6' },
    { key: 'Engine Clock', value: 'OC Mode: 2535 MHz, Default Mode: 2505 MHz (Boost)' },
    { key: 'CUDA Core', value: '3072' },
    { key: 'Memory Speed', value: '17 Gbps' },
    { key: 'Memory Interface', value: '128-bit' },
    { key: 'Resolution', value: 'Digital Max Resolution 7680 x 4320' },
    { key: 'Recommended PSU', value: '550W' },
    { key: 'Power Connectors', value: '1 x 8-pin' }
  ]
};

async function fetchProduct(slug) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';
  try {
    const res = await fetch(`${apiUrl}/api/products/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) return mockProduct;
    const data = await res.json();
    return data && data.name ? data : mockProduct;
  } catch (err) {
    return mockProduct;
  }
}

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const product = await fetchProduct(slug);

  return {
    title: `${product.name} - Price in Bangladesh | TechCore`,
    description: `Buy ${product.name} at best price ৳${product.discountPrice || product.price} in BD with ${product.warranty || 'Official Warranty'} and fast delivery.`,
    openGraph: {
      title: product.name,
      description: `Price: ৳${product.discountPrice || product.price} | Stock: ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}`,
      images: Array.isArray(product.images) && product.images.length > 0 ? [product.images[0]] : [],
    },
    alternates: {
      canonical: `https://techcorebd.com/product/${slug}`,
    }
  };
}

export default async function ProductDetailPage({ params }) {
  const slug = (await params).slug;
  const product = await fetchProduct(slug);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: Array.isArray(product.images) ? product.images : [product.image],
    description: product.keyFeatures?.join(', ') || product.name,
    sku: product.productCode || product.id || product._id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'TechCore'
    },
    offers: {
      '@type': 'Offer',
      url: `https://techcorebd.com/product/${slug}`,
      priceCurrency: 'BDT',
      price: product.discountPrice || product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition'
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Breadcrumb Trail */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 overflow-x-auto pb-2 border-b border-gray-200">
        <Link href="/" className="hover:text-[#3749bb]">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <Link href={`/${(product.category || 'component').toLowerCase()}`} className="hover:text-[#3749bb] capitalize">
          {product.category || 'Component'}
        </Link>
        <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="font-semibold text-[#081621] truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Interactive Client View */}
      <ProductDetailsClient product={product} />
    </div>
  );
}
