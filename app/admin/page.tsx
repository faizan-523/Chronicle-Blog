"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, LogOut, Loader2, FileText, AlertTriangle } from "lucide-react";
import { ApiPost } from "@/lib/api-client";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const router = useRouter();

  const getCookie = (name: string) => {
    if (typeof document === "undefined") return "";
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : "";
  };

  const fetchDashboardPosts = async () => {
    setIsLoading(true);
    setError("");
    try {
      // Fetch posts (include drafts by reusing /api/posts but note GET /api/posts currently returns published posts only.
      // Wait, does the admin need to see all posts including drafts?
      // Yes! Since we are reusing the existing API, let's see. If the existing GET /api/posts route only filters published: true
      // unless we pass a param?
      // Wait, let's check what the GET /api/posts route does:
      // const where = { published: true, ... }
      // Oh! The existing GET /api/posts route actually only returns published posts!
      // But wait! Is there a way to see draft posts?
      // The user requested: "Fetch posts from the existing API... Reuse the existing API routes and their current request/response formats. Use the existing GET endpoints for fetching posts".
      // So we will just call the existing /api/posts route.
      const res = await fetch("/api/posts?limit=50");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load posts");
      setPosts(data.posts);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred while loading posts.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardPosts();
  }, []);

  const handleLogout = () => {
    // Clear token cookie
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
    router.refresh();
    router.push("/admin/login");
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the post "${title}"?`)) {
      return;
    }

    setIsDeleting(slug);
    try {
      const token = getCookie("token");
      const res = await fetch(`/api/posts/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete post");

      // Remove from state
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
      alert("Post deleted successfully");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "An error occurred while deleting the post.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-grow flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and edit your blog articles</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Post
          </Link>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex-grow flex flex-col">
        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 gap-3 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
            <p className="text-sm font-medium">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
            <AlertTriangle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="font-bold text-gray-900 text-lg">Failed to load posts</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">{error}</p>
            <button
              onClick={fetchDashboardPosts}
              className="mt-6 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Retry
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
            <FileText className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="font-bold text-gray-900 text-lg">No posts found</h3>
            <p className="text-gray-500 text-sm mt-1">Start by creating your first article.</p>
            <Link
              href="/admin/posts/new"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="py-4 px-6 font-semibold text-gray-900 max-w-md truncate">
                      {post.title}
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                        {post.category.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          post.published
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-400">
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <Link
                        href={`/admin/posts/${post.slug}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:text-violet-600 hover:border-violet-200 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        disabled={isDeleting === post.slug}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-red-100 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {isDeleting === post.slug ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
