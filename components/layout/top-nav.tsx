"use client";

import Link from 'next/link';
import { Search, LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function TopNav() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Music', href: '/music' },
    { name: 'Albums', href: '/albums' },
    { name: 'Artists', href: '/artists' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="flex flex-col bg-white shadow-sm z-50 border-b border-gray-100 sticky top-0">
      <div className="py-4 sm:py-8 flex items-center justify-between px-4 sm:px-8 relative bg-white">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="sm:hidden p-2 text-gray-500"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="text-xl sm:text-3xl font-black tracking-tighter text-[#39FF14] bg-black px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg shadow-xl hover:scale-105 transition-transform">
          {siteSettings?.siteName?.toUpperCase().replace('TUNES', '') || 'ZED'}<span className="text-white">{siteSettings?.siteName?.toUpperCase().includes('TUNES') ? 'TUNES' : (siteSettings?.siteName ? '' : 'TUNES')}</span>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-4">
          {isAdmin && (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/wp-admin" className="text-[10px] font-black text-white bg-blue-600 px-3 py-1.5 rounded-full hover:bg-blue-700 transition uppercase tracking-tighter">WP-Admin</Link>
              <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600 transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-2 flex justify-center hidden sm:block">
         <p className="text-[10px] sm:text-xs font-bold text-gray-400 italic tracking-widest uppercase text-center">
            Zambia&apos;s Premier Music Excellence
          </p>
      </div>
      
      {/* Search Bar - Expandable */}
      {isSearchOpen && (
        <div className="px-4 py-3 bg-gray-50 border-t border-b border-gray-100 flex justify-center sticky top-[73px] sm:top-[124px] z-40">
           <input 
              type="text" 
              placeholder="Search for music, artists, or albums..." 
              className="w-full max-w-2xl bg-white border border-gray-200 rounded-full py-2 px-6 text-sm text-black focus:outline-none focus:border-black transition-all shadow-sm"
              autoFocus
            />
        </div>
      )}

      {/* Desktop Nav */}
      <nav className="hidden sm:flex items-center justify-center gap-6 text-xs font-black text-gray-500 px-8 py-4 border-t border-gray-50">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-black transition-colors uppercase tracking-widest whitespace-nowrap px-2">
            {link.name}
          </Link>
        ))}
        <div className="flex items-center ml-2 border-l border-gray-100 pl-4">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 text-gray-400 hover:text-black transition" title="Search">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      {isMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-[61px] bg-white z-50 animate-in slide-in-from-left duration-300">
          <div className="flex flex-col p-6 gap-6">
            <button 
              onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); }}
              className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter text-gray-900 border-b border-gray-100 pb-2"
            >
              <Search size={24} /> Search
            </button>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-black uppercase tracking-tighter text-gray-900 border-b border-gray-100 pb-2"
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link 
                href="/wp-admin" 
                onClick={() => setIsMenuOpen(false)}
                className="text-2xl font-black uppercase tracking-tighter text-blue-600"
              >
                WP-Admin
              </Link>
            )}
            {isAdmin && (
               <button 
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="text-2xl font-black uppercase tracking-tighter text-red-500 text-left"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
