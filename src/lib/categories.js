import { API_BASE_URL, shouldUseMocks } from '@/lib/api';
import { CATEGORY_TREE } from '@/data/category-tree';

/**
 * Normalizes any category node to { name, slug, fullPath, children }
 * Preserves other metadata (icons, ids, images) if present.
 */
export function normalizeNode(node, parentPath = '') {
  if (!node) return null;

  const name = node.name || node.title || '';
  let rawSlug = String(node.slug || '').trim();
  let fullPath = node.fullPath ? String(node.fullPath).trim() : '';

  if (!fullPath) {
    if (rawSlug.includes('/')) {
      fullPath = rawSlug;
    } else if (parentPath) {
      fullPath = `${parentPath}/${rawSlug}`;
    } else {
      fullPath = rawSlug;
    }
  }

  // Strip leading and trailing slashes
  fullPath = fullPath.replace(/^\/+|\/+$/g, '');

  const slug = rawSlug.includes('/')
    ? rawSlug.split('/').pop()
    : (rawSlug || fullPath.split('/').pop() || '');

  const rawChildren = Array.isArray(node.children)
    ? node.children
    : (Array.isArray(node.subcategories) ? node.subcategories : []);

  const children = rawChildren
    .map((child) => {
      if (typeof child === 'string') {
        const childSlug = child.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const childFullPath = fullPath ? `${fullPath}/${childSlug}` : childSlug;
        return {
          name: child,
          slug: childSlug,
          fullPath: childFullPath,
          children: []
        };
      }
      return normalizeNode(child, fullPath);
    })
    .filter(Boolean);

  return {
    ...node,
    name,
    slug,
    fullPath,
    children
  };
}

/**
 * Recursively normalizes a category tree array to { name, slug, fullPath, children }
 */
export function normalizeTree(tree) {
  if (!Array.isArray(tree)) return [];
  return tree.map((node) => normalizeNode(node, '')).filter(Boolean);
}

/**
 * Fetches the category tree from the API with Next.js ISR (revalidate: 300).
 * Falls back to CATEGORY_TREE from data/category-tree.js on failure or empty response.
 */
