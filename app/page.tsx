import Link from "next/link";
import Image from "next/image";
import { fetchPosts } from "@/lib/api-client";
import CategoryBadge from "@/components/CategoryBadge";
import PostGrid from "@/components/PostGrid";
import { BlogPost } from "@/types/blog";

export default async function Home() {
  let featuredPost: BlogPost | null = null;
  let latestPosts: BlogPost[] = [];
  let error: string | null = null;

  try {
    const { posts } = await fetchPosts({ limit: 7 });
    featuredPost = posts[0] ?? null;
    latestPosts = posts.slice(1, 4);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load posts";
  }

  return (
    <div className="flex flex-col w-full">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-b from-white to-slate-50/50 py-12 md:py-20 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Ideas, insights, and <span className="text-violet-600">inspiration</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
              Dive into our curated articles on technology, design, and mindful living.
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="max-w-md mx-auto text-center py-12">
              <p className="text-red-500 font-medium">Could not load posts.</p>
              <p className="text-gray-400 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Featured Post Card */}
          {!error && featuredPost && (
            <div className="relative group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Section */}
              <div className="relative lg:col-span-7 aspect-[16/10] lg:aspect-auto min-h-[300px] lg:min-h-[450px] overflow-hidden bg-gray-50">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-500 ease-out"
                />
              </div>

              {/* Content Section */}
              <div className="p-8 sm:p-12 lg:col-span-5 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs font-semibold text-violet-600 tracking-wider uppercase">
                    Latest Post
                  </span>
                  <span className="text-gray-300">•</span>
                  <CategoryBadge category={featuredPost.category} />
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-4 group-hover:text-violet-600 transition-colors duration-200">
                  <Link href={`/blog/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h2>

                <p className="text-gray-600 text-sm sm:text-base mb-8 line-clamp-4 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {featuredPost.author.name}
                      </p>
                      <p className="text-xs text-gray-500">{featuredPost.author.role}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-medium text-gray-400">{featuredPost.date}</p>
                    <p className="text-xs font-bold text-violet-600 mt-0.5">
                      {featuredPost.readingTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!error && !featuredPost && (
            <div className="text-center py-12 text-gray-400">No posts published yet.</div>
          )}
        </div>
      </section>

      {/* Latest Posts Grid */}
      {!error && latestPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Latest Stories
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Explore our recently published articles
              </p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
            >
              <span>View all posts</span>
              <span className="ml-1">→</span>
            </Link>
          </div>
          <PostGrid posts={latestPosts} />
        </section>
      )}
    </div>
  );
}
