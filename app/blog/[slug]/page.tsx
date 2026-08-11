import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { MOCK_POSTS } from "@/lib/mock-posts";
import CategoryBadge from "@/components/CategoryBadge";
import PostGrid from "@/components/PostGrid";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage }],
    },
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = MOCK_POSTS.find((p) => p.slug === params.slug);
  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current post, limit to 3)
  let relatedPosts = MOCK_POSTS.filter(
    (p) => p.category === post.category && p.slug !== post.slug
  ).slice(0, 3);

  // If we don't have enough related posts, fill with others
  if (relatedPosts.length < 3) {
    const fallbackPosts = MOCK_POSTS.filter(
      (p) => p.slug !== post.slug && !relatedPosts.some((rp) => rp.id === p.id)
    ).slice(0, 3 - relatedPosts.length);
    relatedPosts = [...relatedPosts, ...fallbackPosts];
  }

  return (
    <article className="w-full">
      {/* Header Container */}
      <div className="bg-gradient-to-b from-white to-slate-50/50 py-12 md:py-16 border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          {/* Category Tag */}
          <div className="mb-4">
            <CategoryBadge category={post.category} />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author & Meta Row */}
          <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-xs text-gray-500">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1.5" />
                {post.date}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5" />
                {post.readingTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cover Image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 mb-16">
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border border-gray-100 bg-gray-50">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Post Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-24">
        <div className="prose">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Related Posts Section */}
      <section className="bg-gray-50/50 border-t border-gray-100 py-16 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 tracking-tight">
            Related Stories
          </h2>
          <PostGrid posts={relatedPosts} />
        </div>
      </section>
    </article>
  );
}
