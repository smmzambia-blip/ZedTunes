export default function Loading() {
  return (
    <div className="py-8 animate-pulse">
      <div className="flex gap-4 mb-12">
        <div className="w-48 h-48 bg-gray-100 rounded-2xl"></div>
        <div className="flex-1 space-y-4 py-4">
          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
      </div>
    </div>
  );
}
