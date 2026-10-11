import { permanentRedirect, notFound } from 'next/navigation';
import { getTopLevelSlugs } from '@/lib/categories';

const RESERVED_ROUTES = new Set([
  'account',
  'admin',
  'api',
  'blog',
  'brand',
  'brands',
  'cart',
  'category',
  'checkout',
  'compare',
  'emi',
  'laptop-finder',
  'login',
  'my-orders',
  'offers',
  'outlets',
  'page',
  'pc-builder',
  'products',
  'register',
  'search',
  'service-center',
  'track-order',
  'warranty',
  'wishlist',
  '_next',
  'favicon.ico'
]);

export default async function CatchAllCategoryRedirect({ params }) {
  const resolvedParams = await params;
  const categorySegments = resolvedParams?.category || [];

  if (!categorySegments || categorySegments.length === 0) {
    notFound();
  }

  const firstSegment = String(categorySegments[0]).toLowerCase();

  // Guard against capturing existing non-category routes
  if (RESERVED_ROUTES.has(firstSegment)) {
    notFound();
  }

  // Only redirect if the first segment is a known top-level slug
  const knownTopLevelSlugs = await getTopLevelSlugs();
  if (!knownTopLevelSlugs.has(firstSegment)) {
    notFound();
  }

  // Permanent redirect (308) to unified /category/<fullPath>
  const fullPath = categorySegments.join('/');
  permanentRedirect(`/category/${fullPath}`);
}
