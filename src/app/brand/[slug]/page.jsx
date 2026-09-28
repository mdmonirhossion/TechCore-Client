import React from 'react';
import ProductCard from '@/components/ProductCard';

export async function generateMetadata({ params }) {
  const slug = (await params).slug;
  const brandName = slug.toUpperCase();
  return {
    title: `${brandName} Products & Price in Bangladesh | TechCore`,
    description: `Buy official ${brandName} laptops, graphics cards, motherboards and computer components at best price in BD.`,
  };
}

const mockBrandProducts = [
  {
    _id: 'b1',
    id: 'b1',
    name: 'ASUS Dual GeForce RTX 4060 OC Edition 8GB GDDR6',
    price: 43500,
    discountPrice: 39999,
    images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop'],
    stock: 12,
    badge: 'Popular',
    rating: 4.8,
    reviewsCount: 24,
    brand: 'ASUS',
    category: 'Component'
  },
  {
    _id: 'b2',
    id: 'b2',
    name: 'ASUS TUF Gaming A15 FA507NUR Ryzen 7 7435HS 16GB RAM RTX 4050',
    price: 135000,
    discountPrice: 124999,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop'],
    stock: 5,
    badge: 'Top Seller',
    rating: 4.7,
    reviewsCount: 19,
    brand: 'ASUS',
    category: 'Laptop'
  }
];

export default async function BrandProductsPage({ params }) {
  const slug = (await params).slug;
  const brandName = slug.toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-extrabold text-[#081621]">{brandName} Products</h1>
        <p className="text-xs text-gray-500 mt-1">Showing all products from {brandName} in Bangladesh</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockBrandProducts.map((product) => (
          <ProductCard key={product.id || product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