export async function getCategoryTree() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/tree`, {
      next: { revalidate: 300 }
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data?.tree || data?.categories || []);
      if (list && list.length > 0) {
        return normalizeTree(list);
      }
    }
  } catch (err) {
    // Network or server unreachable, fallback to normalized static tree
  }

  return normalizeTree(CATEGORY_TREE);
}

/**
 * Returns a Set of all known top-level category slugs (lowercase)
 * Used to validate /[...category] before permanent redirection.
 */
export async function getTopLevelSlugs() {
  const tree = await getCategoryTree();
  const slugs = new Set(
    tree.map((node) => (node.slug || node.fullPath || '').toLowerCase()).filter(Boolean)
  );

  // Fallback tree top-level slugs
  if (Array.isArray(CATEGORY_TREE)) {
    CATEGORY_TREE.forEach((node) => {
      const s = (node.slug || node.id || '').toLowerCase();
      if (s) slugs.add(s.split('/')[0]);
    });
  }

  // Common standard top-level tech slugs
  const wellKnown = [
    'desktop',
    'laptop',
    'component',
    'components',
    'processor',
    'motherboard',
    'ram',
    'storage',
    'psu',
    'casing',
    'monitor',
    'gpu',
    'networking',
    'accessories',
    'gaming',
    'mobile',
    'smartwatch',
    'earbuds',
    'camera',
    'office',
    'software'
  ];
  wellKnown.forEach((s) => slugs.add(s));

  return slugs;
}

/**
 * Helper to recursively search a category tree for a matching fullPath or slug
 */
function findNodeInTree(nodes, targetPath) {
  const normTarget = targetPath.toLowerCase().replace(/^\/+|\/+$/g, '');
  for (const node of nodes) {
    const nodePath = (node.fullPath || node.slug || '').toLowerCase().replace(/^\/+|\/+$/g, '');
    if (nodePath === normTarget || node.slug?.toLowerCase() === normTarget) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeInTree(node.children, targetPath);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Fetch category resolution by full path:
 * GET /api/categories/by-path/<path>
 * Returns { category, breadcrumb, children, descendantSlugs, descendantIds } or null if not found
 */
/**
 * Derives facet aggregations from an array of products
 */
export function deriveFacetsFromProducts(products = []) {
  if (!products || products.length === 0) {
    return {
      priceRange: { min: 0, max: 0 },
      brands: [],
      availability: { IN_STOCK: 0, PRE_ORDER: 0, UP_COMING: 0, OUT_OF_STOCK: 0 },
      specs: []
    };
  }

  let min = Infinity;
  let max = 0;
  const brandCounts = new Map();
  const availMap = { IN_STOCK: 0, PRE_ORDER: 0, UP_COMING: 0, OUT_OF_STOCK: 0 };
  const specMaps = new Map();

  for (const p of products) {
    const effPrice = p.discountPrice && p.discountPrice > 0 ? p.discountPrice : (p.price || 0);
    if (effPrice > 0) {
      if (effPrice < min) min = effPrice;
      if (effPrice > max) max = effPrice;
    }

    if (p.brand) {
      const b = p.brand.trim();
      brandCounts.set(b, (brandCounts.get(b) || 0) + 1);
    }

    const st = (p.stockStatus || (p.stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK')).toUpperCase();
    if (availMap.hasOwnProperty(st)) {
      availMap[st]++;
    } else {
      availMap.IN_STOCK++;
    }

    if (p.specifications && typeof p.specifications === 'object') {
      for (const [k, v] of Object.entries(p.specifications)) {
        if (!v) continue;
        if (!specMaps.has(k)) specMaps.set(k, new Map());
        const m = specMaps.get(k);
        const strVal = String(v).trim();
        m.set(strVal, (m.get(strVal) || 0) + 1);
      }
    }
  }

  const brands = Array.from(brandCounts.entries()).map(([name, count]) => ({ name, count }));
  brands.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const specs = [];
  for (const [key, valMap] of specMaps.entries()) {
    const values = Array.from(valMap.entries()).map(([value, count]) => ({ value, count }));
    if (values.length > 0) {
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase())
        .trim();
      specs.push({ key, label, values });
    }
  }

  return {
    priceRange: { min: min === Infinity ? 0 : min, max },
    brands,
    availability: availMap,
    specs
  };
}

/**
 * Fetch category resolution by full path:
 * GET /api/categories/by-path/<path>
 * Returns { category, breadcrumb, children, descendantSlugs, descendantIds } or null if not found
 */
export async function getCategoryByPath(fullPath) {
  if (!fullPath) return null;
  const cleanPath = String(fullPath).trim().replace(/^\/+|\/+$/g, '');

  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/by-path/${cleanPath}`, {
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.category) {
        return data;
      }
    }
  } catch (err) {
    // Network / service error: try fallback tree
  }

  // Fallback: search local normalized CATEGORY_TREE
  const fallbackTree = normalizeTree(CATEGORY_TREE);
  const matchedNode = findNodeInTree(fallbackTree, cleanPath);
  if (matchedNode) {
    const segments = cleanPath.split('/').filter(Boolean);
    const breadcrumb = [];
    let curPath = '';
    for (const seg of segments) {
      curPath = curPath ? `${curPath}/${seg}` : seg;
      const segNode = findNodeInTree(fallbackTree, curPath);
      breadcrumb.push({
        id: segNode?.id || seg,
        name: segNode?.name || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        slug: seg,
        fullPath: curPath
      });
    }

    return {
      category: matchedNode,
      breadcrumb,
      children: matchedNode.children || [],
      descendantSlugs: [matchedNode.slug],
      descendantIds: [matchedNode.id || matchedNode.slug]
    };
  }

  return null;
}

