export default function BlogLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <div className="h-10 bg-gray-200 rounded-xl w-48 mx-auto mb-4" />
        <div className="h-4 bg-gray-100 rounded w-80 mx-auto" />
      </div>

      {/* Category tabs skeleton */}
      <div className="flex gap-2 justify-center mb-12 pb-6 border-b border-gray-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-24 bg-gray-100 rounded-xl" />
        ))}
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
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
