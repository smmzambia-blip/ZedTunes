import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { Metadata } from "next";
import { generateSlug } from "@/lib/slug";
import { permanentRedirect } from "next/navigation";
import SongClient, { Song as SongType } from "../../song/[slug]/SongClient";

interface PageProps {
  params: { slug: string };
}

async function getAlbumData(slug: string) {
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
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
      };
      return { disc: albumData, needsRedirect: null };
    }

    // 2. Fallback to ID
    const docRef = doc(db, "songs", slug);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const actualSlug = data.slug || generateSlug(data.title);
      if (!data.slug) await updateDoc(docRef, { slug: actualSlug });

      if (data.category !== "Album") {
          return { disc: null, needsRedirect: `/song/${actualSlug}` };
      }
      return { disc: null, needsRedirect: `/album/${actualSlug}` };
    }
    
    return { disc: null, needsRedirect: null };
  } catch (error) {
    console.error("Error fetching album data:", error);
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
