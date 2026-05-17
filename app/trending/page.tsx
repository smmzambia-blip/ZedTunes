"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import { TrendingUp } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  type?: string;
}

export default function TrendingPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const q = query(collection(db, 'songs'), where('type', '==', 'trending'), orderBy('createdAt', 'desc'), limit(20));
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
    fetchTrending();
  }, []);

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
          <TrendingUp size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Trending Now</h1>
          <p className="text-gray-500">The hottest tracks getting all the attention right now</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-square"></div>
          ))}
        </div>
      ) : songs.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {songs.map((song) => (
            <SongCard key={song.id} {...song} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <TrendingUp className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">Nothing trending yet</h3>
          <p className="text-gray-500">Check back soon for the latest hits!</p>
        </div>
      )}
    </div>
  );
}
