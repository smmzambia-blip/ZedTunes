"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import Link from 'next/link';
import Image from 'next/image';
import { generateSlug } from '@/lib/slug';

import { Timestamp } from 'firebase/firestore';

interface Song {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  views?: string;
  imageBase64?: string;
  category?: string;
  createdAt?: Timestamp;
  archiveLink?: string;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const getSongHref = (song: Song) => {
    if (!song) return '#';
    const slug = song.slug || generateSlug(song.title);
    const prefix = song.category === 'Album' ? 'album' : 'song';
    return `/${prefix}/${slug}`;
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(16));
        const snapshot = await getDocs(q);
        const fetchedSongs: Song[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song));
        setSongs(fetchedSongs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSongs();
  }, []);

  const featured = songs[0];
  const hotReleases = songs.slice(1, 6);
  const latestUploads = songs; // Show all to be safe, or at least a larger set

  return (
    <div className="flex flex-col gap-12">
      {/* Top Section Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Hero (Featured) */}
        <div className="lg:w-2/3">
          {loading ? (
            <div className="aspect-[16/9] w-full bg-gray-100 rounded-[2rem] animate-pulse" />
          ) : featured ? (
            <Link href={getSongHref(featured)} className="group relative block aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl">
               {featured.imageBase64 && (
                 <Image 
                   src={featured.imageBase64} 
                   alt={featured.title} 
                   fill
                   priority
                   sizes="(max-width: 1024px) 100vw, 66vw"
                   className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" 
                   referrerPolicy="no-referrer"
                 />
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
               <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white">
                  <span className="bg-[#39FF14] text-black text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase mb-4 inline-block">Featured Today</span>
                  <h1 className="text-4xl md:text-7xl font-black mb-2 tracking-tighter leading-none">{featured.title}</h1>
                  <p className="text-gray-300 text-xl font-bold tracking-tight mb-2">By {featured.artist}</p>
                  <p className="text-[#39FF14]/80 text-[10px] font-black uppercase tracking-[0.2em]">Click to listen</p>
               </div>
            </Link>
          ) : null}
        </div>

        {/* Hot Releases Sidebar */}
        <div className="lg:w-1/3">
          <div className="flex flex-col h-full bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
            <h2 className="text-xl font-black mb-6 tracking-tight flex items-center justify-between">
              Hot Releases
              <Link href="/music" className="text-[10px] text-blue-600 font-black uppercase tracking-widest hover:underline">View All</Link>
            </h2>
            <div className="flex flex-col gap-4">
              {loading ? (
                [...Array(5)].map((_, i) => <div key={i} className="h-20 bg-gray-200/50 rounded-2xl animate-pulse" />)
              ) : hotReleases.map((song) => (
                <Link key={song.id} href={getSongHref(song)} className="flex items-center gap-4 p-2 rounded-2xl hover:bg-white hover:shadow-sm transition-all group">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm shrink-0 relative">
                    {song.imageBase64 && (
                      <Image 
                        src={song.imageBase64} 
                        alt={song.title} 
                        fill 
                        sizes="64px"
                        className="object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate group-hover:text-blue-600 transition-colors uppercase tracking-tight">{song.title}</h3>
                    <p className="text-xs text-gray-500 font-bold truncate opacity-80">{song.artist}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Latest Uploads */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black tracking-tight uppercase">Latest Uploads</h2>
          <Link href="/music" className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-black">Explore All</Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-2xl" />
                <div className="h-3 w-3/4 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
            {latestUploads.map((song) => (
              <SongCard key={song.id} {...song} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
