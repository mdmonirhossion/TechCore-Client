// Normalize API_BASE_URL (strip trailing slashes or /api suffix if present)
const getApiBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  url = url.trim().replace(/\/+$/, '');
  if (url.endsWith('/api')) {
    url = url.substring(0, url.length - 4);
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();

export const shouldUseMocks = () => {
  return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCKS === 'true';
};

async function getMockModule() {
  try {
    return await import('../data/mock-products.js');
  } catch {
    try {
      // CommonJS fallback
      return require('../data/mock-products');
    } catch {
      try {
        return require('@/data/mock-products');
      } catch {
        return {};
      }
    }
  }
}

export const createSuccessList = (items = []) => {
  const list = Array.isArray(items) ? [...items] : [];
  list.error = false;
  list.hasError = false;
  list.errorMessage = null;
  return list;
};

export const createErrorList = (errorMessage = 'Failed to load data') => {
  const list = [];
  list.error = true;
  list.hasError = true;
  list.errorMessage = errorMessage;
  return list;
};

export const isApiError = (result) => {
  return Boolean(result && (result.error || result.hasError));
};

/**
 * Fetch products list strictly from MongoDB Express Backend
 * Fetches all products across pages (default limit 100) or accepts limit param
 */
export async function getProducts(params = {}) {
  const baseUrl = getApiBaseUrl();
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

    const firstUrl = `${baseUrl}/api/products?${queryParams.toString()}`;
    const res = await fetch(firstUrl, { cache: 'no-store' });
    if (!res.ok) {
      if (shouldUseMocks()) {
        const { MOCK_PRODUCTS = [] } = await getMockModule();
        return createSuccessList(MOCK_PRODUCTS);
      }
      return createErrorList(`Failed to fetch products: ${res.statusText || res.status}`);
    }

    const data = await res.json();
    let allProducts = Array.isArray(data) ? data : (data.products || []);
    const totalPages = Number(data.totalPages) || 1;

    // If caller didn't ask for a specific page and there are multiple pages, fetch remaining pages
    if (!params.page && totalPages > 1) {
      for (let p = 2; p <= totalPages; p++) {
        queryParams.set('page', p.toString());
        const nextUrl = `${baseUrl}/api/products?${queryParams.toString()}`;
        const nextRes = await fetch(nextUrl, { cache: 'no-store' });
        if (nextRes.ok) {
          const nextData = await nextRes.json();
          const nextList = Array.isArray(nextData) ? nextData : (nextData.products || []);
          allProducts = allProducts.concat(nextList);
        }
      }
    }

    return createSuccessList(allProducts);
  } catch (err) {
    console.error('getProducts network error:', err.message);
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return createSuccessList(MOCK_PRODUCTS);
    }
    return createErrorList(err.message);
  }
}

/**
 * Fetch single product by slug or ID strictly from MongoDB Express Backend
 * Calls GET /api/products/slug/:slug with cache: 'no-store', unwraps response.product,
 * returns null on 404 (no mock fallback unless dev flag is enabled).
 */
export async function getProductBySlug(slugOrId) {
  if (!slugOrId) return null;
  const target = String(slugOrId).trim();
  const baseUrl = getApiBaseUrl();

  try {
    // 1. Try slug endpoint on backend
    const slugUrl = `${baseUrl}/api/products/slug/${encodeURIComponent(target.toLowerCase())}`;
    const slugRes = await fetch(slugUrl, { cache: 'no-store' });
    if (slugRes.ok) {
      const data = await slugRes.json();
      return data?.product || data || null;
    }

    // 2. If 404 on slug, also attempt lookup by ID in case an ID was passed
    const idUrl = `${baseUrl}/api/products/${encodeURIComponent(target)}`;
    const idRes = await fetch(idUrl, { cache: 'no-store' });
    if (idRes.ok) {
      const idData = await idRes.json();
      return idData?.product || idData || null;
    }

    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return MOCK_PRODUCTS.find(p =>
        String(p.id) === target ||
        String(p._id) === target ||
        (p.slug && p.slug.toLowerCase() === target.toLowerCase())
      ) || null;
    }

    return null;
  } catch (err) {
    console.error(`getProductBySlug network error for "${slugOrId}":`, err.message);
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return MOCK_PRODUCTS.find(p =>
        String(p.id) === target ||
        String(p._id) === target ||
        (p.slug && p.slug.toLowerCase() === target.toLowerCase())
      ) || null;
    }
    return null;
  }
}

