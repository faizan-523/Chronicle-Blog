import { Metadata } from "next";
import { fetchPosts } from "@/lib/api-client";
import PostGrid from "@/components/PostGrid";

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${name} Articles`,
    description: `Read the latest articles on ${name} at Chronicle.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  let posts: import("@/types/blog").BlogPost[] = [];
  let error: string | null = null;

  try {
    const result = await fetchPosts({ category: params.slug, limit: 50 });
    posts = result.posts;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load posts";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs font-semibold text-violet-600 tracking-wider uppercase">
          Category
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
          {categoryName}
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Articles, guides, and thoughts related to {categoryName}.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-16">
          <p className="text-red-500 font-medium text-lg">Failed to load posts</p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
        </div>
      )}

      {/* Post Grid */}
      {!error && <PostGrid posts={posts} />}
    </div>
  );
}
