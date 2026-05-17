"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Search, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
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

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

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
      <div className="pt-6 pb-2 flex flex-col items-center justify-center gap-2 px-4 sm:px-8 relative">
        {siteSettings?.logoBase64 && (
          <div className="w-16 h-16 mb-2 relative">
             <Image 
               src={siteSettings.logoBase64} 
               alt="Site Logo" 
               fill
               className="object-contain" 
               referrerPolicy="no-referrer"
             />
          </div>
        )}
        <Link href="/" className="text-3xl font-black tracking-tighter text-[#39FF14] bg-black px-4 py-1.5 rounded-lg shadow-xl hover:scale-105 transition-transform flex-shrink-0">
          {siteSettings?.siteName?.toUpperCase().replace('TUNES', '') || 'ZED'}<span className="text-white">{siteSettings?.siteName?.toUpperCase().includes('TUNES') ? 'TUNES' : (siteSettings?.siteName ? '' : 'TUNES')}</span>
        </Link>
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 italic tracking-widest uppercase">
          Zambia&apos;s Premier Music Excellence
        </p>

        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex items-center gap-3">
          <div className="flex items-center">
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="mr-2 bg-gray-100 border border-transparent rounded-full py-2 px-4 text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner placeholder:text-gray-400 w-24 sm:w-48"
                autoFocus
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            )}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {isAdmin ? (
            <div className="flex items-center gap-3">
              <Link href="/wp-admin" className="text-[10px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-700 transition uppercase tracking-tighter">WP-Admin</Link>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="text-[10px] font-black text-gray-400 border border-gray-200 px-3 py-1.5 rounded-full hover:bg-gray-50 transition uppercase tracking-tighter">
              Login
            </button>
          )}
        </div>
      </div>
      
      <nav className="flex items-center justify-center gap-6 text-xs font-black text-gray-500 overflow-x-auto px-4 pb-4 sm:px-8 border-t border-gray-50 pt-4 scrollbar-hide">
        <Link href="/" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Home</Link>
        <Link href="/music" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Music</Link>
        <Link href="/albums" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Albums</Link>
        <Link href="/artists" className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2 py-1">Artists</Link>
      </nav>
    </header>
  );
}
