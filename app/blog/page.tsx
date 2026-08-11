import { Metadata } from "next";
import Link from "next/link";
import { MOCK_POSTS } from "@/lib/mock-posts";
import PostGrid from "@/components/PostGrid";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Blog Articles",
  description: "Browse all articles published on Chronicle. Filter by technology, design, and lifestyle.",
};

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
  };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const categories = ["All", "Technology", "Design", "Lifestyle"];
  
  // Parse parameters
  const currentCategory = searchParams.category || "All";
  const currentPage = parseInt(searchParams.page || "1", 10);
  const postsPerPage = 4;

  // Filter posts
  const filteredPosts = MOCK_POSTS.filter((post) => {
    if (currentCategory.toLowerCase() === "all") return true;
    return post.category.toLowerCase() === currentCategory.toLowerCase();
  });

  // Calculate pagination
  const totalPosts = filteredPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Helper for generating category link URLs
  const getCategoryUrl = (cat: string) => {
    if (cat.toLowerCase() === "all") return "/blog";
    return `/blog?category=${cat.toLowerCase()}`;
  };

  const getBasePaginationUrl = () => {
    if (currentCategory.toLowerCase() === "all") return "/blog";
    return `/blog?category=${currentCategory.toLowerCase()}`;
  };

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
        {categories.map((cat) => {
          const isSelected = currentCategory.toLowerCase() === cat.toLowerCase();
          return (
            <Link
              key={cat}
              href={getCategoryUrl(cat)}
              className={`px-5 py-2.5 text-sm font-semibold rounded-xl border transition-all duration-200 ${
                isSelected
                  ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Post Grid */}
      <PostGrid posts={paginatedPosts} />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={getBasePaginationUrl()}
      />
    </div>
  );
}
