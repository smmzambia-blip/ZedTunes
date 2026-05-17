import React from "react";
import { Download, Heart, Play } from "lucide-react";

export default function SongPage({ params }: { params: { id: string } }) {
  // Simulating fetched song data
  const songId = params.id;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Placeholder for Image replacement: Using a div instead of next/image */}
        <div className="w-full md:w-64 h-64 bg-gray-200 rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
          <Play size={48} className="text-gray-400" />
        </div>

        <div className="flex flex-col gap-4 w-full">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black mb-2">Song Title {songId}</h1>
            <p className="text-xl text-gray-600">Artist Name</p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button className="bg-black text-white px-6 py-2 rounded-full font-bold hover:bg-gray-800 transition flex items-center gap-2">
              <Play size={18} />
              Play
            </button>
            <button className="bg-gray-100 text-black px-6 py-2 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2">
              <Download size={18} />
              Download
            </button>
            <button className="bg-gray-100 text-black px-4 py-2 rounded-full font-bold hover:bg-gray-200 transition flex items-center gap-2">
              <Heart size={18} />
            </button>
          </div>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="text-xl font-bold mb-4">About this song</h2>
            {/* Fixed unescaped entities */}
            <p className="text-gray-700 leading-relaxed">
              This track is one of the artist&apos;s most popular releases. It features a blend of modern rhythms and classic melodies. They&apos;ve really pushed the boundaries on this one!
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              &quot;Music expresses that which cannot be put into words and that which cannot remain silent.&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
