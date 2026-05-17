"use client";

import React from "react";
import Image from "next/image";
import { Users, Music } from "lucide-react";
import { SongCard } from "@/components/ui/song-card";

export interface Artist {
  id: string;
  name: string;
  bio: string;
  slug?: string;
  imageBase64?: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  imageBase64?: string;
  category?: string;
  createdAt?: string | null;
  archiveLink?: string;
}

export default function ArtistClient({ artist, songs }: { artist: Artist, songs: Song[] }) {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-8">
      {/* Artist Hero */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-16 bg-gradient-to-br from-purple-50 to-white p-8 md:p-12 rounded-[2rem] border border-purple-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl relative z-10 shrink-0 bg-white">
          {artist.imageBase64 ? (
            <Image 
              src={artist.imageBase64} 
              alt={artist.name} 
              fill
              priority
              sizes="(max-width: 640px) 192px, 256px"
              className="object-cover" 
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Users size={80} />
            </div>
          )}
        </div>
        
        <div className="flex-1 text-center md:text-left relative z-10">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
             <span className="bg-purple-600 text-white text-[10px] font-black px-3 py-1 rounded-full tracking-widest uppercase">Verified Artist</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter">{artist.name}</h1>
          <p className="text-gray-600 max-w-2xl text-lg leading-relaxed">{artist.bio || 'This artist has not shared a bio yet.'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Discography */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <Music className="text-purple-600" size={24} /> Popular Releases
            </h2>
            <div className="text-sm font-bold text-gray-400">{songs.length} Tracks</div>
          </div>

          {songs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {songs.map((song) => (
                <SongCard key={song.id} {...song} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <Music className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900">No releases found</h3>
              <p className="text-gray-500">This artist hasn&apos;t uploaded any music yet.</p>
            </div>
          )}
        </div>

        {/* Artist Sidebar/Stats */}
        <div className="space-y-8">
          <div className="bg-black text-white p-8 rounded-3xl shadow-xl">
            <h3 className="text-xl font-bold mb-6">Artist Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/10 text-sm">
                <span className="text-gray-400">Total Tracks</span>
                <span className="font-black">{songs.length}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10 text-sm">
                <span className="text-gray-400">Total Albums</span>
                <span className="font-black">{songs.filter(s => s.category === 'Album').length}</span>
              </div>
              <div className="flex items-center justify-between py-3 text-sm">
                <span className="text-gray-400">Region</span>
                <span className="font-black text-[#39FF14]">Zambia</span>
              </div>
            </div>
            
            <button className="w-full mt-8 bg-[#39FF14] text-black py-4 rounded-2xl font-black hover:scale-[1.02] transition shadow-lg shadow-[#39FF14]/20">
              FOLLOW ARTIST
            </button>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-lg font-bold mb-4">About {artist.name}</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              {artist.bio || 'No additional information available for this artist.'}
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Twitter', 'Facebook'].map(social => (
                <div key={social} className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:border-black cursor-pointer transition">
                  <div className="w-2 h-2 bg-current rounded-full" title={social}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
