"use client";

import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function AdminEditButton({ id }: { id: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdmin(user?.email === "hilzmg70@gmail.com");
    });
    return () => unsubscribe();
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-30">
      <button 
        className="w-6 h-6 bg-blue-600 text-white flex items-center justify-center rounded-md hover:bg-blue-700 transition"
        title="Edit Post"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = `/wp-admin?editSongId=${id}`;
        }}
      >
        <Edit size={10} />
      </button>
    </div>
  );
}
