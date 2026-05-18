export default function Loading() {
  return (
    <div className="flex flex-col gap-12 animate-pulse">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 aspect-[16/9] bg-gray-100 rounded-[2.5rem]"></div>
        <div className="lg:w-1/3 h-[500px] bg-gray-50 rounded-[2.5rem]"></div>
      </div>
      <div>
        <div className="h-8 bg-gray-100 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 xl:grid-cols-8 gap-4">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
