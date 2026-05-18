export default function Loading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded w-64"></div>
          <div className="h-4 bg-gray-100 rounded w-48"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
