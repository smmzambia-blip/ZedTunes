import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Metadata } from "next";
import { generateSlug } from "@/lib/slug";
import { permanentRedirect } from "next/navigation";
import SongClient, { Song as SongType } from "../../song/[slug]/SongClient";
import { getCached, setCached } from "@/lib/cache";
import { FALLBACK_SONGS } from "@/lib/fallbackData";

interface PageProps {
  params: { slug: string };
}

export const revalidate = 3600;

async function getAlbumData(slug: string) {
  const cacheKey = `album-${slug}`;
  const cached = getCached<{ disc: SongType | null; needsRedirect: string | null }>(cacheKey);
  if (cached) return cached;

  try {
    // 1. Try fetching by slug
    const q = query(collection(db, "songs"), where("slug", "==", slug), where("category", "==", "Album"));
    const slugSnap = await getDocs(q);

    if (!slugSnap.empty) {
      const docData = slugSnap.docs[0];
      const data = docData.data();
      const albumData: SongType = {
        id: docData.id,
        title: data.title || "",
        artist: data.artist || "",
        category: data.category || "Album",
        slug: data.slug,
        views: data.views,
        imageBase64: data.imageBase64,
        description: data.description,
        archiveLink: data.archiveLink,
        tracks: data.tracks,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || null)
      };
      const result = { disc: albumData, needsRedirect: null };
      setCached(cacheKey, result);
      return result;
    }

    // 2. Fallback to ID
    const docRef = doc(db, "songs", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const actualSlug = data.slug || generateSlug(data.title);

      if (data.category !== "Album") {
          const result = { disc: null, needsRedirect: `/song/${actualSlug}` };
          setCached(cacheKey, result);
          return result;
      }
      const result = { disc: null, needsRedirect: `/album/${actualSlug}` };
      setCached(cacheKey, result);
      return result;
    }
    
    const fallbackAlbum = FALLBACK_SONGS.find(s => s.category === 'Album' && (s.slug === slug || generateSlug(s.title) === slug || s.id === slug));
    if (fallbackAlbum) {
       const result = { disc: fallbackAlbum as unknown as SongType, needsRedirect: null };
       setCached(cacheKey, result);
       return result;
    }

    const result = { disc: null, needsRedirect: null };
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.warn("Could not fetch album data from Firestore: " + (error instanceof Error ? error.message : String(error)));
    const fallbackAlbum = FALLBACK_SONGS.find(s => s.category === 'Album' && (s.slug === slug || generateSlug(s.title) === slug || s.id === slug));
    if (fallbackAlbum) {
      return { disc: fallbackAlbum as unknown as SongType, needsRedirect: null };
    }
    return { disc: null, needsRedirect: null };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { disc } = await getAlbumData(params.slug);
  if (!disc) return { title: "Album Not Found" };

  return {
    title: `${disc.title} (Album) - ${disc.artist} | ZedTunez`,
    description: disc.description || `Download the full album ${disc.title} by ${disc.artist} on ZedTunez. Zambian local hits.`,
    openGraph: {
      title: `${disc.title} - Full Album by ${disc.artist}`,
      description: disc.description,
      images: disc.imageBase64 ? [disc.imageBase64] : [],
    },
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const { disc, needsRedirect } = await getAlbumData(params.slug);

  if (needsRedirect) {
    permanentRedirect(needsRedirect);
  }

  if (!disc) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Album not found</h1>
        <p className="text-gray-500 mt-2">The collection you are looking for does not exist or has been removed.</p>
        <div className="mt-8">
            <a href="/albums" className="text-blue-600 font-bold">Back to Albums</a>
        </div>
      </div>
    );
  }

  // Casting disc as any temporarily but with a comment to fix any related types if needed
  return <SongClient song={disc} />;
}
