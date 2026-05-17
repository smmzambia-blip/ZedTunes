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
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-gray-200 bg-white z-40">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-black tracking-tighter text-[#39FF14] mix-blend-difference drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">
          ZEDTUNES
        </Link>
        <nav className="flex gap-4 sm:gap-6 text-sm font-medium text-gray-700">
          <Link href="/music" className="hover:text-black">Music</Link>
          <Link href="/trending" className="hover:text-black">Trending</Link>
          <Link href="/albums" className="hover:text-black">Albums</Link>
          <Link href="/artists" className="hover:text-black">Artists</Link>
        </nav>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {isSearchOpen && (
            <input 
              type="text" 
              placeholder="Search..." 
              className="mr-2 bg-gray-100 border border-gray-300 rounded-full py-1.5 px-4 text-sm text-black focus:outline-none focus:border-[#39FF14] transition-colors placeholder:text-gray-500 w-32 sm:w-48"
              autoFocus
              onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
            />
          )}
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-600 hover:text-black transition">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {isAdmin ? (
          <>
            <Link href="/admin" className="text-sm font-semibold text-blue-600 hover:text-blue-800">Admin</Link>
            <button onClick={handleLogout} className="text-sm font-semibold hover:text-black text-gray-600 flex items-center gap-2">
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        ) : (
          <button onClick={handleLogin} className="text-sm font-semibold text-gray-600 hover:text-black transition flex items-center gap-1 opacity-0 w-0 h-0 overflow-hidden" tabIndex={-1} aria-hidden="true" title="Hidden Login">
            Login
          </button>
        )}
      </div>
    </header>
  );
}
