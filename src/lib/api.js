import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/data/mock-products';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://techcore-server.vercel.app';

export async function getProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/products${query ? `?${query}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.products || []);
    return list.length > 0 ? list : MOCK_PRODUCTS;
  } catch (err) {
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slugOrId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slugOrId}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.slug || data.id || data._id)) return data;
    }
  } catch (e) {}

  const match = MOCK_PRODUCTS.find(p => p.slug === slugOrId || p.id === slugOrId || p._id === slugOrId);
  return match || MOCK_PRODUCTS[0];
}

export async function getFeaturedProducts() {
  const all = await getProducts();
  return all.filter(p => p.isFeatured || p.rating >= 4.8).slice(0, 10);
}

export async function getFlashSaleProducts() {
  const all = await getProducts();
  return all.filter(p => p.isFlashSale).slice(0, 8);
}

export async function searchProducts(query = '') {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  const all = await getProducts();
  return all.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.brand.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
}

export function getCategories() {
  return MOCK_CATEGORIES;
}

export function getBrands() {
  return MOCK_BRANDS;
}
