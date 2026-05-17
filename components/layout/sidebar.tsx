export function Sidebar() {
  return (
    <aside className="w-60 bg-black/20 p-6 flex flex-col gap-8 hidden lg:flex border-r border-white/5 h-full">
      <div className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Your Library</div>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">
            <span className="opacity-70">📻</span> Radio
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">
            <span className="opacity-70">📜</span> Playlists
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">
            <span className="opacity-70">❤️</span> Liked Songs
          </li>
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">
            <span className="opacity-70">⬇️</span> Downloads
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Categories</div>
        <ul className="flex flex-col gap-3">
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">Kalindula</li>
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">Zed Beats</li>
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">Amapiano</li>
          <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white cursor-pointer transition">Gospel</li>
        </ul>
      </div>
    </aside>
  );
}
