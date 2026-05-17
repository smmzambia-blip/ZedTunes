import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://zedtunez.vercel.app';

  const staticRoutes = [
    '',
    '/music',
    '/albums',
    '/artists',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  let songIds: string[] = [];
  try {
    const songsSnapshot = await getDocs(collection(db, 'songs'));
    songIds = songsSnapshot.docs.map(doc => doc.id);
  } catch (error) {
    console.error('Error fetching songs for sitemap:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${songIds.map(id => `  <url>
    <loc>${baseUrl}/song/${id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
