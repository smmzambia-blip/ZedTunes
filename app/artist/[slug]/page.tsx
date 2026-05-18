import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Metadata } from "next";
import ArtistClient from "./ArtistClient";

interface PageProps {
  params: { slug: string };
}

async function getArtistData(slug: string) {
  try {
    // Fetch all songs by this artist using slug
    const q = query(collection(db, "songs"), where("artist", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return { artist: null, songs: [] };

    const songs = snapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title || "",
      artist: doc.data().artist || "",
      slug: doc.data().slug,
      imageBase64: doc.data().imageBase64,
      category: doc.data().category,
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt
    }));

    return {
      artist: {
        id: songs[0]?.id || slug,
        name: songs[0]?.artist || slug,
        slug: slug,
        songCount: songs.length,
        bio: ""
      },
      songs
    };
  } catch (error) {
    console.error("Error fetching artist data:", error);
    return { artist: null, songs: [] };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { artist, songs } = await getArtistData(params.slug);
  if (!artist) return { title: "Artist Not Found" };

  return {
    title: `${artist.name} - ${songs.length} songs | ZedTunez`,
    description: `Listen and download music from ${artist.name} on ZedTunez. Zambian music excellence.`,
    openGraph: {
      title: `${artist.name}`,
      description: `${songs.length} songs available`,
    },
  };
}

export default async function ArtistPage({ params }: PageProps) {
  const { artist, songs } = await getArtistData(params.slug);

  if (!artist) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Artist not found</h1>
        <p className="text-gray-500 mt-2">The artist you are looking for does not exist.</p>
        <div className="mt-8">
          <a href="/" className="text-blue-600 font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  return <ArtistClient artist={artist} songs={songs} />;
}
