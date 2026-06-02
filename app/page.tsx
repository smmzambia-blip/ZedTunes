import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import Link from 'next/link';
import Image from 'next/image';
import { generateSlug } from '@/lib/slug';
import { Sparkles, Flame, TrendingUp } from 'lucide-react';
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

async function getSongs() {
  const cacheKey = 'home-latest-songs';
  const cached = getCached<Song[]>(cacheKey);
  if (cached) return cached;

  try {
    const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(16));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => {
      const docData = doc.data();
      return {
        id: doc.id,
        ...docData,
        createdAt: docData.createdAt?.toDate ? docData.createdAt.toDate().toISOString() : (docData.createdAt || null)
      } as unknown as Song;
    });

    if (data.length === 0) {
      return FALLBACK_SONGS;
    }

    setCached(cacheKey, data);
    return data;
  } catch (e) {
    console.warn("Could not load latest songs from Firestore: " + (e instanceof Error ? e.message : String(e)));
    // Graceful fallback to static high quality songs
    return FALLBACK_SONGS;
  }
}

export default async function Home() {
  const songs = await getSongs();

  const getSongHref = (song: Song) => {
    if (!song) return '#';
    const slug = song.slug || generateSlug(song.title);
    const prefix = song.category === 'Album' ? 'album' : 'song';
    return `/${prefix}/${slug}`;
  };

  const featured = songs[0];
  const hotReleases = songs.slice(0, 6);
  const latestUploads = songs;

  return (
    <div className="flex flex-col gap-16">
      {/* Top Section Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Hero (Featured) */}
        <div className="lg:w-2/3">
          {featured ? (
            <Link href={getSongHref(featured)} className="group relative block aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl transition duration-500 hover:shadow-[#39FF14]/10">
               {featured.imageBase64 && (
                 <Image 
                   src={featured.imageBase64} 
                   alt={featured.title} 
                   fill
                   priority
                   sizes="(max-width: 1024px) 100vw, 66vw"
                   className="object-cover opacity-65 group-hover:scale-[1.03] transition-transform duration-700" 
                   referrerPolicy="no-referrer"
                 />
               )}
               {/* Decorative Gradient overlays for deep premium aesthetic */}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
               <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

               <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white z-20">
                  <div className="flex items-center gap-2 mb-4 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit border border-white/20">
                    <Sparkles size={12} className="text-[#39FF14] animate-pulse" />
                    <span className="text-white text-[9px] font-black tracking-widest uppercase">Spotlight Single</span>
                  </div>
                  <h1 className="text-3xl md:text-6xl font-black mb-3 tracking-tighter leading-none group-hover:text-[#39FF14] transition-colors">{featured.title}</h1>
                  <p className="text-gray-300 text-lg md:text-xl font-bold tracking-tight mb-4">By {featured.artist}</p>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#39FF14] uppercase tracking-widest">
                    <span>Play Session</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
                  </div>
               </div>
            </Link>
          ) : (
             <div className="aspect-[16/9] w-full bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 italic border border-dashed border-gray-200">
               No featured music yet
             </div>
          )}
        </div>

        {/* Hot Releases Sidebar Styled as Numbered Trend Charts */}
        <div className="lg:w-1/3">
          <div className="flex flex-col h-full bg-gray-50/50 rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 z-10">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-500 fill-orange-500" />
                <h2 className="text-lg font-black tracking-tight uppercase text-gray-900">
                  Trending Weekly
                </h2>
              </div>
              <Link href="/music" className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest hover:underline">
                All Tracks
              </Link>
            </div>

            <div className="flex flex-col gap-4 z-10">
              {hotReleases.length > 0 ? hotReleases.map((song, idx) => (
                <Link key={song.id} href={getSongHref(song)} className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-gray-100">
                  <div className="font-mono text-gray-400 font-black text-sm tracking-tighter w-5 text-right group-hover:text-[#39FF14] group-hover:scale-110 transition-all">
                    {(idx + 1).toString().padStart(2, '0')}
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm shrink-0 relative border border-gray-100">
                    {song.imageBase64 && (
                      <Image 
                        src={song.imageBase64} 
                        alt={song.title} 
                        fill 
                        sizes="48px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{song.title}</h3>
                    <p className="text-xs text-gray-500 font-bold truncate opacity-80">{song.artist}</p>
                  </div>
                  <div className="p-1 px-2.5 rounded-full bg-gray-100 text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    Hot
                  </div>
                </Link>
              )) : (
                <p className="text-sm text-gray-400 italic text-center py-12">More releases coming soon</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Uploads */}
      <div>
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#39FF14] fill-black" />
            <h2 className="text-xl font-black tracking-tight uppercase text-gray-900">Latest Airplay & Uploads</h2>
          </div>
          <Link href="/music" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black">Explore Library</Link>
        </div>
        
        {latestUploads.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
            {latestUploads.map((song) => (
              <SongCard key={song.id} {...song} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No music uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
