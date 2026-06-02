"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { Hammer, Music, ChevronRight, Lock } from "lucide-react";
import Link from "next/link";

interface UnderConstructionGuardProps {
  children: React.ReactNode;
  initialUnderConstruction?: boolean;
}

export function UnderConstructionGuard({ children, initialUnderConstruction = false }: UnderConstructionGuardProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isUnderConstruction, setIsUnderConstruction] = useState(initialUnderConstruction);
  
  // High-performance loading optimization:
  // - If the site is already LIVE, there's no reason to show any loading spinner.
  // - If the site is UNDER CONSTRUCTION, only show a loading spinner if the client was previously marked as an administrator
  //   (to prevent regular visitors from seeing a loading screen at all before they get redirected).
  const [loading, setLoading] = useState(() => {
    if (!initialUnderConstruction) return false;
    if (typeof window !== "undefined") {
      const isLikelyAdmin = localStorage.getItem("zedtunes_is_admin") === "true";
      return isLikelyAdmin;
    }
    return false;
  });

  useEffect(() => {
    // 1. Subscribe to Auth changes
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (typeof window !== "undefined") {
        if (currentUser?.email === "hilzmg70@gmail.com") {
          localStorage.setItem("zedtunes_is_admin", "true");
        } else {
          localStorage.removeItem("zedtunes_is_admin");
        }
      }
      // Once auth resolves, we can safely stop loading (this applies to admins checking page permission)
      setLoading(false);
    });

    // 2. Subscribe to Site Settings (real-time so state updates instantly)
    const docRef = doc(db, "settings", "site");
    const unsubscribeDoc = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsUnderConstruction(data.underConstruction || false);
        }
        setLoading(false);
      },
      (error) => {
        console.warn("Failed to listen to settings:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeDoc();
    };
  }, []);

  const isAdmin = user?.email === "hilzmg70@gmail.com";

  // If the user is on the admin dashboard or any admin route, never block them
  const isAdminRoute = pathname?.startsWith("/wp-admin");

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-gray-400 tracking-wider uppercase">Loading site status...</p>
        </div>
      </div>
    );
  }

  // Show Under Construction Page if:
  // - site is marked as under construction
  // - we are not on an admin route
  // - the user is not authenticated as the site admin
  if (isUnderConstruction && !isAdminRoute && !isAdmin) {
    return (
      <div 
        id="under-construction-container" 
        className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4 py-12 text-center"
      >
        <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-xl flex flex-col items-center gap-6 relative overflow-hidden">
          {/* Top Decorative Sparkle Background */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-300/10 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600 ring-4 ring-yellow-500/10 animate-bounce">
            <Hammer size={32} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[10px] font-black text-yellow-800 bg-yellow-100 px-2.5 py-1 rounded-full uppercase tracking-widest">
                Site Maintenance
              </span>
            </div>
            <h1 className="font-extrabold text-3xl sm:text-4xl text-gray-900 tracking-tight">
              Under Construction
            </h1>
          </div>

          <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
            We are working behind the scenes to upgrade and refine your music downloading experience. Fresh hits and neat features are coming right up!
          </p>

          <hr className="w-full border-gray-100" />

          {/* Admin access trigger */}
          <div className="w-full space-y-3">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-extrabold flex items-center justify-center gap-1">
              <Lock size={10} /> Authorized Access Only
            </p>
            <Link 
              href="/wp-admin"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-black text-white hover:bg-gray-900 rounded-xl font-bold text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-all group"
            >
              Sign In as Admin
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          {/* Small Branding Badge */}
          <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">
            <Music size={12} className="text-black" />
            ZedTunes Music Hub
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
