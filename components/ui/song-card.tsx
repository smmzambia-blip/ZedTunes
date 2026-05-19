import React from 'react';
import Link from 'next/link';

import { Music, Calendar } from 'lucide-react';
import Image from 'next/image';
import { generateSlug } from '@/lib/slug';
import { AdminEditButton } from '@/components/ui/admin-edit-button';
import { ClientDownloadButton } from '@/components/ui/client-download-button';

import { Timestamp } from 'firebase/firestore';

interface SongCardProps {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  views?: string;
  imageBase64?: string;
  category?: string;
  createdAt?: Timestamp | string | null;
  archiveLink?: string;
}

export function SongCard({ id, title, artist, slug, imageBase64, category, createdAt, archiveLink }: SongCardProps) {
  const finalSlug = slug || generateSlug(title);
  const prefix = category === 'Album' ? 'album' : 'song';
  const href = `/${prefix}/${finalSlug}`;

  const formatDate = (date: Timestamp | string | null | undefined) => {
    if (!date) return '';
    let d: Date;
    if (typeof date === 'string') {
      d = new Date(date);
    } else if (date && typeof date === 'object' && 'toDate' in date) {
      d = (date as unknown as Timestamp).toDate();
    } else {
      d = new Date();
    }
    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      timeZone: 'UTC'
    });
  };

  return (
    <Link href={href} className="flex flex-col gap-2 group cursor-pointer min-w-0 relative">
      <div className="aspect-square bg-gray-100 rounded-2xl border border-gray-100 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-20">
          <div className="w-8 h-8 bg-[#39FF14] rounded-full flex items-center justify-center text-black font-black text-[8px] pl-[1px] transition hover:scale-105 shadow-xl">
            ▶
          </div>
        </div>
        
        {category === 'Album' && (
          <div className="absolute top-1.5 left-1.5 z-30">
            <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm shadow-lg">ALBUM</span>
          </div>
        )}

        <AdminEditButton id={id} />

        <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <ClientDownloadButton archiveLink={archiveLink} title={title} artist={artist} href={href} />
        </div>
        
        {imageBase64 ? (
          <div className="h-full w-full relative overflow-hidden">
            <Image 
              src={imageBase64} 
              alt={title} 
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
              className="object-cover transition duration-700 group-hover:scale-110" 
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 z-0 flex items-center justify-center text-gray-300">
             <Music size={20} />
          </div>
        )}
      </div>
      <div className="min-w-0 px-0.5">
        <div className="font-bold text-[11px] leading-tight truncate text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</div>
        <div className="flex flex-col mt-0.5">
          <div className="text-[9px] text-gray-500 font-bold truncate opacity-80 uppercase tracking-tighter">{artist}</div>
          {createdAt && (
            <div className="text-[7px] text-gray-400 font-medium flex items-center gap-1 mt-0.5 uppercase tracking-tighter">
              <Calendar size={8} /> {formatDate(createdAt)}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
