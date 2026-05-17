import { Metadata } from 'next';
import Image from 'next/image';
import { Play, Download, Heart, Share2, MoreHorizontal } from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

// In a real app, fetch from Prisma:
// const song = await prisma.song.findUnique({ where: { slug: id } })
const getMockSong = (id: string) => ({
  id,
  title: id === '1' ? 'Lusaka Nights' : 'African Queen',
  artist: 'Chef 187',
  album: 'Heart of a Lion',
  genre: 'Hip Hop',
  releaseDate: '2024-05-10',
  description: 'A hit song taking over the streets of Lusaka. Produced by top Zambian producers.',
  tags: ['Zed Beats', 'Zambian Music', 'ZedTunes'],
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const song = getMockSong(resolvedParams.id);
  
  return {
    title: `${song.title} by ${song.artist} | ZedTunes Mp3 Download`,
    description: `Download and listen to ${song.title} by ${song.artist}. ${song.description}`,
    openGraph: {
      title: `${song.title} - ${song.artist}`,
      description: `Stream and download ${song.title} by ${song.artist} on ZedTunes.`,
      type: 'music.song',
      // images: [{ url: song.coverImage }]
    },
  };
}

export default async function SongPage({ params }: Props) {
  const resolvedParams = await params;
  const song = getMockSong(resolvedParams.id);

  return (
    <article className="max-w-4xl mx-auto py-8 text-white">
      {/* Schema.org JSON-LD for Google Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MusicRecording",
            name: song.title,
            byArtist: {
              "@type": "MusicGroup",
              name: song.artist,
            },
            inAlbum: {
              "@type": "MusicAlbum",
              name: song.album,
            },
            datePublished: song.releaseDate,
            description: song.description,
          }),
        }}
      />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-end bg-gradient-to-t from-black via-gray-900 to-black p-8 rounded-3xl border border-white/5 relative overflow-hidden">
        {/* Cover Image Placeholder */}
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 bg-white/5 rounded-2xl shadow-xl overflow-hidden z-10 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#39FF14]/20 to-black/80 flex items-center justify-center">
            <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">Cover Art</span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#39FF14] mb-2">Song</p>
          <h1 className="text-4xl md:text-6xl font-black mb-2 text-white">
            {song.title}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start text-sm text-gray-400 gap-2 mb-4 font-medium">
            <span className="text-white font-bold hover:underline cursor-pointer">{song.artist}</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">{song.album}</span>
            <span>•</span>
            <span>{song.releaseDate.split('-')[0]}</span>
          </div>
        </div>
      </div>

      {/* Action Bars */}
      <div className="flex items-center gap-4 py-8">
        <button className="h-14 w-14 rounded-full bg-[#39FF14] text-black flex items-center justify-center hover:scale-105 transition">
          <Play size={24} fill="currentColor" className="ml-1" />
        </button>
        <button className="h-10 w-10 flex items-center justify-center text-gray-400 hover:text-white border border-white/10 rounded-full hover:bg-white/5 transition">
          <Heart size={20} />
        </button>
        <button className="h-10 px-6 flex items-center justify-center text-white bg-white/5 hover:bg-white/10 rounded-full font-bold text-sm transition gap-2 border border-white/10">
          <Download size={16} />
          Download MP3
        </button>
        <button className="text-gray-400 hover:text-white transition ml-auto p-2">
          <MoreHorizontal size={24} />
        </button>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-4">
        <div className="col-span-2 space-y-8">
          <section>
            <h3 className="text-xl font-bold mb-4">About "{song.title}"</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              {song.description} {song.title} is a standout track combining signature Zed Beats with fresh vocal delivery. 
              The production highlights {song.artist}'s unique energy and solidifies their spot in the Zambian music scene.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
              Lyrics
              <span className="text-[10px] text-[#39FF14] font-bold uppercase bg-[#39FF14]/10 px-2 py-1 rounded">Verified</span>
            </h3>
            <div className="text-gray-400 font-mono leading-loose text-sm whitespace-pre-wrap bg-white/5 p-6 rounded-2xl border border-white/5">
              (Intro){"\n"}
              Yeah, it's your boy...{"\n"}
              Taking over the streets of LSK{"\n\n"}
              (Verse 1){"\n"}
              We hustling everyday, no time to sleep{"\n"}
              Stacking this paper, the pockets get deep{"\n"}...
            </div>
          </section>
        </div>

        <div className="col-span-1 space-y-6 flex flex-col">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
            <h4 className="text-xs text-gray-500 font-bold uppercase mb-4 tracking-widest">Song Info</h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Release Date</span>
                <span className="text-white font-medium">{song.releaseDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Genre</span>
                <span className="text-white font-medium">{song.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Audio Quality</span>
                <span className="text-[#39FF14] font-medium tracking-tight">320 kbps</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 mt-auto">
            <h4 className="text-xs text-gray-500 font-bold uppercase mb-4 tracking-widest">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {song.tags.map(tag => (
                <span key={tag} className="text-xs text-gray-400 bg-black px-3 py-1.5 rounded-full border border-white/10 hover:border-[#39FF14] hover:text-[#39FF14] cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
