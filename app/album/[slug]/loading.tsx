export default function Loading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-80 aspect-square bg-gray-100 rounded-2xl"></div>
        <div className="flex-1 space-y-6">
          <div className="h-10 bg-gray-100 rounded w-3/4"></div>
          <div className="h-6 bg-gray-100 rounded w-1/2"></div>
          <div className="space-y-3 mt-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
