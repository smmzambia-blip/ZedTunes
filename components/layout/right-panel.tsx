export function RightPanel() {
  return (
    <aside className="w-72 bg-black/20 border-l border-white/5 p-6 hidden xl:flex flex-col gap-6 overflow-y-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">Top Downloads</h2>
        <div className="flex flex-col gap-4">
          {[
            { pos: 1, title: 'Aweah', artist: 'Yo Maps', dl: '2.4k', active: true },
            { pos: 2, title: 'Husband', artist: 'Mampi', dl: '1.9k', active: false },
            { pos: 3, title: 'Life yaba ku ZED', artist: 'Pompi', dl: '1.2k', active: false },
          ].map(song => (
            <div key={song.pos} className="flex items-center gap-4">
              <div className={`text-lg font-black w-4 ${song.active ? 'text-[#39FF14]' : 'text-white/40'}`}>
                {song.pos}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{song.title}</div>
                <div className="text-[10px] text-gray-500 truncate">{song.artist}</div>
              </div>
              <div className="text-[10px] text-gray-500">{song.dl}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-black uppercase tracking-wider text-gray-400">New Artists</h2>
        <div className="grid grid-cols-2 gap-2">
          {['Jemax', 'Towela'].map(artist => (
            <div key={artist} className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 mx-auto mb-2"></div>
              <div className="text-[10px] font-bold">{artist}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
