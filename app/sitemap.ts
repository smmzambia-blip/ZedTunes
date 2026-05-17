import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zedtunes.com'; // Using a placeholder, but this should be the final domain

  // Static routes
  const staticRoutes = [
    '',
    '/music',
    '/albums',
    '/artists',
    '/trending',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes (Songs)
  // Note: For very large databases, you might want to limit this or use a different strategy
  let songRoutes: MetadataRoute.Sitemap = [];
  try {
    const songsSnapshot = await getDocs(collection(db, 'songs'));
    songRoutes = songsSnapshot.docs.map((doc) => ({
      url: `${baseUrl}/song/${doc.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching songs for sitemap:', error);
  }

  return [...staticRoutes, ...songRoutes];
}
