import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-900 mt-20 pt-16 pb-12 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter text-[#39FF14] bg-white/5 inline-block px-3 py-1 rounded">
              ZED<span className="text-white">TUNES</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              The ultimate destination for Zambian music. Stream, download, and discover the best and latest hits from top artists.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Quick Links</h4>
            <nav className="flex flex-col gap-3 text-sm font-bold">
              <Link href="/" className="text-gray-500 hover:text-[#39FF14] transition-colors">Home</Link>
              <Link href="/music" className="text-gray-500 hover:text-[#39FF14] transition-colors">Music</Link>
              <Link href="/albums" className="text-gray-500 hover:text-[#39FF14] transition-colors">Albums</Link>
              <Link href="/artists" className="text-gray-500 hover:text-[#39FF14] transition-colors">Artists</Link>
            </nav>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">Legal</h4>
            <nav className="flex flex-col gap-3 text-sm font-bold">
              <Link href="/about" className="text-gray-500 hover:text-[#39FF14] transition-colors">About Us</Link>
              <Link href="/privacy" className="text-gray-500 hover:text-[#39FF14] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#39FF14] transition-colors">Terms & Conditions</Link>
              <Link href="/contact" className="text-gray-500 hover:text-[#39FF14] transition-colors">Contact Us</Link>
            </nav>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xs text-gray-700 font-bold tracking-widest uppercase">
            &copy; {new Date().getFullYear()} ZEDTUNES ZAMBIA. ALL RIGHTS RESERVED.
          </div>
          <div className="flex gap-6">
             {/* Social links could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
