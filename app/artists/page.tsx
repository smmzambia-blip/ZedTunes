"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import Image from 'next/image';
import { Users, Edit } from 'lucide-react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Link from 'next/link';
import { generateSlug } from '@/lib/slug';

interface Artist {
  id: string;
  name: string;
  bio: string;
  slug?: string;
  imageBase64?: string;
}

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const getArtistHref = (artist: Artist) => {
    const slug = artist.slug || generateSlug(artist.name);
    return `/artist/${slug}`;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const fetchArtists = async () => {
      try {
        const q = query(collection(db, 'artists'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const fetchedArtists: Artist[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Artist));
        setArtists(fetchedArtists);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchArtists();

    return () => unsubscribe();
  }, []);

  const isAdmin = user?.email === "hilzmg70@gmail.com";

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
          <Users size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Artists</h1>
          <p className="text-gray-500">The voices behind Zambian music</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-32 h-32 rounded-full bg-gray-100"></div>
              <div className="h-4 w-20 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="relative group">
              {isAdmin && (
                <Link 
                  href={`/wp-admin?editArtistId=${artist.id}`}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-lg hover:bg-blue-700"
                  title="Edit Artist"
                >
                  <Edit size={14} />
                </Link>
              )}
              <Link href={getArtistHref(artist)} className="flex flex-col items-center cursor-pointer">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300 bg-white">
                  {artist.imageBase64 ? (
                    <Image 
                      src={artist.imageBase64} 
                      alt={artist.name} 
                      fill
                      sizes="128px"
                      className="object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Users size={40} />
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors text-center">{artist.name}</h3>
                <p className="text-xs text-gray-500 line-clamp-1 text-center">{artist.bio || 'Artist'}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Users className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No artists to show</h3>
          <p className="text-gray-500">We&apos;re profiling more artists soon!</p>
        </div>
      )}
    </div>
  );
}
