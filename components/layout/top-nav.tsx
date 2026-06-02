"use client";

import Link from 'next/link';
import { Search, LogOut, Menu, X, Music } from 'lucide-react';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export function TopNav({ initialSettings }: { initialSettings?: { siteName?: string; logoBase64?: string; siteBio?: string } | null }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<{ logoBase64?: string; siteName?: string; siteBio?: string } | null>(initialSettings || null);

  useEffect(() => {
    // If we have settings, update document title
    if (siteSettings?.siteName) {
      document.title = siteSettings.siteName;
    }

    if (!initialSettings) {
      const fetchSettings = async () => {
        try {
          const docRef = doc(db, 'settings', 'site');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setSiteSettings(data);
            if (data.siteName) document.title = data.siteName;
          }
        } catch (e) {
          console.error("Failed to fetch settings", e);
        }
      };
      fetchSettings();
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [initialSettings, siteSettings?.siteName]);

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
    <header className="flex flex-col bg-white shadow-sm z-50 border-b border-gray-100">
      <div className="py-4 sm:py-8 grid grid-cols-3 items-center px-4 sm:px-8 relative bg-white">
        <div className="flex justify-start">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="sm:hidden p-2 -ml-2 text-gray-500"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2.5 group transition-transform duration-300">
            {/* Logo Icon Container */}
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-black border border-zinc-800 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
              {siteSettings?.logoBase64 ? (
                <img 
                  src={siteSettings.logoBase64} 
                  alt={siteSettings?.siteName || "Logo"} 
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-br from-black via-zinc-900 to-black text-[#39FF14]">
                  {/* Subtle pulsing/glowing background gradient */}
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#39FF14_10%,_transparent_60%)] opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                  <Music size={18} className="sm:w-5 sm:h-5 relative z-10 text-[#39FF14]" strokeWidth={2.5} />
                </div>
              )}
            </div>

            {/* Logo Text Info */}
            <div id="brand-identity" className="flex flex-col justify-center select-none text-left">
              <div className="flex items-center gap-1 leading-none sm:mb-0.5">
                {(() => {
                  const rawName = siteSettings?.siteName || "ZedTunes";
                  const regex = /tunes/i;
                  const match = rawName.match(regex);
                  
                  if (match && match.index !== undefined) {
                    const firstPart = rawName.substring(0, match.index);
                    const secondPart = rawName.substring(match.index);
                    return (
                      <>
                        <span className="text-base sm:text-2xl font-black tracking-tight text-black group-hover:text-gray-800 transition-colors uppercase">
                          {firstPart}
                        </span>
                        <span className="text-base sm:text-2xl font-light tracking-wide text-gray-500 uppercase">
                          {secondPart}
                        </span>
                      </>
                    );
                  }
                  
                  return (
                    <span className="text-base sm:text-2xl font-black tracking-tight text-black group-hover:text-gray-800 transition-colors uppercase">
                      {rawName}
                    </span>
                  );
                })()}

                {/* Pulsing Active indicator */}
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14] animate-pulse flex-shrink-0" />
              </div>
              
              {/* Zambian Music Hub Subtitle Label */}
              <span className="text-[7px] sm:text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] -mt-0.5 block">
                ZAMBIAN MUSIC HUB
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center justify-end gap-2 sm:gap-4">
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
            {siteSettings?.siteBio || "Download Zed Latest Music"}
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
