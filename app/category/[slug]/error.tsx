"use client";

import Link from "next/link";

export default function CategoryError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Failed to load category posts</h2>
      <p className="text-gray-500 mb-8">{error.message || "Something went wrong."}</p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          Try again
        </button>
        <Link
          href="/blog"
          className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors"
        >
          All Posts
        </Link>
      </div>
    </div>
  );
}
