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
  type?: string;
}

export default function MusicPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        // Fetch all that are not albums
        const q = query(collection(db, 'songs'), where('type', '!=', 'album'), orderBy('type'), orderBy('createdAt', 'desc'));
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

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
          <Music size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Latest Music</h1>
          <p className="text-gray-500">Discover the freshest tracks from Zambia</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
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
          <Music className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No tracks found</h3>
          <p className="text-gray-500">Check back later for new releases!</p>
        </div>
      )}
    </div>
  );
}
