import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { fetchPost, fetchPosts } from "@/lib/api-client";
import CategoryBadge from "@/components/CategoryBadge";
import PostGrid from "@/components/PostGrid";
import CommentSection from "@/components/CommentSection";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

interface BlogPostPageProps {
  params: { slug: string };
}

interface InitialComment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const post = await fetchPost(params.slug);
    const imageUrl = post.coverImage.startsWith("/")
      ? `https://chronicle-blog.com${post.coverImage}`
      : post.coverImage;

    return {
      title: post.title,
      description: post.excerpt,
      alternates: {
        canonical: `/blog/${params.slug}`,
      },
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [{ url: imageUrl }],
        type: "article",
        url: `https://chronicle-blog.com/blog/${params.slug}`,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [imageUrl],
      },
    };
  } catch {
    return { title: "Post Not Found" };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  let post;
  try {
    post = await fetchPost(params.slug);
  } catch (e) {
    if (e instanceof Error && e.message === "Post not found") notFound();
    // For other errors, re-throw to let error.tsx handle it
    throw e;
  }

  // Fetch related posts (same category, excluding current)
  let relatedPosts: import("@/types/blog").BlogPost[] = [];
  try {
    const { posts } = await fetchPosts({
      category: post.category.toLowerCase(),
      limit: 4,
    });
    relatedPosts = posts.filter((p) => p.slug !== post.slug).slice(0, 3);

    // If not enough related, fill with latest posts
    if (relatedPosts.length < 3) {
      const { posts: latest } = await fetchPosts({ limit: 6 });
      const extras = latest
        .filter((p) => p.slug !== post.slug && !relatedPosts.some((r) => r.slug === p.slug))
        .slice(0, 3 - relatedPosts.length);
      relatedPosts = [...relatedPosts, ...extras];
    }
  } catch {
    // Related posts are non-critical — continue without them
  }

  // Fetch initial comments server-side (non-critical, default to empty)
  let initialComments: InitialComment[] = [];
  try {
    const commentsRes = await fetch(
      `${BASE_URL}/api/posts/${post.slug}/comments`,
      { cache: "no-store" }
    );
    if (commentsRes.ok) {
      const data = await commentsRes.json();
      initialComments = (data.comments ?? []) as InitialComment[];
    }
  } catch {
    // Comments are non-critical
  }

  let dateIso = new Date().toISOString();
  try {
    dateIso = new Date(post.date).toISOString();
  } catch {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith("/")
      ? `https://chronicle-blog.com${post.coverImage}`
      : post.coverImage,
    datePublished: dateIso,
    author: {
      "@type": "Person",
      name: post.author.name,
      image: post.author.avatar.startsWith("/")
        ? `https://chronicle-blog.com${post.author.avatar}`
        : post.author.avatar,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://chronicle-blog.com/blog/${post.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="w-full">
      {/* Header Container */}
      <div className="bg-gradient-to-b from-white to-slate-50/50 py-12 md:py-16 border-b border-gray-100/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <div className="mb-4">
            <CategoryBadge category={post.category} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

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

      {/* Cover Image */}
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-12">
        <div className="prose">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </div>

      {/* Comments */}
      <CommentSection slug={post.slug} initialComments={initialComments} />

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50/50 border-t border-gray-100 py-16 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 tracking-tight">
              Related Stories
            </h2>
            <PostGrid posts={relatedPosts} />
          </div>
        </section>
      )}
    </article>
  </>
  );
}
