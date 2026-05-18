import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Metadata } from "next";
import Image from "next/image";

interface PageProps {
  params: { slug: string };
}

interface Track {
  title: string;
  url?: string;
}

async function getAlbumData(slug: string) {
  try {
    // Try fetching by slug
    const q = query(collection(db, "songs"), where("slug", "==", slug));
    const slugSnap = await getDocs(q);

    if (!slugSnap.empty) {
      const docData = slugSnap.docs[0];
      const data = docData.data();
      return {
        album: {
          id: docData.id,
          title: data.title || "",
          artist: data.artist || "",
          category: data.category || "Album",
          slug: data.slug,
          imageBase64: data.imageBase64,
          description: data.description,
          tracks: Array.isArray(data.tracks) ? data.tracks : [],
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
        },
        needsRedirect: null
      };
    }

    return { album: null, needsRedirect: null };
  } catch (error) {
    console.error("Error fetching album data:", error);
    return { album: null, needsRedirect: null };
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { album } = await getAlbumData(params.slug);
  if (!album) return { title: "Album Not Found" };

  return {
    title: `${album.title} - ${album.artist} | ZedTunez`,
    description: album.description || `Download ${album.title} by ${album.artist} on ZedTunez. Zambian music excellence.`,
    openGraph: {
      title: `${album.title} by ${album.artist}`,
      description: album.description,
      images: album.imageBase64 ? [album.imageBase64] : [],
    },
  };
}

export default async function AlbumPage({ params }: PageProps) {
  const { album } = await getAlbumData(params.slug);

  if (!album) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Album not found</h1>
        <p className="text-gray-500 mt-2">The album you are looking for does not exist or has been removed.</p>
        <div className="mt-8">
          <a href="/" className="text-blue-600 font-bold">Go Home</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
        <div className="w-full md:w-80 aspect-square bg-gray-100 rounded-3xl shadow-2xl overflow-hidden flex-shrink-0">
          {album.imageBase64 && (
            <Image 
              src={album.imageBase64}
              alt={album.title}
              width={500}
              height={500}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>

        <div className="flex flex-col gap-6 w-full">
          <div>
            <h1 className="text-4xl sm:text-6xl font-black mb-2 tracking-tight text-gray-900 leading-none">
              {album.title}
            </h1>
            <p className="text-2xl font-bold text-gray-400">{album.artist}</p>
          </div>

          {album.description && (
            <p className="text-gray-600 text-lg italic">
             &ldquo;{album.description}&rdquo;</p>
          )}
        </div>
      </div>

      {album.tracks && album.tracks.length > 0 && (
        <div className="mt-12 bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
            <h2 className="text-2xl font-black tracking-tight">
              Tracklist <span className="text-gray-400 text-sm ml-2 font-medium">({album.tracks.length} songs)</span>
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {album.tracks.map((track, index) => (
              <div key={index} className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 font-bold w-4 text-sm">{(index + 1).toString().padStart(2, '0')}</span>
                  <span className="font-bold text-gray-900">{track.title}</span>
                </div>
                {track.url && (
                  <audio 
                    controls 
                    className="w-full h-8 mt-4"
                    src={track.url}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
