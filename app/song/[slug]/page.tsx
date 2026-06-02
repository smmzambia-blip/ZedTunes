import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Metadata } from "next";
import { generateSlug } from "@/lib/slug";
import { permanentRedirect } from "next/navigation";
import SongClient, { Song as SongType } from "./SongClient";
import { getCached, setCached } from "@/lib/cache";
import { FALLBACK_SONGS } from "@/lib/fallbackData";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 3600;

async function getSongData(slug: string) {
  const cacheKey = `song-${slug}`;
  const cached = getCached<{ song: SongType | null; needsRedirect: string | null }>(cacheKey);
  if (cached) return cached;

  try {
    // 1. Try fetching by slug
    const q = query(collection(db, "songs"), where("slug", "==", slug));
    const slugSnap = await getDocs(q);

    if (!slugSnap.empty) {
      const docData = slugSnap.docs[0];
      const data = docData.data();
      // Ensure date is serializable
      const songData: SongType = {
        id: docData.id,
        title: data.title || "",
        artist: data.artist || "",
        category: data.category || "Single",
        slug: data.slug,
        views: data.views,
        imageBase64: data.imageBase64,
        description: data.description,
        archiveLink: data.archiveLink,
        tracks: data.tracks,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || null)
      };
      const result = { song: songData, needsRedirect: null };
      setCached(cacheKey, result);
      return result;
    }

    // 2. Fallback to ID
    const docRef = doc(db, "songs", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      let actualSlug = data.slug;
      if (!actualSlug) {
        actualSlug = generateSlug(data.title);
      }
      const prefix = data.category === "Album" ? "album" : "song";
      const result = { song: null, needsRedirect: `/${prefix}/${actualSlug}` };
      setCached(cacheKey, result);
      return result;
    }
    
    const fallbackSong = FALLBACK_SONGS.find(s => s.slug === slug || generateSlug(s.title) === slug || s.id === slug);
    if (fallbackSong) {
      const result = { song: fallbackSong as unknown as SongType, needsRedirect: null };
      setCached(cacheKey, result);
      return result;
    }

    const result = { song: null, needsRedirect: null };
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Could not fetch song data from Firestore: " + (error instanceof Error ? error.message : String(error)));
    const fallbackSong = FALLBACK_SONGS.find(s => s.slug === slug || generateSlug(s.title) === slug || s.id === slug);
    if (fallbackSong) {
      return { song: fallbackSong as unknown as SongType, needsRedirect: null };
    }
    return { song: null, needsRedirect: null };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { song } = await getSongData(params.slug);
  if (!song) return { title: "Song Not Found" };

  return {
    title: `${song.title} - ${song.artist} | ZedTunez`,
    description: song.description || `Download ${song.title} by ${song.artist} on ZedTunez. Zambian music excellence.`,
    openGraph: {
      title: `${song.title} by ${song.artist}`,
      description: song.description,
      images: song.imageBase64 ? [song.imageBase64] : [],
    },
  };
}

export default async function SongPage({ params }: PageProps) {
  const { song, needsRedirect } = await getSongData(params.slug);

  if (needsRedirect) {
    permanentRedirect(needsRedirect);
  }

  if (!song) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Song not found</h1>
        <p className="text-gray-500 mt-2">The track you are looking for does not exist or has been removed.</p>
        <div className="mt-8">
            <a href="/" className="text-blue-600 font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  return <SongClient song={song} />;
}
