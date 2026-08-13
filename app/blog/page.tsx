import { Metadata } from "next";
import Link from "next/link";
import { fetchPosts, fetchCategories } from "@/lib/api-client";
import PostGrid from "@/components/PostGrid";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Blog Articles",
  description:
    "Browse all articles published on Chronicle. Filter by technology, design, and lifestyle.",
  alternates: {
    canonical: "/blog",
  },
};

interface BlogPageProps {
  searchParams: { page?: string; category?: string };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentCategory = searchParams.category || "";
  const currentPage = Math.max(1, parseInt(searchParams.page || "1", 10));
  const postsPerPage = 4;

  // Fetch posts + categories in parallel
  const [postsResult, categoriesResult] = await Promise.allSettled([
    fetchPosts({
      page: currentPage,
      limit: postsPerPage,
      category: currentCategory || undefined,
    }),
    fetchCategories(),
  ]);

  const postsData =
    postsResult.status === "fulfilled" ? postsResult.value : null;
  const categories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const error =
    postsResult.status === "rejected"
      ? (postsResult.reason as Error).message
      : null;

  const getCategoryUrl = (slug: string) =>
    slug ? `/blog?category=${slug}` : "/blog";

  const getBasePaginationUrl = () =>
    currentCategory ? `/blog?category=${currentCategory}` : "/blog";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
          All Stories
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Discover guides, thoughts, and opinions on everything digital and human.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 border-b border-gray-100 pb-6">
        {/* "All" tab */}
        <Link
          href="/blog"
          className={`px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
            !currentCategory
              ? "bg-violet-600 text-white border-violet-600 shadow-sm"
              : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => {
          const isSelected = currentCategory === cat.slug;
          return (
            <Link
              key={cat.id}
              href={getCategoryUrl(cat.slug)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cat.name}
              {cat._count && (
                <span className={`ml-1.5 text-xs ${isSelected ? "text-violet-200" : "text-gray-400"}`}>
                  ({cat._count.posts})
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-500 font-medium text-lg">Failed to load posts</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </div>
      )}

      {/* Post Grid */}
      {postsData && <PostGrid posts={postsData.posts} />}

      {/* Pagination */}
      {postsData && (
        <Pagination
          currentPage={currentPage}
          totalPages={postsData.pagination.totalPages}
          baseUrl={getBasePaginationUrl()}
        />
      )}
    </div>
  );
}
