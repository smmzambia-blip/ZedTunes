/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, getDocs, orderBy, query, setDoc, getDoc } from 'firebase/firestore';
import { Upload, Trash2, Edit, Plus, Users, Music, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { generateSlug } from '@/lib/slug';
import { revalidateSpecificData, revalidateSettings } from '@/app/actions/revalidate';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', errInfo);
  alert(`Error during ${operationType} on ${path || 'unknown'}: ${errInfo.error}`);
}

interface Song {
  id: string;
  title: string;
  artist: string;
  views?: string;
  imageBase64?: string;
  category: string;
  description?: string;
  archiveLink?: string;
  tracks?: { title: string; url: string }[];
}

interface Artist {
  id: string;
  name: string;
  bio: string;
  imageBase64?: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showArtistModal, setShowArtistModal] = useState(false);
  const [showSiteSettingsModal, setShowSiteSettingsModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'artists' | 'albums'>('posts');
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    artist: '',
    archiveLink: '',
    category: 'Single',
    imageBase64: '',
    description: '',
    tracks: [{ title: '', url: '' }]
  });

  const [artistData, setArtistData] = useState({
    name: '',
    bio: '',
    imageBase64: ''
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: 'ZedTunes',
    siteBio: "Zambia's hottest music platform",
    logoBase64: ''
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
      handleFirestoreError(e, OperationType.LIST, 'songs');
    }
  };

  const fetchArtists = async () => {
    try {
      const q = query(collection(db, 'artists'), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const fetchedArtists: Artist[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Artist));
      setArtists(fetchedArtists);
    } catch (e) {
      handleFirestoreError(e, OperationType.LIST, 'artists');
    }
  };

  const fetchSettings = async () => {
    try {
      const docRef = doc(db, 'settings', 'site');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSiteSettings({
          siteName: data.siteName || 'ZedTunes',
          siteBio: data.siteBio || "Zambia's hottest music platform",
          logoBase64: data.logoBase64 || ''
        });
      }
    } catch (e) {
      console.warn("Failed to fetch settings, using defaults", e);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving site settings...");
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), {
        ...siteSettings,
        updatedAt: serverTimestamp()
      });
      await revalidateSettings();
      console.log("Settings saved successfully");
      alert("Site settings updated successfully!");
      setShowSiteSettingsModal(false);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'settings/site');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 200000) {
        alert("Logo is too large. Please upload an image smaller than 200KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSiteSettings(prev => ({ ...prev, logoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // We use a separate function to handle the async calls to avoid unhandled rejections
    const init = async () => {
      try {
        await Promise.all([
          fetchSongs(),
          fetchArtists(),
          fetchSettings()
        ]);

        // Handle direct edit links from public pages
        const params = new URLSearchParams(window.location.search);
        const editSongId = params.get('editSongId');
        const editArtistId = params.get('editArtistId');

        if (editSongId) {
          const q = query(collection(db, 'songs'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const song = snapshot.docs.find(d => d.id === editSongId);
          if (song) {
            handleEdit({ id: song.id, ...song.data() } as Song);
          }
        } else if (editArtistId) {
          const q = query(collection(db, 'artists'), orderBy('name', 'asc'));
          const snapshot = await getDocs(q);
          const artist = snapshot.docs.find(d => d.id === editArtistId);
          if (artist) {
            handleEditArtist({ id: artist.id, ...artist.data() } as Artist);
          }
        }
      } catch (e) {
        console.error("Initialization failed", e);
      }
    };

    init();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("Image is too large. Please upload an image smaller than 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadData(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArtistImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("Image is too large. Please upload an image smaller than 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setArtistData(prev => ({ ...prev, imageBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Publishing/Updating post...");
    setIsSaving(true);
    try {
      const slug = generateSlug(uploadData.title);
      const dataToSave = {
        ...uploadData,
        slug,
        // If not an album, we might not need tracks, but keeping it clean:
        tracks: uploadData.category === 'Album' ? uploadData.tracks : []
      };

      if (editingId) {
        console.log("Updating document: ", editingId);
        await updateDoc(doc(db, 'songs', editingId), {
          ...dataToSave,
          updatedAt: serverTimestamp()
        });
        await revalidateSpecificData(dataToSave.category === 'Album' ? 'album' : 'song', dataToSave.slug);
        alert("Post updated successfully!");
      } else {
        console.log("Adding new document to 'songs'");
        await addDoc(collection(db, 'songs'), {
          ...dataToSave,
          createdAt: serverTimestamp()
        });
        await revalidateSpecificData(dataToSave.category === 'Album' ? 'album' : 'song', dataToSave.slug);
        alert("Post published successfully!");
      }
      setShowUploadModal(false);
      setEditingId(null);
      setUploadData({ 
        title: '', 
        artist: '', 
        archiveLink: '', 
        category: 'Single', 
        imageBase64: '', 
        description: '',
        tracks: [{ title: '', url: '' }]
      });
      fetchSongs();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'songs');
    } finally {
      setIsSaving(false);
    }
  };

  const handleArtistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const slug = generateSlug(artistData.name);
      if (editingArtistId) {
        await updateDoc(doc(db, 'artists', editingArtistId), {
          ...artistData,
          slug
        });
        await revalidateSpecificData('artist', slug);
        alert("Artist updated successfully!");
      } else {
        await addDoc(collection(db, 'artists'), {
          ...artistData,
          slug,
          createdAt: serverTimestamp()
        });
        await revalidateSpecificData('artist', slug);
        alert("Artist added successfully!");
      }
      setShowArtistModal(false);
      setEditingArtistId(null);
      setArtistData({ name: '', bio: '', imageBase64: '' });
      fetchArtists();
    } catch (error) {
      handleFirestoreError(error, editingArtistId ? OperationType.UPDATE : OperationType.CREATE, 'artists');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (song: Song) => {
    setUploadData({
      title: song.title || '',
      artist: song.artist || '',
      archiveLink: song.archiveLink || '',
      category: song.category || 'Single',
      imageBase64: song.imageBase64 || '',
      description: song.description || '',
      tracks: song.tracks || [{ title: '', url: '' }]
    });
    setEditingId(song.id);
    setShowUploadModal(true);
  };

  const handleEditArtist = (artist: Artist) => {
    setArtistData({
      name: artist.name || '',
      bio: artist.bio || '',
      imageBase64: artist.imageBase64 || ''
    });
    setEditingArtistId(artist.id);
    setShowArtistModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this track?")) {
      try {
        await deleteDoc(doc(db, 'songs', id));
        await revalidateSpecificData('song');
        fetchSongs();
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `songs/${id}`);
      }
    }
  };

  const handleDeleteArtist = async (id: string) => {
    if (confirm("Are you sure you want to delete this artist?")) {
      try {
        await deleteDoc(doc(db, 'artists', id));
        await revalidateSpecificData('artist');
        fetchArtists();
      } catch (e) {
        handleFirestoreError(e, OperationType.DELETE, `artists/${id}`);
      }
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
          <Link href="/" className="bg-gray-100 text-black px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-200 transition flex items-center gap-2">
            View Site
          </Link>
          <button 
            onClick={() => setShowSiteSettingsModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Edit size={16} /> Edit Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <button 
          onClick={() => {
            setEditingId(null);
            setUploadData({ title: '', artist: '', archiveLink: '', category: 'Single', imageBase64: '', description: '', tracks: [{ title: '', url: '' }] });
            setActiveTab('posts');
            setShowUploadModal(true);
          }} 
          className={`bg-white p-6 rounded-xl border ${activeTab === 'posts' && uploadData.category === 'Single' ? 'border-black ring-1 ring-black' : 'border-gray-200'} shadow-sm flex flex-col gap-2 hover:bg-gray-50 transition text-left`}
        >
           <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
             <Upload size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Publish Post</h3>
           <p className="text-xs text-gray-500">Upload song or album</p>
        </button>
        <button 
          onClick={() => {
            setEditingId(null);
            setUploadData({ title: '', artist: '', archiveLink: '', category: 'Album', imageBase64: '', description: '', tracks: [{ title: '', url: '' }] });
            setActiveTab('posts');
            setShowUploadModal(true);
          }}
          className={`bg-white p-6 rounded-xl border ${activeTab === 'posts' && uploadData.category === 'Album' ? 'border-black ring-1 ring-black' : 'border-gray-200'} shadow-sm flex flex-col gap-2 hover:bg-gray-50 transition text-left`}
        >
           <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
             <Plus size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Add Album</h3>
           <p className="text-xs text-gray-500">Create a new album collection</p>
        </button>
        <button 
          onClick={() => {
            setEditingArtistId(null);
            setArtistData({ name: '', bio: '', imageBase64: '' });
            setActiveTab('artists');
            setShowArtistModal(true);
          }}
          className={`bg-white p-6 rounded-xl border ${activeTab === 'artists' ? 'border-black ring-1 ring-black' : 'border-gray-200'} shadow-sm flex flex-col gap-2 hover:bg-gray-50 transition text-left`}
        >
           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-2">
             <Users size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Manage Artists</h3>
           <p className="text-xs text-gray-500">Add or edit artist profiles</p>
        </button>
        <button 
          onClick={() => setActiveTab('posts')}
          className={`bg-white p-6 rounded-xl border ${activeTab === 'posts' ? 'border-black ring-1 ring-black' : 'border-gray-200'} shadow-sm flex flex-col gap-2 hover:bg-gray-50 transition text-left`}
        >
           <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-2">
             <Music size={20} />
           </div>
           <h3 className="font-bold text-gray-900">Manage Songs</h3>
           <p className="text-xs text-gray-500">Edit or delete existing tracks</p>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-900">{activeTab === 'artists' ? 'Artists' : 'Recent Posts'}</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activeTab === 'artists' ? (
            artists.length > 0 ? artists.map(artist => (
              <div key={artist.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {artist.imageBase64 ? (
                    <img src={artist.imageBase64} alt={artist.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full object-cover flex items-center justify-center">
                      <Users size={16} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-sm text-gray-900">{artist.name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 max-w-md">{artist.bio || 'No bio provided'}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditArtist(artist)} className="p-2 text-gray-400 hover:text-blue-600 transition" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteArtist(artist.id)} className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="px-6 py-8 text-center text-gray-500">No artists found.</div>
            )
          ) : songs.length > 0 ? songs.map(song => (
            <div key={song.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 flex-wrap gap-4">
              <div className="flex items-center gap-4">
                {song.imageBase64 ? (
                  <img src={song.imageBase64} alt={song.title} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded object-cover"></div>
                )}
                <div>
                  <div className="font-bold text-sm text-gray-900">{song.title}</div>
                  <div className="text-xs text-gray-500">{song.artist} • {song.category}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(song)} className="p-2 text-gray-400 hover:text-blue-600 transition" title="Edit">
                  <Edit size={16} />
                </button>
                <button onClick={() => handleDelete(song.id)} className="p-2 text-gray-400 hover:text-red-600 transition" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          )) : (
            <div className="px-6 py-8 text-center text-gray-500">No posts found.</div>
          )}
        </div>
      </div>

      {/* Site Settings Modal */}
      {showSiteSettingsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">Edit Site Settings</h2>
              <button onClick={() => setShowSiteSettingsModal(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveSettings} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Site Name</label>
                <input 
                  type="text" required
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, siteName: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Site Description</label>
                <textarea 
                  rows={3}
                  value={siteSettings.siteBio}
                  onChange={(e) => setSiteSettings(prev => ({ ...prev, siteBio: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Site Logo / Favicon</label>
                <div className="flex items-center gap-4">
                  {siteSettings.logoBase64 ? (
                    <img src={siteSettings.logoBase64} alt="Logo Preview" className="w-12 h-12 rounded object-contain border border-gray-200" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">This will be used as the site logo and favicon. Square icons work best.</p>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowSiteSettingsModal(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="px-5 py-2.5 rounded-lg font-bold bg-black text-white hover:bg-gray-900">Save Settings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Artist Modal */}
      {showArtistModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold">{editingArtistId ? 'Edit Artist' : 'Add Artist'}</h2>
              <button onClick={() => setShowArtistModal(false)} className="text-gray-400 hover:text-black">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleArtistSubmit} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Artist Name</label>
                <input 
                  type="text" required
                  value={artistData.name}
                  onChange={(e) => setArtistData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Artist Display Name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
                <textarea 
                  rows={3}
                  value={artistData.bio}
                  onChange={(e) => setArtistData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Quick bio about the artist..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Artist Photo</label>
                <div className="flex items-center gap-4">
                  {artistData.imageBase64 ? (
                    <img src={artistData.imageBase64} alt="Preview" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <input 
                    type="file" accept="image/*"
                    onChange={handleArtistImageUpload}
                    className="flex-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" disabled={isSaving} onClick={() => setShowArtistModal(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-lg font-bold bg-black text-white hover:bg-gray-900 disabled:opacity-50">
                  {isSaving ? 'Saving...' : (editingArtistId ? 'Update Artist' : 'Save Artist')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <form onSubmit={handleUploadSubmit} className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                <select 
                  value={uploadData.category}
                  onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="Single">Single</option>
                  <option value="Album">Album</option>
                  <option value="Gospel">Gospel</option>
                  <option value="Hip Hop">Hip Hop</option>
                  <option value="Zambian">Zambian</option>
                  <option value="RnB">RnB</option>
                  <option value="Dancehall">Dancehall</option>
                  <option value="Afrobeat">Afrobeat</option>
                  <option value="Kalindula">Kalindula</option>
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
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3}
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="Tell us about this post..."
                />
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-bold text-gray-700 mb-3">Cover Image (Upload)</label>
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

              {uploadData.category === 'Album' && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-bold text-gray-700">Album Tracks</label>
                    <button 
                      type="button"
                      onClick={() => {
                        if (uploadData.tracks.length < 20) {
                          setUploadData(prev => ({
                            ...prev,
                            tracks: [...prev.tracks, { title: '', url: '' }]
                          }));
                        }
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Track
                    </button>
                  </div>
                  <div className="space-y-3">
                    {uploadData.tracks.map((track, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-gray-400">Track {idx + 1}</span>
                          {uploadData.tracks.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => {
                                setUploadData(prev => ({
                                  ...prev,
                                  tracks: prev.tracks.filter((_, i) => i !== idx)
                                }));
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                        <input 
                          type="text" required
                          value={track.title}
                          onChange={(e) => {
                            const newTracks = [...uploadData.tracks];
                            newTracks[idx].title = e.target.value;
                            setUploadData(prev => ({ ...prev, tracks: newTracks }));
                          }}
                          className="w-full text-xs border border-gray-300 rounded p-2 outline-none focus:border-black"
                          placeholder="Track Title (e.g. 01. Song Name)"
                        />
                        <input 
                          type="url" required
                          value={track.url}
                          onChange={(e) => {
                            const newTracks = [...uploadData.tracks];
                            newTracks[idx].url = e.target.value;
                            setUploadData(prev => ({ ...prev, tracks: newTracks }));
                          }}
                          className="w-full text-xs border border-gray-300 rounded p-2 outline-none focus:border-black"
                          placeholder="Archive.org MP3 URL"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadData.category !== 'Album' && (
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
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" disabled={isSaving} onClick={() => setShowUploadModal(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSaving} className="px-5 py-2.5 rounded-lg font-bold bg-black text-white hover:bg-gray-900 disabled:opacity-50">
                  {isSaving ? 'Saving...' : (editingId ? 'Update Post' : 'Publish Post')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
