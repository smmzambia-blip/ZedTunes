import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto py-8 text-black z-40 pb-32">
      <div className="container mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-black tracking-tighter text-[#39FF14]">
            ZEDTUNES
          </div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/about" className="hover:text-black">About</Link>
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms & Conditions</Link>
            <Link href="/contact" className="hover:text-black">Contact Us</Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} ZedTunes. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
