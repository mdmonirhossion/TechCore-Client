import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, Filter, SlidersHorizontal } from 'lucide-react';

export const revalidate = 60; // ISR for category pages

const mockProducts = [
  {
    _id: 'cat-p1',
    id: 'cat-p1',
    name: 'ASUS Dual GeForce RTX 4060 OC Edition 8GB GDDR6',
    price: 43500,
    discountPrice: 39999,
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'],
    stock: 12,
    badge: 'Popular',
    rating: 4.8,
    reviewsCount: 24,
    brand: 'ASUS',
    category: 'Component',
    keyFeatures: ['8GB GDDR6 128-bit', 'PCIe 4.0 Support', 'Dual Axial-tech Fans']
  },
  {
    _id: 'cat-p2',
    id: 'cat-p2',
    name: 'Intel 14th Gen Core i7-14700K Gaming Desktop Processor',
    price: 51000,
    discountPrice: 47500,
    images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop'],
    stock: 8,
    badge: 'Best Value',
    rating: 4.9,
    reviewsCount: 38,
    brand: 'Intel',
    category: 'Component',
    keyFeatures: ['20 Cores (8P + 12E)', 'Up to 5.6 GHz Max Turbo', 'LGA1700 Socket']
  },
  {
    _id: 'cat-p3',
    id: 'cat-p3',
    name: 'MSI MAG 274UPF 27 Inch 4K UHD 144Hz 1ms IPS Gaming Monitor',
    price: 68000,
    discountPrice: 62999,
    images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop'],
    stock: 14,
    badge: '4K UHD',
    rating: 4.9,
    reviewsCount: 15,
    brand: 'MSI',
    category: 'Monitor',
    keyFeatures: ['3840 x 2160 4K UHD', '144Hz Refresh Rate / 1ms', 'Rapid IPS Panel']
  },
  {
    _id: 'cat-p4',
    id: 'cat-p4',
    name: 'ASUS TUF Gaming A15 FA507NUR Ryzen 7 7435HS 16GB RAM RTX 4050',
    price: 135000,
    discountPrice: 124999,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop'],
    stock: 5,
    badge: 'Top Seller',
    rating: 4.7,
    reviewsCount: 19,
    brand: 'ASUS',
    category: 'Laptop',
    keyFeatures: ['AMD Ryzen 7 7435HS', '16GB DDR5 RAM', '512GB NVMe SSD']
  }
];

export async function generateMetadata({ params }) {
  const categorySegments = (await params).category || [];
  const titleFormatted = categorySegments
    .map(s => s.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))
    .join(' - ');

  return {
    title: `${titleFormatted || 'Products'} Price in Bangladesh | TechCore`,
    description: `Buy ${titleFormatted || 'Tech Products'} at best price in Bangladesh with warranty and fast delivery.`,
    alternates: {
      canonical: `https://techcorebd.com/${categorySegments.join('/')}`,
    }
  };
}

async function fetchCategoryProducts(categorySegments) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';
  try {
    const res = await fetch(`${apiUrl}/api/products`, { next: { revalidate: 60 } });
    if (!res.ok) return mockProducts;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : mockProducts;
  } catch (err) {
    return mockProducts;
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const categorySegments = (await params).category || [];
  const products = await fetchCategoryProducts(categorySegments);

  const categoryTitle = categorySegments.length > 0
    ? categorySegments[categorySegments.length - 1].replace(/-/g, ' ').toUpperCase()
    : 'ALL PRODUCTS';

  // Breadcrumbs JSON-LD
  const breadcrumbItems = categorySegments.map((seg, idx) => ({
    '@type': 'ListItem',
    position: idx + 2,
    name: seg.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    item: `https://techcorebd.com/${categorySegments.slice(0, idx + 1).join('/')}`
  }));

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://techcorebd.com'
      },
      ...breadcrumbItems
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Trail */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 overflow-x-auto pb-2">
        <Link href="/" className="hover:text-[#3749bb]">Home</Link>
        {categorySegments.map((seg, idx) => {
          const path = `/${categorySegments.slice(0, idx + 1).join('/')}`;
          const isLast = idx === categorySegments.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
              {isLast ? (
                <span className="font-semibold text-[#081621] capitalize">
                  {seg.replace(/-/g, ' ')}
                </span>
              ) : (
                <Link href={path} className="hover:text-[#3749bb] capitalize">
                  {seg.replace(/-/g, ' ')}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="hidden lg:block space-y-6 bg-white p-5 rounded-xl border border-gray-200 h-fit">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="font-bold text-sm text-[#081621] flex items-center">
              <Filter className="w-4 h-4 mr-2 text-[#ef4a23]" /> Filter Products
            </h3>
            <span className="text-[10px] text-[#3749bb] cursor-pointer hover:underline">Reset</span>
          </div>

          {/* Price Range */}
          <div className="space-y-2 border-b pb-4">
            <h4 className="font-semibold text-xs text-[#081621]">Price Range (৳)</h4>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                placeholder="Min" 
                className="w-full text-xs p-2 border rounded focus:outline-none focus:border-[#3749bb]" 
              />
              <span className="text-gray-400">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                className="w-full text-xs p-2 border rounded focus:outline-none focus:border-[#3749bb]" 
              />
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2 border-b pb-4">
            <h4 className="font-semibold text-xs text-[#081621]">Availability</h4>
            <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded text-[#3749bb]" defaultChecked />
              <span>In Stock Only</span>
            </label>
            <label className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" className="rounded text-[#3749bb]" />
              <span>Pre-Order</span>
            </label>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-[#081621]">Brands</h4>
            {['ASUS', 'MSI', 'Intel', 'AMD', 'Gigabyte', 'Corsair'].map((brand) => (
              <label key={brand} className="flex items-center space-x-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded text-[#3749bb]" />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Product Grid Header & Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-extrabold text-[#081621]">{categoryTitle}</h1>
              <p className="text-xs text-gray-500">Showing {products.length} products</p>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500 whitespace-nowrap">Sort By:</span>
              <select className="text-xs p-2 border rounded-lg bg-gray-50 text-[#081621] focus:outline-none focus:border-[#3749bb]">
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