/**
 * Fetch category filter facets:
 * GET /api/categories/by-path/<path>/filters
 * Returns { priceRange, brands, availability, specs }
 */
export async function getCategoryFilters(fullPath) {
  const cleanPath = String(fullPath || '').trim().replace(/^\/+|\/+$/g, '');
  const emptyFilters = {
    priceRange: { min: 0, max: 0 },
    brands: [],
    availability: { IN_STOCK: 0, PRE_ORDER: 0, UP_COMING: 0, OUT_OF_STOCK: 0 },
    specs: []
  };

  if (!cleanPath) return emptyFilters;

  try {
    const res = await fetch(`${API_BASE_URL}/api/categories/by-path/${cleanPath}/filters`, {
      next: { revalidate: 300 }
    });

    if (res.ok) {
      const data = await res.json();
      return {
        priceRange: data.priceRange || { min: 0, max: 0 },
        brands: Array.isArray(data.brands) ? data.brands : [],
        availability: data.availability || emptyFilters.availability,
        specs: Array.isArray(data.specs) ? data.specs : []
      };
    }
  } catch (err) {
    // Network / server failure
  }

  return emptyFilters;
}

/**
 * Fetch products list with category and filter query params:
 * GET /api/products?category=<path>&limit=24&page=<n>&...
 */
export async function getCategoryProducts(fullPath, query = {}) {
  const cleanPath = String(fullPath || '').trim().replace(/^\/+|\/+$/g, '');
  const queryParams = new URLSearchParams();

  queryParams.set('category', cleanPath);
  queryParams.set('limit', String(query.limit || 24));
  queryParams.set('page', String(query.page || 1));

  if (query.sort) queryParams.set('sort', query.sort);
  if (query.minPrice !== undefined && query.minPrice !== '') queryParams.set('minPrice', String(query.minPrice));
  if (query.maxPrice !== undefined && query.maxPrice !== '') queryParams.set('maxPrice', String(query.maxPrice));
  if (query.brand) queryParams.set('brand', query.brand);
  if (query.stockStatus) queryParams.set('stockStatus', query.stockStatus);
  if (query.inStock) queryParams.set('inStock', query.inStock);

  // Specifications filters: spec_<key>
  Object.entries(query).forEach(([key, val]) => {
    if (key.startsWith('spec_') && val) {
      queryParams.set(key, String(val));
    }
  });

  try {
    const res = await fetch(`${API_BASE_URL}/api/products?${queryParams.toString()}`, {
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return {
          products: data,
          total: data.length,
          page: Number(query.page) || 1,
          limit: Number(query.limit) || 24,
          totalPages: Math.ceil(data.length / (Number(query.limit) || 24)) || 1
        };
      }
      return {
        products: data.products || [],
        total: Number(data.totalProducts ?? data.total) || (data.products ? data.products.length : 0),
        page: Number(data.currentPage ?? data.page) || 1,
        limit: Number(data.limit) || 24,
        totalPages: Number(data.totalPages) || 1
      };
    }
  } catch (err) {
    console.error('getCategoryProducts network error:', err.message);
  }

  // Fallback to local products only when development mock flag is active
  if (shouldUseMocks()) {
    try {
      const { MOCK_PRODUCTS } = await import('@/data/mock-products');
      const filtered = (MOCK_PRODUCTS || []).filter((p) => {
        const cat = (p.categorySlug || p.category || '').toLowerCase();
        const cp = cleanPath.toLowerCase();
        return cat.includes(cp) || cp.includes(cat);
      });
      return {
        products: filtered,
        total: filtered.length,
        page: 1,
        limit: 24,
        totalPages: 1
      };
    } catch (e) {}
  }

  return {
    products: [],
    total: 0,
    page: 1,
    limit: 24,
    totalPages: 1
  };
}
