"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import { Download, Edit } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface SongCardProps {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  category?: string;
}

export function SongCard({ id, title, artist, imageBase64, category }: SongCardProps) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === "hilzmg70@gmail.com");
    });
    return () => unsubscribe();
  }, []);

  return (
    <Link href={`/song/${id}`} className="flex flex-col gap-3 group cursor-pointer min-w-0 relative">
      <div className="aspect-square bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
          <div className="w-12 h-12 bg-[#39FF14] rounded-full flex items-center justify-center text-black font-black text-[10px] pl-[2px] transition hover:scale-105 shadow-xl"
            onClick={(e) => {
              e.preventDefault();
              // play logic
            }}>
            ▶
          </div>
        </div>
        
        {category === 'Album' && (
          <div className="absolute top-2 left-2 z-30">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">ALBUM</span>
          </div>
        )}

        {isAdmin && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
            <button 
              className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-lg hover:bg-blue-700 transition"
              title="Edit Post"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = `/wp-admin?editSongId=${id}`;
              }}
            >
              <Edit size={14} />
            </button>
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <button 
            className="w-8 h-8 bg-white/10 backdrop-blur text-white flex items-center justify-center rounded-full hover:bg-white/30 hover:scale-105 transition-all"
            title="Download"
            onClick={(e) => {
              e.preventDefault();
              // download logic
            }}
          >
            <Download size={14} />
          </button>
        </div>
        
        {imageBase64 ? (
          <img 
            src={imageBase64} 
            alt={title} 
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110" 
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-200 to-gray-300 z-0"></div>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm truncate text-gray-900 group-hover:text-blue-600 transition-colors">{title}</div>
        <div className="text-xs text-gray-500 truncate mt-0.5">{artist}</div>
      </div>
    </Link>
  );
}
