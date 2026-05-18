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
    console.error('Error fetching data for sitemap:', error);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${route === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
${songsData.map(song => {
  const slug = song.slug || generateSlug(song.title);
  const prefix = song.category === 'Album' ? 'album' : 'song';
  return `  <url>
    <loc>${baseUrl}/${prefix}/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
}).join('\n')}
${artistsData.map(artist => {
  const slug = artist.slug || generateSlug(artist.name);
  return `  <url>
    <loc>${baseUrl}/artist/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  return new NextResponse(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
