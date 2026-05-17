"use client";

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { Upload, Trash2, Edit, Plus, Users, Music } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user || user.email !== "hilzmg70@gmail.com") {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600 mb-8">You do not have permission to view this page. This area is restricted to administrators only.</p>
        <Link href="/" className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Admin ({user.email})</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition flex items-center gap-2">
            <Edit size={16} /> Edit Site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
             <Upload size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Upload Song</h3>
           <p className="text-xs text-gray-500">Add new tracks to the platform</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
             <Plus size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Add Album</h3>
           <p className="text-xs text-gray-500">Create a new album collection</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
             <Users size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Manage Artists</h3>
           <p className="text-xs text-gray-500">Add or edit artist profiles</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2">
           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-2">
             <Music size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Manage Songs</h3>
           <p className="text-xs text-gray-500">Edit or delete existing tracks</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">Recent Songs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { id: 1, title: "Tuleya Kuli Lesa", artist: "Chef 187" },
            { id: 2, title: "Aweah", artist: "Yo Maps" },
            { id: 3, title: "Superman", artist: "Yo Maps" },
          ].map(song => (
            <div key={song.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded object-cover"></div>
                <div>
                  <div className="font-bold text-sm text-gray-900">{song.title}</div>
                  <div className="text-xs text-gray-500">{song.artist}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition" title="Edit">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
