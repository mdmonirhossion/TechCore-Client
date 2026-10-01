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
 * Fetches all products across pages (default limit 100) or accepts limit param
 */
export async function getProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        queryParams.append(key, val);
      }
    });

    // Default limit to 100 to fetch complete inventory if limit not specified
    if (!queryParams.has('limit')) {
      queryParams.set('limit', '100');
    }

    const firstUrl = `${API_BASE_URL}/api/products?${queryParams.toString()}`;
    const res = await fetch(firstUrl, { cache: 'no-store' });
    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    let allProducts = Array.isArray(data) ? data : (data.products || []);
    const totalPages = Number(data.totalPages) || 1;

    // If caller didn't ask for a specific page and there are multiple pages, fetch remaining pages
    if (!params.page && totalPages > 1) {
      for (let p = 2; p <= totalPages; p++) {
        queryParams.set('page', p.toString());
        const nextUrl = `${API_BASE_URL}/api/products?${queryParams.toString()}`;
        const nextRes = await fetch(nextUrl, { cache: 'no-store' });
        if (nextRes.ok) {
          const nextData = await nextRes.json();
          const nextList = Array.isArray(nextData) ? nextData : (nextData.products || []);
          allProducts = allProducts.concat(nextList);
        }
      }
    }

    return allProducts;
  } catch (err) {
    console.error('getProducts network error:', err.message);
    return [];
  }
}

/**
 * Fetch single product by slug or ID strictly from MongoDB Express Backend
 * Calls GET /api/products/slug/:slug with cache: 'no-store', unwraps response.product,
 * returns null on 404 (no mock fallback).
 */
export async function getProductBySlug(slugOrId) {
  if (!slugOrId) return null;
  const target = String(slugOrId).trim();

  try {
    // 1. Try slug endpoint on backend
    const slugUrl = `${API_BASE_URL}/api/products/slug/${encodeURIComponent(target.toLowerCase())}`;
    const slugRes = await fetch(slugUrl, { cache: 'no-store' });
    if (slugRes.ok) {
      const data = await slugRes.json();
      return data?.product || data || null;
    }

    // 2. If 404 on slug, also attempt lookup by ID in case an ID was passed
    const idUrl = `${API_BASE_URL}/api/products/${encodeURIComponent(target)}`;
    const idRes = await fetch(idUrl, { cache: 'no-store' });
    if (idRes.ok) {
      const idData = await idRes.json();
      return idData?.product || idData || null;
    }

    return null;
  } catch (err) {
    console.error(`getProductBySlug network error for "${slugOrId}":`, err.message);
    return null;
  }
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
    if (!res.ok) {
      return {
        success: false,
        status: res.status,
        message: data?.message || (res.status === 404 
          ? 'Order not found / অর্ডার পাওয়া যায়নি। Please verify your Order ID or phone number.' 
          : 'Order tracking failed / অর্ডার ট্র্যাকিং ব্যর্থ হয়েছে')
      };
    }
    return data;
  } catch (err) {
    return { success: false, message: 'Unable to connect to server / সার্ভারের সাথে সংযোগ করতে ব্যর্থ হয়েছে' };
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
