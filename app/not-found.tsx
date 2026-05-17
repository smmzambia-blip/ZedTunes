import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-9xl font-extrabold text-white mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold text-gray-300 mb-6">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Oops! The song, artist, or page you are looking for does not exist. It might have been removed or the link is broken.
      </p>
      <Link href="/" className="bg-neonGreen text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition shadow-[0_0_20px_rgba(57,255,20,0.3)]">
        Return Home
      </Link>
    </div>
  );
}
