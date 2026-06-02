import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import { Music } from 'lucide-react';
import Link from 'next/link';
import { getCached, setCached } from '@/lib/cache';
import { FALLBACK_SONGS } from '@/lib/fallbackData';

interface Song {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  views?: string;
  imageBase64?: string;
  category?: string;
  archiveLink?: string;
}

export const revalidate = 3600;

async function getSongs(category: string) {
  const cacheKey = `music-category-${category}`;
  const cached = getCached<Song[]>(cacheKey);
  if (cached) return cached;

  try {
    const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    const allSongs = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate().toISOString() : (docData.createdAt || null)
      } as unknown as Song;
    });

    const data = allSongs.filter(s => {
      if (category === 'All') {
        return s.category !== 'Album';
      }
      return s.category === category;
    });

    if (data.length === 0) {
      const fallbackResult = FALLBACK_SONGS.filter(s => {
        if (category === 'All') {
          return s.category !== 'Album';
        }
        return s.category === category;
      });
      return fallbackResult;
    }

    setCached(cacheKey, data);
    return data;
  } catch (e) {
    console.warn("Could not fetch music categories from Firestore: " + (e instanceof Error ? e.message : String(e)));
    // Graceful fallback and filter by category
    const fallbackResult = FALLBACK_SONGS.filter(s => {
      if (category === 'All') {
        return s.category !== 'Album';
      }
      return s.category === category;
    });
    return fallbackResult;
  }
}

export default async function MusicPage({ searchParams }: { searchParams: { category?: string } }) {
  const activeCategory = searchParams.category || 'All';
  const songs = await getSongs(activeCategory);
  
  const categories = ['All', 'Single', 'Gospel', 'Hip Hop', 'Zambian', 'RnB', 'Dancehall', 'Afrobeat', 'Kalindula'];

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Music size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Music Library</h1>
            <p className="text-gray-500 font-medium tracking-tight">Stream and download local Zambian excellence</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/music?category=${cat}`}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {songs.length > 0 ? (
        <>
          <h3 className="text-xl font-black mb-8 tracking-tight uppercase">{activeCategory === 'All' ? 'All Releases' : activeCategory}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
            {songs.map((song) => (
              <SongCard key={song.id} {...song} />
            ))}
          </div>
        </>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <Music className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No tracks found in this category</h3>
          <p className="text-gray-500">Try choosing another category or check back later!</p>
        </div>
      )}
    </div>
  );
}
