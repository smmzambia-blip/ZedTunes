import { SongCard } from '@/components/ui/song-card';

const DUMMY_SONGS = [
  { id: '1', title: 'Tuleya Kuli Lesa', artist: 'Chef 187', views: '1.2M' },
  { id: '2', title: 'Aweah', artist: 'Yo Maps', views: '800K' },
  { id: '3', title: 'Malaika', artist: 'Yo Maps', views: '2.5M' },
  { id: '4', title: 'Extra Time', artist: 'Macky 2', views: '950K' },
  { id: '5', title: 'Zambia Ku Chalo', artist: 'Cleo Ice Queen', views: '450K' },
  { id: '6', title: 'Superman', artist: 'Yo Maps', views: '3.1M' },
  { id: '7', title: 'Tuleya Kuli Lesa', artist: 'Chef 187', views: '1.9M' },
];

export default function Home() {
  return (
    <>
      <div className="relative rounded-3xl overflow-hidden aspect-[21/9] flex-shrink-0 bg-gradient-to-r from-emerald-100 to-white border border-gray-200 group min-h-[300px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=1000')] bg-cover opacity-20 group-hover:scale-105 transition-transform duration-700"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="relative h-full flex flex-col justify-end p-6 md:p-10 text-white">
          <span className="text-[#39FF14] text-xs font-bold uppercase tracking-widest mb-2">Featured Release</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-none">Zambian Kings: Vol. 1</h1>
          <p className="text-gray-200 max-w-lg mb-6 line-clamp-2 text-sm md:text-base">The biggest anthems from the heart of Zambia. Featuring Chef 187, Yo Maps, Macky 2, and more.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-black px-6 md:px-8 py-3 rounded-full font-bold hover:bg-[#39FF14] transition-colors text-sm">Listen Now</button>
            <button className="bg-black/50 backdrop-blur-md border border-white/20 px-6 md:px-8 py-3 rounded-full font-bold hover:bg-black/70 text-white text-sm">Add to Playlist</button>
            <button className="bg-blue-600/80 backdrop-blur-md border border-blue-400/30 px-6 md:px-8 py-3 rounded-full font-bold hover:bg-blue-600 text-white text-sm">Download</button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Trending Now</h2>
          <a href="#" className="text-xs text-blue-600 font-bold uppercase hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {DUMMY_SONGS.slice(0, 5).map((song) => (
            <SongCard key={song.id} {...song} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Latest Uploads</h2>
          <a href="#" className="text-xs text-blue-600 font-bold uppercase hover:underline">View All</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...DUMMY_SONGS].reverse().slice(0, 5).map((song) => (
            <SongCard key={`latest-${song.id}`} {...song} />
          ))}
        </div>
      </div>
    </>
  );
}
