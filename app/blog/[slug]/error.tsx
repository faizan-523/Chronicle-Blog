"use client";

import Link from "next/link";

export default function PostError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-3">Could not load this article</h2>
      <p className="text-gray-500 mb-8">{error.message || "Something went wrong while fetching this post."}</p>
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
          Back to Blog
        </Link>
      </div>
    </div>
  );
}
