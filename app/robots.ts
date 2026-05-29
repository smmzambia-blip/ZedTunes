import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zedtunez.vercel.app';

  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/', '/song/', '/album/', '/artist/'],
        disallow: ['/wp-admin/', '/api/', '/_next/', '/admin/'],
        crawlDelay: 0,
      },
      {
        userAgent: '*',
        allow: ['/', '/song/', '/album/', '/artist/'],
        disallow: ['/wp-admin/', '/api/', '/_next/', '/admin/', '/*.json$'],
        crawlDelay: 1,
      },
    ],
    sitemap: [`${baseUrl}/sitemap.xml`],
    host: baseUrl,
  };
}