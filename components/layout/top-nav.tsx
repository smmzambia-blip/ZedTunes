"use client";

import Link from 'next/link';
import { Search, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function TopNav() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ logoBase64?: string; siteName?: string } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteSettings(docSnap.data());
        }
      } catch (e) {
        console.error("Failed to fetch settings", e);
      }
    };
    fetchSettings();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const isAdmin = user?.email === "hilzmg70@gmail.com";

  return (
    <header className="flex flex-col bg-white shadow-sm z-40 border-b border-gray-100">
      <div className="py-8 flex flex-col items-center justify-center gap-2 px-4 sm:px-8 relative">
        <Link href="/" className="text-3xl font-black tracking-tighter text-[#39FF14] bg-black px-4 py-1.5 rounded-lg shadow-xl hover:scale-105 transition-transform flex-shrink-0">
          {siteSettings?.siteName?.toUpperCase().replace('TUNES', '') || 'ZED'}<span className="text-white">{siteSettings?.siteName?.toUpperCase().includes('TUNES') ? 'TUNES' : (siteSettings?.siteName ? '' : 'TUNES')}</span>
        </Link>
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 italic tracking-widest uppercase">
          Zambia&apos;s Premier Music Excellence
        </p>

        {isAdmin && (
          <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <Link href="/wp-admin" className="text-[10px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-700 transition uppercase tracking-tighter">WP-Admin</Link>
            <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
      
      <nav className="flex items-center justify-center gap-4 sm:gap-6 text-xs font-black text-gray-500 overflow-x-auto px-4 pb-4 sm:px-8 border-t border-gray-50 pt-4 scrollbar-hide">
        <Link href="/" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Home</Link>
        <Link href="/music" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Music</Link>
        <Link href="/albums" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Albums</Link>
        <Link href="/artists" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Artists</Link>
        <Link href="/about" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">About</Link>
        <Link href="/contact" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Contact</Link>
        
        <div className="flex items-center ml-2 border-l border-gray-100 pl-4">
          {isSearchOpen && (
            <input 
              type="text" 
              placeholder="Search..." 
              className="mr-2 bg-gray-50 border border-transparent rounded-full py-1 px-3 text-[10px] text-black focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner placeholder:text-gray-400 w-24 sm:w-32"
              autoFocus
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
          )}
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-900 bg-gray-50 rounded-full hover:bg-gray-100 transition" title="Search">
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>
    </header>
  );
}
