import React from 'react';
import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import ProductCard from '@/components/ProductCard';
import { 
  Laptop, 
  Cpu, 
  Monitor, 
  HardDrive, 
  Headphones, 
  Gamepad2, 
  Zap, 
  ShieldCheck, 
  Truck, 
  Clock, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export const revalidate = 60; // Revalidate home page every 60s (ISR)

const featuredCategories = [
  { id: 1, title: 'Laptop', count: '140+ Items', icon: Laptop, slug: 'laptop', color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-500' },
  { id: 2, title: 'Component', count: '320+ Items', icon: Cpu, slug: 'component', color: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-500' },
  { id: 3, title: 'Desktop PC', count: '85+ Items', icon: HardDrive, slug: 'desktop', color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-500' },
  { id: 4, title: 'Monitor', count: '90+ Items', icon: Monitor, slug: 'monitor', color: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-500' },
  { id: 5, title: 'Accessories', count: '210+ Items', icon: Headphones, slug: 'accessories', color: 'bg-rose-50 text-rose-600 border-rose-200 hover:border-rose-500' },
  { id: 6, title: 'Gaming Gear', count: '115+ Items', icon: Gamepad2, slug: 'accessories/gaming-furniture', color: 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-500' },
  { id: 7, title: 'Power & PSU', count: '65+ Items', icon: Zap, slug: 'component/psu-casing', color: 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:border-cyan-500' },
  { id: 8, title: 'Software', count: '40+ Items', icon: ShieldCheck, slug: 'software', color: 'bg-orange-50 text-orange-600 border-orange-200 hover:border-orange-500' }
];

const fallbackProducts = [
  {
    _id: 'p1',
    id: 'p1',
    name: 'ASUS Dual GeForce RTX 4060 OC Edition 8GB GDDR6 Graphics Card',
    price: 43500,
    discountPrice: 39999,
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'],
    stock: 12,
    badge: 'Save ৳3,501',
    rating: 4.8,
    reviewsCount: 24,
    brand: 'ASUS',
    category: 'Component',
    keyFeatures: ['8GB GDDR6 128-bit', 'PCIe 4.0 Support', 'Dual Axial-tech Fans', '0dB Technology']
  },
  {
    _id: 'p2',
    id: 'p2',
    name: 'Intel 14th Gen Core i7-14700K Gaming Desktop Processor',
    price: 51000,
    discountPrice: 47500,
    images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop'],
    stock: 8,
    badge: 'Popular',
    rating: 4.9,
    reviewsCount: 38,
    brand: 'Intel',
    category: 'Component',
    keyFeatures: ['20 Cores (8 P-cores + 12 E-cores)', 'Up to 5.6 GHz Max Turbo', 'LGA1700 Socket', 'Intel UHD Graphics 770']
  },
  {
    _id: 'p3',
    id: 'p3',
    name: 'ASUS TUF Gaming A15 FA507NUR Ryzen 7 7435HS 16GB RAM RTX 4050 6GB',
    price: 135000,
    discountPrice: 124999,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop'],
    stock: 5,
    badge: 'Top Seller',
    rating: 4.7,
    reviewsCount: 19,
    brand: 'ASUS',
    category: 'Laptop',
    keyFeatures: ['AMD Ryzen 7 7435HS', '16GB DDR5 4800MHz RAM', '512GB PCIe 4.0 NVMe SSD', '15.6" FHD 144Hz IPS']
  },
  {
    _id: 'p4',
    id: 'p4',
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
    keyFeatures: ['3840 x 2160 4K UHD', '144Hz Refresh Rate / 1ms GtG', 'Rapid IPS Panel', 'HDMI 2.1 & Type-C 65W PD']
  },
  {
    _id: 'p5',
    id: 'p5',
    name: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz CL36 RAM Kit',
    price: 16500,
    discountPrice: 14999,
    images: ['https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&auto=format&fit=crop'],
    stock: 20,
    badge: 'DDR5 RGB',
    rating: 4.8,
    reviewsCount: 31,
    brand: 'Corsair',
    category: 'Component',
    keyFeatures: ['32GB (2 x 16GB) Kit', 'DDR5 6000MHz Speed', 'Dynamic Ten-Zone RGB', 'Intel XMP 3.0 Ready']
  }
];

async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';
  try {
    const res = await fetch(`${apiUrl}/api/products`, { next: { revalidate: 60 } });
    if (!res.ok) return fallbackProducts;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackProducts;
  } catch (err) {
    console.error('Fetch products error:', err);
    return fallbackProducts;
  }
}

export default async function HomePage() {
  const products = await getProducts();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'ComputerStore',
    name: 'TechCore Bangladesh',
    url: 'https://techcorebd.com',
    logo: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop',
    description: 'Leading Tech & Computer Shop in Bangladesh offering Laptops, Desktops, Components, Monitors and PC Building Services.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Multiplan Center, New Elephant Road',
      addressLocality: 'Dhaka',
      postalCode: '1205',
      addressCountry: 'BD'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+880-1700-000000',
      contactType: 'customer service',
      areaServed: 'BD',
      availableLanguage: ['en', 'bn']
    }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <div className="container pt-4">
        <HeroCarousel />
      </div>

      {/* Trust Badges */}
      <div className="container">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-4 border-r border-gray-100 last:border-0 pr-4">
            <div className="w-12 h-12 bg-blue-50 text-[#3749bb] rounded-full flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#081621]">Fast Delivery</h3>
              <p className="text-xs text-gray-500">Same day in Dhaka, 48h across BD</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-r border-gray-100 last:border-0 pr-4">
            <div className="w-12 h-12 bg-orange-50 text-[#ea580c] rounded-full flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#081621]">100% Authentic</h3>
              <p className="text-xs text-gray-500">Official brand warranty product</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 border-r border-gray-100 last:border-0 pr-4">
            <div className="w-12 h-12 bg-green-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#081621]">0% EMI Facility</h3>
              <p className="text-xs text-gray-500">Up to 36 months on 30+ banks</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#081621]">Expert Tech Support</h3>
              <p className="text-xs text-gray-500">Dedicated desktop & laptop team</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Category Section - Requirement: 8 Items Row */}
      <section className="container">
        <div className="text-center mb-6">
          <span className="text-xs font-bold text-[#ea580c] tracking-widest uppercase bg-orange-50 px-3 py-1 rounded-full inline-block mb-2">
            Explore Categories
          </span>
          <h2 className="text-2xl font-extrabold text-[#081621]">Featured Category</h2>
          <p className="text-sm text-gray-500 mt-1">Get Your Desired Product from Featured Category!</p>
        </div>

        <div className="featured-categories-grid">
          {featuredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/${cat.slug}`}
                className={`group flex flex-col items-center justify-center p-4 rounded-xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${cat.color}`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-xs text-[#081621] group-hover:text-[#3749bb] text-center line-clamp-1">
                  {cat.title}
                </h3>
                <span className="text-[10px] text-gray-400 mt-0.5">{cat.count}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products Section - Requirement: 5 Items Row */}
      <section className="container">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 border-b pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#ea580c]" />
              <h2 className="text-2xl font-extrabold text-[#081621]">Featured Products</h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">Check & Get Your Desired Product!</p>
          </div>
          <Link
            href="/component"
            className="mt-3 sm:mt-0 text-xs font-bold text-[#3749bb] hover:text-[#ea580c] hover:underline flex items-center"
          >
            View All Products &rarr;
          </Link>
        </div>

        {/* 5 column row on large screens */}
        <div className="featured-products-grid">
          {products.slice(0, 10).map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </section>

      {/* SEO & FAQ Accordion Section */}
      <section className="container">
        <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-extrabold text-[#081621] mb-2">
              Leading Tech & Computer Shop in Bangladesh - TechCore
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              TechCore is Bangladesh’s premier retail and online computer store, offering custom PC building, gaming laptops, 
              high-performance graphics cards, processors, monitors, and official tech accessories. Whether you are building 
              a budget workstation or an extreme liquid-cooled gaming rig, TechCore provides 100% genuine components with official 
              manufacturer warranty, fast nationwide shipping, and flexible 0% EMI financing.
            </p>
          </div>

          <div>
            <h3 className="text-base font-bold text-[#081621] mb-4">Frequently Asked Questions (FAQ)</h3>
            <div className="space-y-4">
              <details className="group border rounded-lg p-4 bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-bold text-xs text-[#081621] cursor-pointer">
                  <span>How can I place an order online at TechCore?</span>
                  <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">&darr;</span>
                </summary>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Browse your desired laptop or component, click "Buy Now" to proceed straight to checkout or "Add Cart" to add multiple items, fill in your delivery details, choose cash on delivery or digital payment, and submit your order.
                </p>
              </details>

              <details className="group border rounded-lg p-4 bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-bold text-xs text-[#081621] cursor-pointer">
                  <span>Does TechCore provide official brand warranty in Bangladesh?</span>
                  <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">&darr;</span>
                </summary>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Yes! All products sold at TechCore are 100% authentic and carry official manufacturer warranty served directly through our authorized service centers across Bangladesh.
                </p>
              </details>

              <details className="group border rounded-lg p-4 bg-gray-50 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between font-bold text-xs text-[#081621] cursor-pointer">
                  <span>How does the PC Builder tool work?</span>
                  <span className="ml-2 text-gray-400 group-open:rotate-180 transition-transform">&darr;</span>
                </summary>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  Our custom PC Builder lets you select compatible CPU, Motherboard, RAM, GPU, Storage, and PSU step-by-step with real-time total price calculation, wattage estimates, and one-click add to cart or print quotation features.
                </p>
              </details>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
