"use client";

import Link from 'next/link';
import Image from 'next/image';

interface SongCardProps {
  id: string;
  title: string;
  artist: string;
  coverImage?: string;
  views?: string;
}

export function SongCard({ id, title, artist, coverImage, views }: SongCardProps) {
  return (
    <Link href={`/song/${id}`} className="flex flex-col gap-3 group cursor-pointer min-w-0">
      <div className="aspect-square bg-white/5 rounded-xl border border-white/10 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
          <div className="w-12 h-12 bg-[#39FF14] rounded-full flex items-center justify-center text-black font-black text-[10px] pl-[2px] transition hover:scale-105"
            onClick={(e) => {
              e.preventDefault();
              // play logic
            }}>
            ▶
          </div>
        </div>
        {coverImage ? (
          <Image 
            src={coverImage} 
            alt={title} 
            fill
            className="object-cover group-hover:scale-105 transition duration-500 z-10"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-emerald-800 to-black/80 z-0"></div>
        )}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-sm truncate text-white">{title}</div>
        <div className="text-xs text-gray-500 truncate mt-0.5">{artist}</div>
      </div>
    </Link>
  );
}

// Simple export to prevent Next.js build errors for empty default exports
export default SongCard;
