import { MetadataRoute } from 'next';
import { QuerySnapshot, DocumentData } from 'firebase/firestore';

export const revalidate = 3600; // 1 hour

/**
 * Sitemap metadata route - generates /sitemap.xml
 * This is the ONLY correct sitemap endpoint in Next.js 14
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zedtunez.vercel.app';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
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
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), 5000)
    );

    try {
      const { db } = await import('@/lib/firebase');
      const { collection, getDocs } = await import('firebase/firestore');
      const { generateSlug } = await import('@/lib/slug');

      // Fetch songs with timeout
      try {
        const songsSnapshot = (await Promise.race([
          getDocs(collection(db, 'songs')),
          timeoutPromise,
        ])) as QuerySnapshot<DocumentData>;

        const songRoutes: MetadataRoute.Sitemap = songsSnapshot.docs
          .filter((doc) => {
            const data = doc.data();
            return data.slug || data.title;
          })
          .map((doc) => {
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
      } catch (songError) {
        console.error('Error fetching songs for sitemap:', songError);
      }

      // Fetch artists with timeout
      try {
        const artistsSnapshot = (await Promise.race([
          getDocs(collection(db, 'artists')),
          timeoutPromise,
        ])) as QuerySnapshot<DocumentData>;

        const artistRoutes: MetadataRoute.Sitemap = artistsSnapshot.docs
          .filter((doc) => {
            const data = doc.data();
            return data.slug || data.name;
          })
          .map((doc) => {
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
      } catch (artistError) {
        console.error('Error fetching artists for sitemap:', artistError);
      }
    } catch (importError) {
      console.error('Error importing Firebase modules:', importError);
    }
  } catch (error) {
    console.error('Error in sitemap generation:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
