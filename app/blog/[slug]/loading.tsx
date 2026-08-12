export default function PostLoading() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="bg-gradient-to-b from-white to-slate-50/50 py-12 md:py-16 border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-4 w-32 bg-gray-200 rounded mb-8" />
          <div className="h-4 w-20 bg-gray-100 rounded mb-4" />
          <div className="h-10 bg-gray-200 rounded-xl w-full mb-3" />
          <div className="h-10 bg-gray-200 rounded-xl w-3/4 mb-8" />
          <div className="flex justify-between pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-gray-100 rounded" />
              <div className="h-4 w-20 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Cover image skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-10 mb-16">
        <div className="aspect-[21/9] rounded-3xl bg-gray-200" />
      </div>

      {/* Content skeleton */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-24 space-y-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-100 rounded ${i % 5 === 4 ? "w-2/3" : "w-full"}`}
          />
        ))}
      </div>
    </div>
  );
}
