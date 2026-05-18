import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Metadata } from "next";
import { generateSlug } from "@/lib/slug";
import { permanentRedirect } from "next/navigation";
import ArtistClient, { Artist as ArtistType, Song as SongType } from "./ArtistClient";

interface PageProps {
  params: { slug: string };
}

import { unstable_cache } from 'next/cache';

export const revalidate = 3600;

const getArtistData = unstable_cache(
  async (slug: string) => {
    try {
      // 1. Try fetching by slug
      const qArtist = query(collection(db, "artists"), where("slug", "==", slug));
      const slugSnap = await getDocs(qArtist);

      if (!slugSnap.empty) {
        const docData = slugSnap.docs[0];
        const data = docData.data();
        const artistData: ArtistType = {
          id: docData.id,
          name: data.name || "",
          bio: data.bio || "",
          slug: data.slug,
          imageBase64: data.imageBase64
        };
        
        // Fetch songs for this artist
        const qSongs = query(
          collection(db, 'songs'), 
          where('artist', '==', artistData.name),
          orderBy('createdAt', 'desc')
        );
        const songsSnapshot = await getDocs(qSongs);
        const fetchedSongs: SongType[] = songsSnapshot.docs.map(doc => {
          const sdata = doc.data();
          return {
            id: doc.id,
            title: sdata.title || "",
            artist: sdata.artist || "",
            category: sdata.category,
            slug: sdata.slug,
            imageBase64: sdata.imageBase64,
            archiveLink: sdata.archiveLink,
            createdAt: sdata.createdAt?.toDate ? sdata.createdAt.toDate().toISOString() : (sdata.createdAt || null)
          };
        });

        return { artist: artistData, songs: fetchedSongs, needsRedirect: null };
      }

      // 2. Fallback to ID
      const docRef = doc(db, 'artists', slug);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        let actualSlug = data.slug;
        if (!actualSlug) {
          actualSlug = generateSlug(data.name);
          // Pure-ish function
        }
        return { artist: null, songs: [], needsRedirect: `/artist/${actualSlug}` };
      }

      return { artist: null, songs: [], needsRedirect: null };
    } catch (error) {
      console.error("Error fetching artist data:", error);
      return { artist: null, songs: [], needsRedirect: null };
    }
  },
  ['artist-data'],
  { revalidate: 3600 }
);

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { artist } = await getArtistData(params.slug);
  if (!artist) return { title: "Artist Not Found" };

  return {
    title: `${artist.name} - Zambian Artist | ZedTunez`,
    description: artist.bio || `Explore music and albums by ${artist.name} on ZedTunez. Profile and discography.`,
    openGraph: {
      title: `${artist.name} Official Profile`,
      description: artist.bio,
      images: artist.imageBase64 ? [artist.imageBase64] : [],
    },
  };
}

export default async function ArtistPage({ params }: PageProps) {
  const { artist, songs, needsRedirect } = await getArtistData(params.slug);

  if (needsRedirect) {
    permanentRedirect(needsRedirect);
  }

  if (!artist) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Artist not found</h1>
        <p className="text-gray-500">The artist you are looking for does not exist.</p>
        <div className="mt-8">
            <a href="/artists" className="text-blue-600 font-bold">All Artists</a>
        </div>
      </div>
    );
  }

  return <ArtistClient artist={artist} songs={songs} />;
}
