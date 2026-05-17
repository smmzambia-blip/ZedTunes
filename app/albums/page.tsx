"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import { Layers } from 'lucide-react';

import { Timestamp } from 'firebase/firestore';

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  category?: string;
  createdAt?: Timestamp;
  archiveLink?: string;
}

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const q = query(collection(db, 'songs'), where('category', '==', 'Album'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedAlbums: Song[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Song));
        setAlbums(fetchedAlbums);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">New Albums</h1>
          <p className="text-gray-500 font-medium tracking-tight">Full collections and EPs from your favorite artists</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-2xl aspect-square"></div>
          ))}
        </div>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {albums.map((album) => (
            <SongCard key={album.id} {...album} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Layers className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No albums found</h3>
          <p className="text-gray-500">New albums are on the way!</p>
        </div>
      )}
    </div>
  );
}
