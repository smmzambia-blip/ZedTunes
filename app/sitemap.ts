import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { generateSlug } from '@/lib/slug';

export const revalidate = 86400; // 24 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zedtunez.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/music`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/albums`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    // Fetch songs
    const songsSnapshot = await getDocs(collection(db, 'songs'));
    const songRoutes: MetadataRoute.Sitemap = songsSnapshot.docs.map(doc => {
      const data = doc.data();
      const slug = data.slug || generateSlug(data.title || '');
      const prefix = data.category === 'Album' ? 'album' : 'song';
      
      return {
        url: `${baseUrl}/${prefix}/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });
    dynamicRoutes = [...dynamicRoutes, ...songRoutes];

    // Fetch artists
    const artistsSnapshot = await getDocs(collection(db, 'artists'));
    const artistRoutes: MetadataRoute.Sitemap = artistsSnapshot.docs.map(doc => {
      const data = doc.data();
      const slug = data.slug || generateSlug(data.name || '');
      
      return {
        url: `${baseUrl}/artist/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      };
    });
    dynamicRoutes = [...dynamicRoutes, ...artistRoutes];
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
