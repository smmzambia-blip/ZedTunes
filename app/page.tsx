"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  [key: string]: unknown;
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'), limit(10));
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

  useEffect(() => {
    if (songs.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % songs.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [songs.length]);

  const currentHeroSong = songs[currentSlideIndex];

  return (
    <>
      {loading ? (
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] flex-shrink-0 bg-gray-100 border border-gray-200 min-h-[300px] flex items-center justify-center">
          <span className="text-gray-500">Loading featured...</span>
        </div>
      ) : currentHeroSong ? (
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] flex-shrink-0 bg-gradient-to-r from-emerald-100 to-white border border-gray-200 group min-h-[300px]">
          {currentHeroSong.imageBase64 ? (
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"
              style={{ backgroundImage: `url(${currentHeroSong.imageBase64})` }}
            ></div>
          ) : (
            <div className="absolute inset-0 bg-black opacity-20 group-hover:scale-105 transition-transform duration-1000"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
            <span className="text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-2">Featured Release</span>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-none">{currentHeroSong.title}</h1>
            <p className="text-gray-200 max-w-lg mb-6 line-clamp-2 text-sm md:text-base">By {currentHeroSong.artist}</p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-black px-6 md:px-8 py-3 rounded-full font-bold hover:bg-[#39FF14] transition-colors text-sm">Listen Now</button>
              <button className="bg-black/50 backdrop-blur-md border border-white/20 px-6 md:px-8 py-3 rounded-full font-bold hover:bg-black/70 text-white text-sm">Add to Playlist</button>
              <button className="bg-blue-600/80 backdrop-blur-md border border-blue-400/30 px-6 md:px-8 py-3 rounded-full font-bold hover:bg-blue-600 text-white text-sm">Download</button>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {songs.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentSlideIndex ? 'bg-[#39FF14] w-4' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden aspect-[21/9] flex-shrink-0 bg-gray-100 border border-gray-200 min-h-[300px] flex items-center justify-center">
          <span className="text-gray-500">No featured songs found.</span>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Trending Now</h2>
          <a href="#" className="text-xs text-blue-600 font-bold uppercase hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full py-10 text-center text-gray-500">Loading songs...</div>
          ) : songs.length > 0 ? (
            songs.slice(0, 5).map((song) => (
              <SongCard key={song.id} {...song} />
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500">No songs found.</div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Latest Uploads</h2>
          <a href="#" className="text-xs text-blue-600 font-bold uppercase hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
           {loading ? (
            <div className="col-span-full py-10 text-center text-gray-500">Loading songs...</div>
          ) : songs.length > 0 ? (
            songs.slice(0, 5).map((song) => (
              <SongCard key={`latest-${song.id}`} {...song} />
            ))
          ) : (
             <div className="col-span-full py-10 text-center text-gray-500">No songs found.</div>
          )}
        </div>
      </div>
    </>
  );
}
