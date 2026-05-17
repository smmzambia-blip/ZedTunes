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

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-3">
              <div className="bg-gray-100 rounded-2xl aspect-square"></div>
              <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : songs.length > 0 ? (
        <>
          <h3 className="text-xl font-black mb-8 tracking-tight uppercase">{activeCategory === 'All' ? 'All Releases' : activeCategory}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-6">
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
