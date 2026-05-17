import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800 mt-auto py-8 text-white z-40 pb-32">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-black tracking-tighter text-[#39FF14]">
            ZEDTUNES
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-400">
            <Link href="/about" className="hover:text-white">About</Link>
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link href="/contact" className="hover:text-white">Contact Us</Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} ZedTunes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
