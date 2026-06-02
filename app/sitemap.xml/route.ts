import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { generateSlug } from '@/lib/slug';
import { FALLBACK_SONGS, FALLBACK_ARTISTS } from '@/lib/fallbackData';

export const revalidate = 86400; // 24 hours

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET(req: Request) {
  // Dynamically resolve baseUrl based on incoming request headers
  const host = req.headers.get('host') || 'zedtunez.vercel.app';
  const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

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

  let songsData: { id: string; title: string; slug?: string; category?: string }[] = [];
  let artistsData: { id: string; name: string; slug?: string }[] = [];
  try {
    const songsSnapshot = await getDocs(collection(db, 'songs'));
    songsData = songsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        title: data.title || '', 
        slug: data.slug, 
        category: data.category 
      };
    });

    const artistsSnapshot = await getDocs(collection(db, 'artists'));
    artistsData = artistsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        name: data.name || '', 
        slug: data.slug 
      };
    });
  } catch (error) {
    console.warn('Could not load data for sitemap from Firestore: ' + (error instanceof Error ? error.message : String(error)));
  }

  if (songsData.length === 0) {
    songsData = FALLBACK_SONGS.map(s => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      category: s.category
    }));
  }

  if (artistsData.length === 0) {
    artistsData = FALLBACK_ARTISTS.map(a => ({
      id: a.id,
      name: a.name,
      slug: a.slug
    }));
  }

  const currentDate = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${escapeXml(`${baseUrl}${route}`)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${songsData.map(song => {
  const slug = song.slug || generateSlug(song.title);
  const prefix = song.category === 'Album' ? 'album' : 'song';
  return `  <url>
    <loc>${escapeXml(`${baseUrl}/${prefix}/${slug}`)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
}).join('\n')}
${artistsData.map(artist => {
  const slug = artist.slug || generateSlug(artist.name);
  return `  <url>
    <loc>${escapeXml(`${baseUrl}/artist/${slug}`)}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'X-Robots-Tag': 'noindex', // Keeps indexers from indexing the XML structure itself, while allowing crawling of sitemap contents
    },
  });
}
