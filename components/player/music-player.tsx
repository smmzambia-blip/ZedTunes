"use client";

import { Play, Pause, SkipForward, SkipBack, Volume2, Heart, Shuffle, Repeat, Mic2, MonitorSpeaker } from 'lucide-react';
import Image from 'next/image';

export function MusicPlayer() {
  return (
    <footer className="h-24 bg-black border-t border-white/10 px-4 sm:px-8 flex items-center justify-between z-50">
      {/* Track Info */}
      <div className="flex items-center gap-4 w-72 min-w-0">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-black rounded-lg flex-shrink-0"></div>
        <div className="overflow-hidden hidden sm:block">
          <div className="text-sm font-bold text-white truncate">Tuleya Kuli Lesa</div>
          <div className="text-xs text-gray-500 truncate mt-0.5">Chef 187 • Bon Appetit</div>
        </div>
        <button className="text-gray-400 hover:text-white transition hidden sm:block">
          <Heart size={16} />
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2 max-w-xl w-full">
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition hidden sm:block">
            <Shuffle size={18} />
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-black hover:scale-105 transition">
            <Play size={16} fill="currentColor" className="ml-1" />
          </button>
          <button className="text-gray-400 hover:text-white transition">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-gray-400 hover:text-white transition hidden sm:block">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full max-w-md hidden sm:flex">
          <span className="text-[10px] text-gray-500">1:24</span>
          <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden cursor-pointer group">
            <div className="bg-[#39FF14] h-full w-[45%] group-hover:bg-green-400 relative">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"></div>
            </div>
          </div>
          <span className="text-[10px] text-gray-500">3:45</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-72 hidden md:flex">
        <button className="text-gray-400 hover:text-white transition">
          <Mic2 size={16} />
        </button>
        <button className="text-gray-400 hover:text-white transition">
          <MonitorSpeaker size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-gray-400" />
          <div className="w-20 h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
            <div className="bg-white h-full w-[80%] group-hover:bg-[#39FF14]"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
