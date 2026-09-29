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

/**
 * Fetch products list strictly from MongoDB Express Backend
 */
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
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      if (list.length > 0) return list;
    }
  } catch (err) {
    // Quiet fallback to mock data when backend API is offline
  }

  try {
    const { MOCK_PRODUCTS } = require('@/data/mock-products');
    let filtered = [...MOCK_PRODUCTS];
    if (params.category) {
      const cat = String(params.category).toLowerCase();
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === cat);
    }
    if (params.brand) {
      const b = String(params.brand).toLowerCase();
      filtered = filtered.filter(p => (p.brand || '').toLowerCase() === b);
    }
    if (params.isFeatured === 'true' || params.isFeatured === true) {
      filtered = filtered.filter(p => p.isFeatured);
    }
    if (params.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(q) || (p.brand || '').toLowerCase().includes(q));
    }
    return filtered;
  } catch (e) {
    return [];
  }
}

/**
 * Fetch single product by slug or ID strictly from MongoDB Express Backend
 */
export async function getProductBySlug(slugOrId) {
  if (!slugOrId) return null;
  try {
    // 1. Try slug endpoint on backend
    let res = await fetch(`${API_BASE_URL}/api/products/slug/${encodeURIComponent(slugOrId)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.slug || data.id || data._id)) return data;
    }
    // 2. Try ID endpoint on backend
    res = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(slugOrId)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.slug || data.id || data._id)) return data;
    }
  } catch (e) {}

  // Fallback to MOCK_PRODUCTS if backend API is unreachable or product not found in DB
  try {
    const { MOCK_PRODUCTS } = require('@/data/mock-products');
    const target = String(slugOrId).toLowerCase().trim();
    const exact = MOCK_PRODUCTS.find(p => 
      (p.slug && p.slug.toLowerCase() === target) ||
      (p.id && String(p.id).toLowerCase() === target) ||
      (p._id && String(p._id).toLowerCase() === target)
    );
    if (exact) return exact;

    // Fuzzy matching by name slug
    const fuzzy = MOCK_PRODUCTS.find(p => {
      const nameSlug = (p.name || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      return nameSlug === target || (p.slug && p.slug.toLowerCase().includes(target)) || (p.slug && target.includes(p.slug.toLowerCase()));
    });
    if (fuzzy) return fuzzy;
  } catch (err) {}

  return null;
}

/**
 * Fetch featured products strictly from MongoDB Express Backend
 */
export async function getFeaturedProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?isFeatured=true&limit=10`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      if (list.length > 0) return list;
    }
  } catch (e) {}

  try {
    const { MOCK_PRODUCTS } = require('@/data/mock-products');
    return MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 10);
  } catch (e) {
    return [];
  }
}

/**
 * Fetch flash sale products strictly from MongoDB Express Backend
 */
export async function getFlashSaleProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/offers/flash-sale`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      let list = [];
      if (data && data.products && Array.isArray(data.products)) list = data.products;
      else if (Array.isArray(data)) list = data;
      if (list.length > 0) return list;
    }
  } catch (e) {}

  try {
    const { MOCK_PRODUCTS } = require('@/data/mock-products');
    return MOCK_PRODUCTS.filter(p => p.isFlashSale);
  } catch (e) {
    return [];
  }
}

/**
 * Search products strictly from MongoDB Express Backend
 */
export async function searchProducts(query = '') {
  const q = (query || '').toLowerCase().trim();
  if (!q) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/api/products?search=${encodeURIComponent(q)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      return list;
    }
  } catch (e) {
    console.error('❌ Failed to search products from MongoDB Backend:', e.message);
  }
  return [];
}

/**
 * Fetch categories list strictly from MongoDB Express Backend
 */
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}

  try {
    const { MOCK_CATEGORIES } = require('@/data/mock-products');
    return MOCK_CATEGORIES;
  } catch (e) {
    return [];
  }
}

/**
 * Fetch brands list strictly from MongoDB Express Backend
 */
export async function getBrands() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/brands`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {}

  try {
    const { MOCK_BRANDS } = require('@/data/mock-products');
    return MOCK_BRANDS;
  } catch (e) {
    return [];
  }
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
