"use client";

import Link from 'next/link';
import { Search, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export function TopNav() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
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
      <div className="h-16 flex items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-[#39FF14] bg-black px-3 py-1 rounded-md shadow-md hover:scale-105 transition-transform flex-shrink-0">
            ZED<span className="text-white">TUNES</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="Search..." 
                className="mr-2 bg-gray-100 border border-transparent rounded-full py-2 px-4 text-sm text-black focus:outline-none focus:border-black focus:bg-white transition-all shadow-inner placeholder:text-gray-400 w-32 sm:w-64"
                autoFocus
                onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
              />
            )}
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-900 bg-gray-100 rounded-full hover:bg-gray-200 transition">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {isAdmin ? (
            <>
              <Link href="/wp-admin" className="text-sm font-bold text-white bg-blue-600 px-4 py-2 rounded-full hover:bg-blue-700 transition">WP-Admin</Link>
              <button onClick={handleLogout} className="text-sm font-bold hover:text-black text-gray-500 flex items-center gap-2 transition-colors">
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <button onClick={handleLogin} className="text-sm font-bold text-black border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-50 transition">
              Admin Login
            </button>
          )}
        </div>
      </div>
      <nav className="flex md:absolute md:left-1/2 md:-translate-x-1/2 md:top-5 gap-6 text-sm font-bold text-gray-600 overflow-x-auto px-4 pb-3 sm:px-8 md:px-0 md:pb-0 scrollbar-hide">
        <Link href="/" className="hover:text-black transition-colors uppercase tracking-wide whitespace-nowrap">Home</Link>
        <Link href="/music" className="hover:text-black transition-colors uppercase tracking-wide whitespace-nowrap">Music</Link>
        <Link href="/trending" className="hover:text-black transition-colors uppercase tracking-wide whitespace-nowrap">Trending</Link>
        <Link href="/albums" className="hover:text-black transition-colors uppercase tracking-wide whitespace-nowrap">Albums</Link>
        <Link href="/artists" className="hover:text-black transition-colors uppercase tracking-wide whitespace-nowrap">Artists</Link>
      </nav>
    </header>
  );
}
