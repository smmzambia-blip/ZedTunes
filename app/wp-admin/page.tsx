/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, getDocs, orderBy, query } from 'firebase/firestore';
import { Upload, Trash2, Edit, Plus, Users, Music, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [uploadData, setUploadData] = useState({
    title: '',
    artist: '',
    archiveLink: '',
    type: 'regular',
    imageBase64: ''
  });

  const fetchSongs = async () => {
    try {
      const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const fetchedSongs: Song[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Song));
      setSongs(fetchedSongs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSongs();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'songs'), {
        ...uploadData,
        createdAt: serverTimestamp(),
        views: '0'
      });
      alert("Post published successfully!");
      setShowUploadModal(false);
      setUploadData({ title: '', artist: '', archiveLink: '', type: 'regular', imageBase64: '' });
      fetchSongs();
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error publishing post");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user || user.email !== "hilzmg70@gmail.com") {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center px-4">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Access Denied</h1>
        <p className="text-gray-600 mb-8">You do not have permission to view this page. This area is restricted to administrators only.</p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="bg-gray-100 text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">
            Return to Home
          </Link>
          {!user && (
            <button 
              onClick={async () => {
                const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
                const provider = new GoogleAuthProvider();
                signInWithPopup(auth, provider).catch(console.error);
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Log In as Admin
            </button>
          )}
        </div>
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
        <button onClick={() => setShowUploadModal(true)} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2 hover:bg-gray-50 transition text-left">
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
             <Upload size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Publish Post</h3>
           <p className="text-xs text-gray-500">Upload song or album</p>
        </button>
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
          <h2 className="font-bold text-gray-900">Recent Posts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {songs.length > 0 ? songs.map(song => (
            <div key={song.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {song.imageBase64 ? (
                  <img src={song.imageBase64} alt={song.title} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded object-cover"></div>
                )}
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
          )) : (
            <div className="px-6 py-8 text-center text-gray-500">No posts found.</div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Publish New Post</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-5">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Post Type</label>
                <select 
                  value={uploadData.type}
                  onChange={(e) => setUploadData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="regular">Regular Song</option>
                  <option value="trending">Trending Post</option>
                  <option value="album">Album</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                <input 
                  type="text" required
                  value={uploadData.title}
                  onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Song or Album Title"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Artist</label>
                <input 
                  type="text" required
                  value={uploadData.artist}
                  onChange={(e) => setUploadData(prev => ({ ...prev, artist: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Artist Name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Archive.org MP3 Link</label>
                <input 
                  type="url" required
                  value={uploadData.archiveLink}
                  onChange={(e) => setUploadData(prev => ({ ...prev, archiveLink: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="https://archive.org/download/..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image (Upload)</label>
                <div className="flex items-center gap-4">
                  {uploadData.imageBase64 ? (
                    <img src={uploadData.imageBase64} alt="Preview" className="w-16 h-16 rounded object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*"
                    onChange={handleImageUpload}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg font-bold bg-black text-white hover:bg-gray-900">Publish Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
