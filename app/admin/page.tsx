import { Heart, Activity, Music, Users, UploadCloud } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="py-6 space-y-6 text-white max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <button className="bg-neonGreen text-black px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-green-400 transition">
          <UploadCloud size={18} />
          Upload Song
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Songs', value: '1,248', icon: <Music size={20} className="text-neonGreen" /> },
          { label: 'Total Users', value: '45.2K', icon: <Users size={20} className="text-blue-400" /> },
          { label: 'Total Streams', value: '8.4M', icon: <Activity size={20} className="text-pink-400" /> },
          { label: 'Total Likes', value: '342K', icon: <Heart size={20} className="text-red-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400 font-medium">{stat.label}</p>
              {stat.icon}
            </div>
            <p className="text-3xl font-extrabold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-gray-800 bg-black/20">
          <h2 className="text-lg font-bold">Recent Uploads</h2>
        </div>
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-gray-800 text-xs uppercase text-gray-300">
            <tr>
              <th className="px-6 py-4">Song Name</th>
              <th className="px-6 py-4">Artist</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Streams</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[
              { id: 1, title: 'Lusaka Nights', artist: 'Chef 187', status: 'PUBLISHED', streams: '1.2M' },
              { id: 2, title: 'Chalo', artist: 'Slapdee', status: 'PUBLISHED', streams: '800K' },
              { id: 3, title: 'New Wave Mix', artist: 'DJ Mzenga', status: 'DRAFT', streams: '-' },
            ].map((song) => (
              <tr key={song.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="px-6 py-4 font-medium text-white">{song.title}</td>
                <td className="px-6 py-4">{song.artist}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold
                    ${song.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {song.status}
                  </span>
                </td>
                <td className="px-6 py-4">{song.streams}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-blue-400 hover:underline mr-4">Edit</button>
                  <button className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
