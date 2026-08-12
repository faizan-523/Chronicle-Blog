export default function CategoryLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded mx-auto" />
        <div className="h-10 w-48 bg-gray-200 rounded-xl mx-auto" />
        <div className="h-4 w-72 bg-gray-100 rounded mx-auto" />
      </div>

      {/* Post grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="aspect-[16/10] bg-gray-200" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-20" />
              <div className="h-6 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-full" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
