"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import PostForm, { PostFormValues } from "@/components/admin/PostForm";
import { ApiPost } from "@/lib/api-client";

interface EditPostPageProps {
  params: { id: string }; // id is the post slug
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const slug = params.id;
  const [post, setPost] = useState<ApiPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        if (res.status === 404) throw new Error("Post not found");
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();
        setPost(data.post);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const initialValues: Partial<PostFormValues> = post
    ? {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        categoryId: post.category.id,
        tags: (post.tags as string[]).join(", "),
        published: post.published,
      }
    : {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Edit Post</h1>
        {post && (
          <p className="text-gray-500 text-sm mt-1 truncate max-w-xl">
            {post.title}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 gap-3 text-gray-500">
          <Loader2 className="w-7 h-7 animate-spin text-violet-600" />
          <span className="text-sm font-medium">Loading post...</span>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
          <h3 className="font-bold text-gray-900 text-lg">Failed to load post</h3>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <Link
            href="/admin"
            className="mt-6 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      ) : (
        <PostForm
          mode="edit"
          postSlug={slug}
          initialValues={initialValues}
        />
      )}
    </div>
  );
}
