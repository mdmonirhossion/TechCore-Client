export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://techcore-client.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/account/secret/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
