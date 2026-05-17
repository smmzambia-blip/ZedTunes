"use client";

import Link from 'next/link';
import { Search, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';

export function TopNav() {
  const [user, setUser] = useState<FirebaseUser | null>(null);

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

  return (
    <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/40 z-40">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-black tracking-tighter text-[#39FF14]">ZEDTUNES</div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          <Link href="/music" className="text-white">Music</Link>
          <Link href="/trending" className="hover:text-[#39FF14]">Trending</Link>
          <Link href="/albums" className="hover:text-[#39FF14]">Albums</Link>
          <Link href="/artists" className="hover:text-[#39FF14]">Artists</Link>
        </nav>
      </div>
      <div className="flex-1 max-w-md mx-8 hidden sm:block">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for songs, artists..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-4 text-sm text-white focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-gray-500"
          />
          <Search className="absolute right-4 top-2.5 text-gray-400 w-4 h-4 opacity-40" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-xs text-gray-400 hidden sm:block">{user.email}</span>
            <button onClick={handleLogout} className="text-sm font-semibold hover:text-white text-gray-400 flex items-center gap-2">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="text-sm font-semibold hover:text-[#39FF14] text-gray-300">Login</button>
        )}
        <button className="bg-[#39FF14] text-black px-6 py-2 rounded-full text-sm font-bold">
          Get Premium
        </button>
      </div>
    </header>
  );
}
