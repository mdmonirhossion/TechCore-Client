import React from 'react';
import Link from 'next/link';
import { Flame, Clock, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Latest Laptop & Tech Offers in Bangladesh | TechCore',
  description: 'Check out special discount campaigns, flash sales, cash back offers and bundle deals at TechCore.',
};

const offers = [
  {
    id: 1,
    title: 'Gaming Laptop Cashback Mega Sale',
    slug: 'gaming-laptop-cashback',
    discount: 'Up to ৳15,000 Off',
    expiry: 'Ends in 3 days',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'RTX 40 Series Graphics Card Combo Deal',
    slug: 'rtx-40-combo-deal',
    discount: 'Free 750W PSU Included',
    expiry: 'Limited Stock',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'
  }
];

export default function OffersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621] flex items-center">
          <Flame className="w-6 h-6 mr-2 text-[#ef4a23]" /> Special Deals & Campaigns
        </h1>
        <p className="text-xs text-gray-500 mt-1">Exclusive discount offers available at TechCore</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden bg-gray-50 border flex-shrink-0">
              <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2 flex-grow">
              <span className="text-[10px] font-extrabold bg-red-100 text-[#ef4a23] px-2 py-0.5 rounded">
                {offer.discount}
              </span>
              <h2 className="font-extrabold text-base text-[#081621]">{offer.title}</h2>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                <span>{offer.expiry}</span>
              </div>
              <Link
                href={`/offers/${offer.slug}`}
                className="inline-block bg-[#3749bb] hover:bg-[#2c3a99] text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors mt-2"
              >
                View Campaign
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
