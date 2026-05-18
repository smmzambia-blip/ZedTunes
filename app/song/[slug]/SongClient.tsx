"use client";

import React, { useState, useEffect } from "react";
import { Download, Heart, Play, Music, Layers, Clock, Edit } from "lucide-react";
import { auth } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import Link from "next/link";
import Image from "next/image";
import { downloadFile } from "@/lib/download";

export interface Song {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  views?: string;
  imageBase64?: string;
  category: string;
  description?: string;
  archiveLink?: string;
  tracks?: { title: string; url: string }[];
  createdAt?: Timestamp | string | null;
}

export default function SongClient({ song }: { song: Song }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const isAlbum = song.category === 'Album';
  const isAdmin = user?.email === "hilzmg70@gmail.com";

  const formatDate = (date: Timestamp | string | null | undefined) => {
    if (!date) return '';
    let d: Date;
    if (typeof date === 'string') {
      d = new Date(date);
    } else if (date && 'toDate' in date) {
      d = date.toDate();
    } else {
      d = new Date();
    }
    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8">
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Link 
            href={`/wp-admin?editSongId=${song.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Edit size={16} /> Edit Post
          </Link>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
        <div className="w-full md:w-80 aspect-square bg-gray-100 rounded-3xl shadow-2xl shadow-black/10 overflow-hidden flex-shrink-0 relative group">
          {song.imageBase64 ? (
            <Image 
              src={song.imageBase64} 
              alt={song.title} 
              fill
              priority
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              {isAlbum ? <Layers size={80} /> : <Music size={80} />}
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
             <button className="w-16 h-16 bg-[#39FF14] rounded-full flex items-center justify-center text-black shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
               <Play size={32} fill="black" />
             </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase ${isAlbum ? 'bg-blue-600' : 'bg-emerald-500'}`}>
                {song.category}
              </span>
              <span className="text-gray-400 text-xs font-bold flex items-center gap-1 tracking-tight">
                <Clock size={12} /> {formatDate(song.createdAt)}
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black mb-2 tracking-tight text-gray-900 leading-none">{song.title}</h1>
            <p className="text-2xl font-bold text-gray-400 hover:text-black transition-colors cursor-pointer inline-block">{song.artist}</p>
          </div>

          {isAlbum ? (
            <div className="flex flex-wrap gap-4 mt-4">
              {song.archiveLink && (
                <button 
                  onClick={() => song.archiveLink && downloadFile(song.archiveLink, `${song.title} - ${song.artist}.zip`)}
                  className="bg-black text-[#39FF14] px-10 py-4 rounded-full font-black hover:scale-105 transition flex items-center gap-3 shadow-lg shadow-black/10"
                >
                  <Download size={22} />
                  DOWNLOAD FULL ALBUM
                </button>
              )}
              <button className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-red-500 transition shadow-sm border border-gray-200">
                <Heart size={24} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6 mt-4">
              {song.archiveLink && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Listen Preview</p>
                  <audio 
                    controls 
                    className="w-full h-10 accent-black"
                    src={song.archiveLink}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => song.archiveLink && downloadFile(song.archiveLink, `${song.title} - ${song.artist}.mp3`)}
                  className="bg-black text-[#39FF14] px-10 py-4 rounded-full font-black hover:scale-105 transition flex items-center gap-3 shadow-lg shadow-black/10"
                >
                  <Download size={22} />
                  FREE DOWNLOAD
                </button>
                <button className="w-14 h-14 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-200 hover:text-red-500 transition shadow-sm border border-gray-200">
                  <Heart size={24} />
                </button>
              </div>
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
             {song.archiveLink && (
               <button 
                onClick={() => downloadFile(song.archiveLink!, `${song.title} - ${song.artist}.zip`)}
                className="text-sm font-bold text-blue-600 hover:underline"
               >
                Download Full Album
               </button>
             )}
          </div>
          <div className="divide-y divide-gray-50">
            {song.tracks.map((track, index) => (
              <div key={index} className="px-8 py-5 flex items-center justify-between hover:bg-gray-50/80 transition-colors group">
                <div className="flex items-center gap-6">
                  <span className="text-gray-300 font-bold w-4 text-sm group-hover:text-black transition-colors">{(index + 1).toString().padStart(2, '0')}</span>
                  <div className="flex items-center gap-4 flex-1">
                    <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                      <Play size={16} fill="currentColor" />
                    </button>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="font-bold text-gray-900 truncate">{track.title}</span>
                      {track.url && (
                        <audio 
                          controls 
                          className="w-full h-8 mt-2 scale-90 origin-left" 
                          src={track.url}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">MP3 • 320kbps</span>
                  <button 
                    onClick={() => downloadFile(track.url, `${track.title} - ${song.artist}.mp3`)}
                    className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-black hover:text-[#39FF14] transition-all border border-gray-200"
                    title="Download Track"
                  >
                    <Download size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-24 border-t border-gray-100 pt-16">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-8 text-center">More from {song.artist}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
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
