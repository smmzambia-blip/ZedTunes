import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { SongCard } from '@/components/ui/song-card';
import { Layers } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  slug?: string;
  views?: string;
  imageBase64?: string;
  category?: string;
  archiveLink?: string;
}

async function getAlbums() {
  try {
    const q = query(collection(db, 'songs'), where('category', '==', 'Album'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Song));
  } catch (e) {
    console.error(e);
    return [];
  }
}

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return (
    <div className="py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">New Albums</h1>
          <p className="text-gray-500 font-medium tracking-tight">Full collections and EPs from your favorite artists</p>
        </div>
      </div>

      {albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {albums.map((album) => (
            <SongCard key={album.id} {...album} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Layers className="mx-auto text-gray-300 mb-4" size={48} />
          <h3 className="text-lg font-bold text-gray-900">No albums found</h3>
          <p className="text-gray-500">New albums are on the way!</p>
        </div>
      )}
    </div>
  );
}
