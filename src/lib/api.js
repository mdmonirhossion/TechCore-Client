import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_BRANDS } from '@/data/mock-products';

// Normalize API_BASE_URL (strip trailing slashes or /api suffix if present)
const getApiBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  url = url.trim().replace(/\/+$/, '');
  if (url.endsWith('/api')) {
    url = url.substring(0, url.length - 4);
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

export async function getProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParams.append(key, val);
      }
    });
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/products${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.products || []);
    return list.length > 0 ? list : MOCK_PRODUCTS;
  } catch (err) {
    console.warn('Backend API fetch error, falling back to mock products:', err.message);
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(slugOrId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products/${slugOrId}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.slug || data.id || data._id)) return data;
    }
  } catch (e) {
    console.warn('Backend API single product fetch error, using mock:', e.message);
  }

  const match = MOCK_PRODUCTS.find(p => p.slug === slugOrId || p.id === slugOrId || p._id === slugOrId);
  return match || MOCK_PRODUCTS[0];
}

export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isFeatured=true&limit=10`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      if (list.length > 0) return list;
    }
  } catch (e) {}
  const all = await getProducts();
  return all.filter(p => p.isFeatured || (p.rating && p.rating >= 4.8)).slice(0, 10);
}

export async function getFlashSaleProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/offers/flash-sale`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && data.products && data.products.length > 0) {
        return data.products;
      }
    }
  } catch (e) {}
  const all = await getProducts();
  return all.filter(p => p.isFlashSale).slice(0, 8);
}

export async function searchProducts(query = '') {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(q)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      if (list.length > 0) return list;
    }
  } catch (e) {}

  const all = await getProducts();
  return all.filter(p =>
    (p.name && p.name.toLowerCase().includes(q)) ||
    (p.brand && p.brand.toLowerCase().includes(q)) ||
    (p.category && p.category.toLowerCase().includes(q))
  );
}

export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return MOCK_CATEGORIES;
}

export async function getBrands() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/brands`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}
  return MOCK_BRANDS;
}

// Authentication APIs
export async function loginUserApi(credentials) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: err.message || 'Server connection failed' };
  }
}

export async function registerUserApi(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: err.message || 'Server connection failed' };
  }
}

// Order & Checkout APIs
export async function createOrderApi(orderData, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: err.message || 'Server connection failed' };
  }
}

export async function trackOrderApi(identifier) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/track?query=${encodeURIComponent(identifier)}`);
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Unable to connect to server' };
  }
}

// Coupon validation
export async function validateCouponApi(code, subtotal, userId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal, userId })
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Server connection failed' };
  }
}

// PC Builder API
export async function checkPcBuildCompatibility(buildData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/builder/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { compatible: true, errors: [], warnings: [], totalTdp: 0 };
  }
}

export async function savePcBuildApi(buildData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/builder/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildData)
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Failed to save build to server' };
  }
}

export { API_BASE_URL };
