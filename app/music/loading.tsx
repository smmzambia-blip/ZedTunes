export default function Loading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded w-64"></div>
          <div className="h-4 bg-gray-100 rounded w-48"></div>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-96 h-10"></div>
      </div>
      <div className="h-6 bg-gray-100 rounded w-32 mb-8"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <div className="aspect-square bg-gray-100 rounded-2xl"></div>
            <div className="h-3 bg-gray-100 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
