import React from 'react';
import ProductCard from '@/components/ProductCard';

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  return {
    title: `Campaign Details - ${slug} | TechCore Offers`,
    description: `Special discount campaign and tech deal details at TechCore Bangladesh.`,
  };
}

const campaignProducts = [
  {
    _id: 'op1',
    id: 'op1',
    name: 'ASUS TUF Gaming A15 FA507NUR Ryzen 7 7435HS 16GB RAM RTX 4050',
    price: 135000,
    discountPrice: 124999,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop'],
    stock: 5,
    badge: 'Save ৳10,001',
    rating: 4.7,
    reviewsCount: 19,
    brand: 'ASUS',
    category: 'Laptop'
  }
];

export default async function OfferDetailPage({ params }) {
  const slug = (await params).slug;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-[#081621] text-white p-8 rounded-2xl text-center space-y-2 shadow-xl">
        <span className="text-xs font-bold bg-[#ef4a23] text-white px-3 py-1 rounded-full uppercase">
          Active Campaign
        </span>
        <h1 className="text-2xl font-black capitalize">{slug.replace(/-/g, ' ')}</h1>
        <p className="text-xs text-gray-300">Offers valid while stock lasts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {campaignProducts.map((prod) => (
          <ProductCard key={prod.id || prod._id} product={prod} />
        ))}
      </div>
    </div>
  );
}
