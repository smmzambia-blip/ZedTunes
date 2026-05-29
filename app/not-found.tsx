import Link from 'next/link';
import { Music, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | ZedTunes',
  description: 'The page you are looking for does not exist. Explore our music collection instead.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      {/* Error Code */}
      <div className="mb-8">
        <h1 className="text-9xl font-black text-black tracking-tighter">404</h1>
        <div className="w-full h-1 bg-gradient-to-r from-[#39FF14] to-black mt-4"></div>
      </div>

      {/* Error Message */}
      <div className="text-center mb-12 max-w-2xl">
        <h2 className="text-4xl font-black tracking-tight mb-4">Lost in the Beat?</h2>
        <p className="text-gray-600 text-lg leading-relaxed">
          The page you're looking for doesn't exist. But don't worry – we have plenty of amazing music waiting for you.
        </p>
      </div>

      {/* Suggested Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
        {/* Home */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-200 hover:border-black hover:bg-black/5 transition-all group"
        >
          <Home className="w-8 h-8 mb-3 text-gray-600 group-hover:text-black transition" />
          <span className="font-black text-sm uppercase tracking-wider">Home</span>
          <span className="text-xs text-gray-500 mt-1">Go to homepage</span>
        </Link>

        {/* Explore Music */}
        <Link
          href="/music"
          className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-200 hover:border-black hover:bg-black/5 transition-all group"
        >
          <Music className="w-8 h-8 mb-3 text-gray-600 group-hover:text-black transition" />
          <span className="font-black text-sm uppercase tracking-wider">Music</span>
          <span className="text-xs text-gray-500 mt-1">Browse all tracks</span>
        </Link>

        {/* Search */}
        <Link
          href="/music?search=true"
          className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-gray-200 hover:border-black hover:bg-black/5 transition-all group"
        >
          <Search className="w-8 h-8 mb-3 text-gray-600 group-hover:text-black transition" />
          <span className="font-black text-sm uppercase tracking-wider">Search</span>
          <span className="text-xs text-gray-500 mt-1">Find your vibe</span>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <Link href="/albums" className="text-sm font-black text-gray-600 hover:text-black transition uppercase tracking-wider">
          Albums
        </Link>
        <span className="hidden sm:inline text-gray-300">•</span>
        <Link href="/artists" className="text-sm font-black text-gray-600 hover:text-black transition uppercase tracking-wider">
          Artists
        </Link>
        <span className="hidden sm:inline text-gray-300">•</span>
        <Link href="/contact" className="text-sm font-black text-gray-600 hover:text-black transition uppercase tracking-wider">
          Contact Us
        </Link>
      </div>

      {/* Decorative Element */}
      <div className="mt-16 opacity-10">
        <Music className="w-32 h-32 text-black" />
      </div>
    </div>
  );
}