import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import { generateSlug } from '@/lib/slug'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const songsCollection = collection(db, 'songs')
    const snapshot = await getDocs(songsCollection)
    
    const songUrls: MetadataRoute.Sitemap = snapshot.docs.map((doc) => {
      const data = doc.data()
      const slug = data.slug || generateSlug(data.title)
      const prefix = data.category === 'Album' ? 'album' : 'song'
      
      return {
        url: `https://zedtunez.vercel.app/${prefix}/${slug}`,
        lastModified: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }
    })

    return [
      {
        url: 'https://zedtunez.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://zedtunez.vercel.app/music',
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      },
      {
        url: 'https://zedtunez.vercel.app/artists',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: 'https://zedtunez.vercel.app/about',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      ...songUrls,
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return [
      {
        url: 'https://zedtunez.vercel.app',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}
