export default function Loading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="h-64 bg-gray-100 rounded-3xl mb-8"></div>
      <div className="h-8 bg-gray-100 rounded w-48 mb-8"></div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
