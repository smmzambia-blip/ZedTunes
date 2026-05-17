"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import { Music } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  category?: string;
}

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Single', 'Gospel', 'Hip Hop', 'Zambian', 'RnB', 'Dancehall', 'Afrobeat', 'Kalindula'];

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        let q;
        if (activeCategory === 'All') {
          q = query(collection(db, 'songs'), where('category', '!=', 'Album'), orderBy('category'), orderBy('createdAt', 'desc'));
        } else {
          q = query(collection(db, 'songs'), where('category', '==', activeCategory), orderBy('createdAt', 'desc'));
        }
        
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
  }, [activeCategory]);

  const featuredSong = songs[0];

  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Music size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Music Library</h1>
            <p className="text-gray-500 font-medium tracking-tight">Stream and download local Zambian excellence</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {!loading && songs.length > 0 && activeCategory === 'All' && (
        <div className="mb-16">
          <div className="bg-black rounded-[2.5rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-12 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
            
            <div className="w-64 h-64 md:w-80 md:h-80 aspect-square bg-gray-900 rounded-3xl overflow-hidden relative z-10 shadow-2xl flex-shrink-0">
               {featuredSong?.imageBase64 ? (
                 <img src={featuredSong.imageBase64} alt={featuredSong.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-800">
                   <Music size={100} />
                 </div>
               )}
            </div>

            <div className="flex-1 text-center md:text-left relative z-10">
              <span className="bg-[#39FF14] text-black text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase mb-4 inline-block">Featured Today</span>
              <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter leading-none">{featuredSong?.title}</h2>
              <p className="text-gray-400 text-xl font-bold mb-8">By {featuredSong?.artist}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <a href={`/song/${featuredSong?.id}`} className="bg-white text-black px-10 py-4 rounded-full font-black hover:bg-[#39FF14] transition shadow-lg">LISTEN NOW</a>
                <button className="bg-white/10 hover:bg-white/20 px-10 py-4 rounded-full font-black transition backdrop-blur-md border border-white/10">SHARE</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="bg-gray-100 rounded-3xl aspect-square"></div>
              <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
              <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : songs.length > 0 ? (
        <>
          <h3 className="text-xl font-black mb-8 tracking-tight">{activeCategory === 'All' ? 'All Releases' : activeCategory}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
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
