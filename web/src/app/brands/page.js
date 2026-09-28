import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Official Computer & Laptop Brands | TechCore Bangladesh',
  description: 'Explore all computer brands available at TechCore including ASUS, MSI, Intel, AMD, Corsair, Gigabyte, Lenovo, HP and Apple.',
};

const brands = [
  { name: 'ASUS', slug: 'asus', logo: '💻', count: '85 Products' },
  { name: 'MSI', slug: 'msi', logo: '🐉', count: '62 Products' },
  { name: 'Intel', slug: 'intel', logo: '⚡', count: '45 Products' },
  { name: 'AMD', slug: 'amd', logo: '🔴', count: '40 Products' },
  { name: 'Corsair', slug: 'corsair', logo: '⛵', count: '55 Products' },
  { name: 'Gigabyte', slug: 'gigabyte', logo: '⚙️', count: '50 Products' },
  { name: 'Lenovo', slug: 'lenovo', logo: '📱', count: '38 Products' },
  { name: 'HP', slug: 'hp', logo: '🖥️', count: '42 Products' }
];

export default function BrandsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621]">Top Brands</h1>
        <p className="text-xs text-gray-500 mt-1">Official brand partner products available at TechCore</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/brand/${brand.slug}`}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-3 hover:shadow-md hover:border-[#3749bb] transition-all group"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform">{brand.logo}</span>
            <h2 className="font-extrabold text-sm text-[#081621] group-hover:text-[#3749bb]">{brand.name}</h2>
            <span className="text-xs text-gray-400">{brand.count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
