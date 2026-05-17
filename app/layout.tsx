import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/sidebar';
import { TopNav } from '@/components/layout/top-nav';
import { MusicPlayer } from '@/components/player/music-player';

export const metadata: Metadata = {
  metadataBase: new URL('https://zedtunes.example.com'),
  title: 'ZedTunes | Modern Zambian Music Platform',
  description: 'Download and stream the latest Zambian music on ZedTunes.',
  keywords: ['Zambian music', 'ZedTunes', 'mp3 download', 'Zambia trending songs'],
  openGraph: {
    title: 'ZedTunes',
    description: 'The fastest modern SEO-optimized music platform in Zambia.',
    url: 'https://zedtunes.example.com',
    siteName: 'ZedTunes',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    locale: 'en_ZM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZedTunes',
    description: 'Discover Zambian Music',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden relative font-sans">
        <TopNav />
        <main className="flex flex-1 overflow-hidden">
          <Sidebar className="hidden md:flex" />
          <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 pb-24">
            {children}
          </section>
          
          {/* Right Charts Panel */}
          <aside className="w-72 bg-black/40 border-l border-white/5 p-6 hidden xl:flex flex-col gap-6 overflow-y-auto pb-24">
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">Top Downloads</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-[#39FF14] w-4">1</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">Aweah</div>
                    <div className="text-[10px] text-gray-500 truncate">Yo Maps</div>
                  </div>
                  <div className="text-[10px] text-gray-500">2.4k</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-white/40 w-4">2</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">Husband</div>
                    <div className="text-[10px] text-gray-500 truncate">Mampi</div>
                  </div>
                  <div className="text-[10px] text-gray-500">1.9k</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-black text-white/40 w-4">3</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">Life yaba ku ZED</div>
                    <div className="text-[10px] text-gray-500 truncate">Pompi</div>
                  </div>
                  <div className="text-[10px] text-gray-500">1.2k</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">New Artists</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-700 mx-auto mb-2"></div>
                  <div className="text-[10px] font-bold">Jemax</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-700 mx-auto mb-2"></div>
                  <div className="text-[10px] font-bold">Towela</div>
                </div>
              </div>
            </div>
          </aside>
        </main>
        {/* Sticky Player */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MusicPlayer />
        </div>
      </body>
    </html>
  );
}
