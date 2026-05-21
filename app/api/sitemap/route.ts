import { NextResponse } from 'next/server';
import { QuerySnapshot, DocumentData } from 'firebase/firestore';

export const revalidate = 3600; // 1 hour

/**
 * Sitemap API route handler for /api/sitemap
 * Fetches songs and artists from Firebase and generates XML
 */
export async function GET() {
  const baseUrl = 'https://zedtunez.vercel.app';

  const staticRoutes = [
    { url: baseUrl, changefreq: 'daily', priority: '1.0' },
    { url: `${baseUrl}/music`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/albums`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/artists`, changefreq: 'weekly', priority: '0.8' },
    { url: `${baseUrl}/about`, changefreq: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/contact`, changefreq: 'monthly', priority: '0.5' },
    { url: `${baseUrl}/privacy`, changefreq: 'yearly', priority: '0.3' },
    { url: `${baseUrl}/terms`, changefreq: 'yearly', priority: '0.3' },
  ];

  const dynamicUrlsArray: { url: string; changefreq: string; priority: string }[] = [];

  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    const { db } = await import('@/lib/firebase');
    const { collection, getDocs } = await import('firebase/firestore');
    const { generateSlug } = await import('@/lib/slug');

    // Fetch songs
    try {
      const songsSnapshot = (await Promise.race([
        getDocs(collection(db, 'songs')),
        timeoutPromise,
      ])) as QuerySnapshot<DocumentData>;

      songsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.slug || data.title) {
          const slug = data.slug || generateSlug(data.title || '');
          const prefix = data.category === 'Album' ? 'album' : 'song';
          dynamicUrlsArray.push({
            url: `${baseUrl}/${prefix}/${slug}`,
            changefreq: 'weekly',
            priority: '0.6',
          });
        }
      });
    } catch (error) {
      console.error('Error fetching songs:', error);
    }

    // Fetch artists
    try {
      const artistsSnapshot = (await Promise.race([
        getDocs(collection(db, 'artists')),
        timeoutPromise,
      ])) as QuerySnapshot<DocumentData>;

      artistsSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.slug || data.name) {
          const slug = data.slug || generateSlug(data.name || '');
          dynamicUrlsArray.push({
            url: `${baseUrl}/artist/${slug}`,
            changefreq: 'weekly',
            priority: '0.5',
          });
        }
      });
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  } catch (error) {
    console.error('Error in sitemap generation:', error);
  }

  const allUrls = [...staticRoutes, ...dynamicUrlsArray];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((item) => `  <url>
    <loc>${item.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
