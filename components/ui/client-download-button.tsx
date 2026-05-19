"use client";

import React from 'react';
import { Download } from 'lucide-react';
import { downloadFile } from '@/lib/download';

export function ClientDownloadButton({ 
  archiveLink, title, artist, href 
}: { 
  archiveLink?: string; title: string; artist: string; href: string;
}) {
  return (
    <button 
      className="w-6 h-6 bg-white/20 backdrop-blur text-white flex items-center justify-center rounded-full hover:bg-white/40 hover:scale-105 transition-all"
      title="Download"
      onClick={(e) => {
        e.preventDefault();
        if (archiveLink) {
          downloadFile(archiveLink, `${title} - ${artist}.mp3`);
        } else {
          window.location.href = href;
        }
      }}
    >
      <Download size={10} />
    </button>
  );
}
