"use client";

import { Play, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, Mic2, MonitorSpeaker, Download } from 'lucide-react';

export function MusicPlayer() {
  return (
    <footer className="h-24 bg-white border-t border-gray-200 px-4 sm:px-8 flex items-center justify-between z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4 w-72 min-w-0">
        <div className="w-14 h-14 bg-gray-200 rounded-lg flex-shrink-0 border border-gray-300"></div>
        <div className="overflow-hidden hidden sm:block">
          <div className="text-sm font-bold text-gray-900 truncate">Tuleya Kuli Lesa</div>
          <div className="text-xs text-gray-500 truncate mt-0.5">Chef 187 • Bon Appetit</div>
        </div>
        <div className="items-center gap-3 hidden sm:flex">
          <button className="text-gray-400 hover:text-black transition" title="Save to Library">
            <Heart size={16} />
          </button>
          <button className="text-gray-400 hover:text-black transition" title="Download MP3">
            <Download size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 max-w-xl w-full">
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-black transition hidden sm:block">
            <Shuffle size={18} />
          </button>
          <button className="text-gray-600 hover:text-black transition">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-black hover:scale-105 transition shadow-md">
            <Play size={16} fill="currentColor" className="ml-1" />
          </button>
          <button className="text-gray-600 hover:text-black transition">
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-gray-400 hover:text-black transition hidden sm:block">
            <Repeat size={18} />
          </button>
        </div>
        
        <div className="flex items-center gap-3 w-full max-w-md hidden sm:flex">
          <span className="text-[10px] text-gray-500 font-medium">1:24</span>
          <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer group">
            <div className="bg-black h-full w-[45%] group-hover:bg-[#39FF14] relative transition-colors">
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-black rounded-full opacity-0 group-hover:opacity-100"></div>
            </div>
          </div>
          <span className="text-[10px] text-gray-500 font-medium">3:45</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 w-72 hidden md:flex">
        <button className="text-gray-400 hover:text-black transition">
          <Mic2 size={16} />
        </button>
        <button className="text-gray-400 hover:text-black transition">
          <MonitorSpeaker size={16} />
        </button>
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-gray-600" />
          <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden cursor-pointer group">
            <div className="bg-gray-600 h-full w-[80%] group-hover:bg-black transition-colors"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
