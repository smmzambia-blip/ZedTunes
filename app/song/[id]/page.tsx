"use client";

import React, { useState, useEffect } from "react";
import { Download, Heart, Play, Music, Layers, Clock, TrendingUp } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  type?: string;
  description?: string;
  archiveLink?: string;
  tracks?: { title: string; url: string }[];
}

export default function SongPage({ params }: { params: { id: string } }) {
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const docRef = doc(db, 'songs', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSong({ id: docSnap.id, ...docSnap.data() } as Song);
          // Increment views
          updateDoc(docRef, { views: increment(1) });
        }
      } catch (e) {
        console.error("Error fetching song:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchSong();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center animate-pulse">
        <div className="w-64 h-64 bg-gray-200 rounded-2xl mx-auto mb-8"></div>
        <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Song not found</h1>
        <p className="text-gray-500 mt-2">The track you are looking for does not exist or has been removed.</p>
        <button onClick={() => window.history.back()} className="mt-8 text-blue-600 font-bold">Go Back</button>
      </div>
    );
  }

  const isAlbum = song.type === 'album';

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
        <div className="w-full md:w-80 aspect-square bg-gray-100 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden flex-shrink-0 relative group">
          {song.imageBase64 ? (
            <img src={song.imageBase64} alt={song.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              {isAlbum ? <Layers size={80} /> : <Music size={80} />}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button className="w-16 h-16 bg-[#39FF14] rounded-full flex items-center justify-center text-black shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
               <Play size={32} fill="black" />
             </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {isAlbum ? (
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">Album</span>
              ) : song.type === 'trending' ? (
                <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase flex items-center gap-1"><TrendingUp size={10} /> Trending</span>
              ) : (
                <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">Single</span>
              )}
              <span className="text-gray-400 text-xs font-bold flex items-center gap-1 tracking-tight">
                <Clock size={12} /> {song.views || '0'} streams
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black mb-2 tracking-tight text-gray-900 leading-none">{song.title}</h1>
            <p className="text-2xl font-bold text-gray-400 hover:text-black transition-colors cursor-pointer inline-block">{song.artist}</p>
          </div>

          {!isAlbum && (
            <div className="flex flex-wrap gap-4 mt-4">
              <a 
                href={song.archiveLink} target="_blank" rel="noopener noreferrer"
                className="bg-black text-[#39FF14] px-10 py-4 rounded-full font-black hover:scale-105 transition flex items-center gap-3 shadow-lg shadow-black/10"
              >
                <Download size={22} />
                FREE DOWNLOAD
              </a>
              <button className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-red-500 transition shadow-sm border border-gray-200">
                <Heart size={24} />
              </button>
            </div>
          )}

          {song.description && (
            <div className="mt-8 border-t border-gray-100 pt-8">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Description</h2>
              <p className="text-gray-600 leading-relaxed text-lg italic">
                &quot;{song.description}&quot;
              </p>
            </div>
          )}
        </div>
      </div>

      {isAlbum && song.tracks && song.tracks.length > 0 && (
        <div className="mt-12 bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
             <h2 className="text-2xl font-black tracking-tight">Tracklist <span className="text-gray-400 text-sm ml-2 font-medium">({song.tracks.length} songs)</span></h2>
             <button className="text-sm font-bold text-blue-600 hover:underline">Download Full Album</button>
          </div>
          <div className="divide-y divide-gray-50">
            {song.tracks.map((track, index) => (
              <div key={index} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/80 transition-colors group">
                <div className="flex items-center gap-6">
                  <span className="text-gray-300 font-bold w-4 text-sm group-hover:text-black transition-colors">{(index + 1).toString().padStart(2, '0')}</span>
                  <div className="flex items-center gap-4">
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                      <Play size={16} fill="currentColor" />
                    </button>
                    <span className="font-bold text-gray-900">{track.title}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">MP3 • 320kbps</span>
                  <a 
                    href={track.url} target="_blank" rel="noopener noreferrer"
                    className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-black hover:text-[#39FF14] transition-all border border-gray-200"
                    title="Download Track"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Music Placeholder */}
      <div className="mt-24 border-t border-gray-100 pt-16">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 text-center">More from {song.artist}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
           {/* Recents from same artist logic would go here */}
           {[...Array(4)].map((_, i) => (
             <div key={i} className="aspect-square bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-200">
               <Music size={32} />
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
