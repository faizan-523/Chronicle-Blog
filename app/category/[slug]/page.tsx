import { Metadata } from "next";
import { MOCK_POSTS } from "@/lib/mock-posts";
import PostGrid from "@/components/PostGrid";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${categoryName} Articles`,
    description: `Read the latest articles on ${categoryName} at Chronicle.`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  
  // Filter posts matching this category
  const filteredPosts = MOCK_POSTS.filter(
    (post) => post.category.toLowerCase() === params.slug.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-xs font-semibold text-violet-600 tracking-wider uppercase">Category</span>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-2 mb-4">
          {categoryName}
        </h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Articles, guides, and thoughts related to {categoryName}.
        </p>
      </div>

      {/* Post Grid */}
      <PostGrid posts={filteredPosts} />
    </div>
  );
}
