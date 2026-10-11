import { getProducts } from '@/lib/api';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techcore-client.vercel.app';
  const products = await getProducts();

  const productUrls = products.map((product) => {
    const slug = product.slug || product.categorySlug || product.id || product._id;
    return {
      url: `${baseUrl}/products/${slug}`,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    };
  });

  const staticPages = [
    '',
    '/brands',
    '/offers',
    '/blog',
    '/pc-builder',
    '/compare',
    '/outlets',
    '/emi',
    '/cart',
    '/checkout',
    '/account'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.7,
  }));

  return [...staticPages, ...productUrls];
}