/**
 * Fetch featured products strictly from MongoDB Express Backend
 */
export async function getFeaturedProducts() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/products?isFeatured=true&limit=10`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      return createSuccessList(list);
    }
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return createSuccessList(MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 10));
    }
    return createErrorList(`Failed to fetch featured products: ${res.statusText || res.status}`);
  } catch (e) {
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return createSuccessList(MOCK_PRODUCTS.filter(p => p.isFeatured).slice(0, 10));
    }
    return createErrorList(e.message);
  }
}

/**
 * Fetch flash sale products strictly from MongoDB Express Backend
 */
export async function getFlashSaleProducts() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/offers/flash-sale`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      let list = [];
      if (data && data.products && Array.isArray(data.products)) list = data.products;
      else if (Array.isArray(data)) list = data;
      return createSuccessList(list);
    }
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return createSuccessList(MOCK_PRODUCTS.filter(p => p.isFlashSale));
    }
    return createErrorList(`Failed to fetch flash sale: ${res.statusText || res.status}`);
  } catch (e) {
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      return createSuccessList(MOCK_PRODUCTS.filter(p => p.isFlashSale));
    }
    return createErrorList(e.message);
  }
}

/**
 * Search products strictly from MongoDB Express Backend
 */
export async function searchProducts(query = '') {
  const q = (query || '').toLowerCase().trim();
  if (!q) return createSuccessList([]);
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/products?search=${encodeURIComponent(q)}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.products || []);
      return createSuccessList(list);
    }
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      const list = MOCK_PRODUCTS.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
      return createSuccessList(list);
    }
    return createErrorList(`Failed to search products: ${res.statusText || res.status}`);
  } catch (e) {
    console.error('❌ Failed to search products from MongoDB Backend:', e.message);
    if (shouldUseMocks()) {
      const { MOCK_PRODUCTS = [] } = await getMockModule();
      const list = MOCK_PRODUCTS.filter(p =>
        (p.name || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q)
      );
      return createSuccessList(list);
    }
    return createErrorList(e.message);
  }
}

/**
 * Fetch categories list strictly from MongoDB Express Backend
 */
export async function getCategories() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/categories`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      return createSuccessList(list);
    }
    if (shouldUseMocks()) {
      const { MOCK_CATEGORIES = [] } = await getMockModule();
      return createSuccessList(MOCK_CATEGORIES);
    }
    return createErrorList(`Failed to fetch categories: ${res.statusText || res.status}`);
  } catch (e) {
    if (shouldUseMocks()) {
      const { MOCK_CATEGORIES = [] } = await getMockModule();
      return createSuccessList(MOCK_CATEGORIES);
    }
    return createErrorList(e.message);
  }
}

/**
 * Fetch brands list strictly from MongoDB Express Backend
 */
export async function getBrands() {
  const baseUrl = getApiBaseUrl();
  try {
    const res = await fetch(`${baseUrl}/api/brands`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      return createSuccessList(list);
    }
    if (shouldUseMocks()) {
      const { MOCK_BRANDS = [] } = await getMockModule();
      return createSuccessList(MOCK_BRANDS);
    }
    return createErrorList(`Failed to fetch brands: ${res.statusText || res.status}`);
  } catch (e) {
    if (shouldUseMocks()) {
      const { MOCK_BRANDS = [] } = await getMockModule();
      return createSuccessList(MOCK_BRANDS);
    }
    return createErrorList(e.message);
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

/**
 * Create SSLCommerz Payment Invoice (Payment Link, QR Code, Bangla QR)
 * Calls POST /api/payment/sslcommerz/invoice
 * @param {string} orderId
 * @param {Object} options - { isBanglaQr, sendEmail, sendSms, refer }
 */
export async function createPaymentInvoiceApi(orderId, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payment/sslcommerz/invoice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, ...options })
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message || 'Failed to connect to invoice payment server' };
  }
}

/**
 * Retrieve SSLCommerz Payment Invoice for an order
 * Calls GET /api/payment/sslcommerz/invoice/:orderId
 * @param {string} orderId
 */
export async function getPaymentInvoiceApi(orderId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/payment/sslcommerz/invoice/${encodeURIComponent(orderId)}`);
    return await res.json();
  } catch (err) {
    return { success: false, message: err.message || 'Failed to retrieve invoice payment data' };
  }
}
