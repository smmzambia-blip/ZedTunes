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
    if (songsSnapshot.size > 0) {
      const songRoutes: MetadataRoute.Sitemap = songsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.slug || data.title; // Only include if has slug or title
        })
        .map(doc => {
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
    }

    // Fetch artists
    const artistsSnapshot = await getDocs(collection(db, 'artists'));
    if (artistsSnapshot.size > 0) {
      const artistRoutes: MetadataRoute.Sitemap = artistsSnapshot.docs
        .filter(doc => {
          const data = doc.data();
          return data.slug || data.name; // Only include if has slug or name
        })
        .map(doc => {
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
    }
  } catch (error) {
    console.error('Error fetching dynamic data for sitemap:', error);
    // Continue with static routes even if dynamic fetch fails
  }

  return [...staticRoutes, ...dynamicRoutes];
}
