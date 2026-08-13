"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Eye, Edit3, Loader2, Save } from "lucide-react";
import { ApiCategory } from "@/lib/api-client";

export interface PostFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tags: string; // comma-separated string, split on submit
  published: boolean;
}

interface PostFormProps {
  initialValues?: Partial<PostFormValues>;
  mode: "create" | "edit";
  postSlug?: string; // only needed for edit mode
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function PostForm({ initialValues, mode, postSlug }: PostFormProps) {
  const router = useRouter();

  const [values, setValues] = useState<PostFormValues>({
    title: initialValues?.title || "",
    slug: initialValues?.slug || "",
    excerpt: initialValues?.excerpt || "",
    content: initialValues?.content || "",
    coverImage: initialValues?.coverImage || "",
    categoryId: initialValues?.categoryId || "",
    tags: initialValues?.tags || "",
    published: initialValues?.published ?? false,
  });

  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isCatLoading, setIsCatLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialValues?.slug);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories || []);
        // Only set default categoryId if none is currently selected
        setValues((prev) => ({
          ...prev,
          categoryId: prev.categoryId || (d.categories?.[0]?.id ?? ""),
        }));
      })
      .catch(() => {})
      .finally(() => setIsCatLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValues((v) => ({
      ...v,
      title,
      slug: slugManuallyEdited ? v.slug : slugify(title),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true);
    setValues((v) => ({ ...v, slug: e.target.value }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setValues((v) => ({ ...v, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    const payload = {
      title: values.title,
      slug: values.slug,
      excerpt: values.excerpt,
      content: values.content,
      coverImage: values.coverImage,
      categoryId: values.categoryId,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      published: values.published,
    };

    try {
      const url = mode === "create" ? "/api/posts" : `/api/posts/${postSlug}`;
      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        const details = data.details?.fieldErrors
          ? Object.entries(data.details.fieldErrors)
              .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
              .join("; ")
          : data.error || "Request failed";
        throw new Error(details);
      }

      setNotification({ type: "success", msg: mode === "create" ? "Post created!" : "Post updated!" });
      setTimeout(() => router.push("/admin"), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred";
      setNotification({ type: "error", msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Notification */}
      {notification && (
        <div
          className={`p-4 rounded-2xl text-sm font-medium border ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {notification.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column — main fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              required
              value={values.title}
              onChange={handleTitleChange}
              placeholder="Post title"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
            <input
              type="text"
              name="slug"
              required
              value={values.slug}
              onChange={handleSlugChange}
              placeholder="my-post-slug"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            />
            <p className="mt-1 text-xs text-gray-400">Auto-generated from title. Lowercase letters, numbers, and hyphens only.</p>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt *</label>
            <textarea
              name="excerpt"
              required
              rows={3}
              value={values.excerpt}
              onChange={handleChange}
              placeholder="A short summary of the post..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white resize-none"
            />
          </div>

          {/* Content — Markdown Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Content *</label>
              <div className="flex rounded-xl overflow-hidden border border-gray-200">
                <button
                  type="button"
                  onClick={() => setPreviewMode(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                    !previewMode
                      ? "bg-violet-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold transition-colors ${
                    previewMode
                      ? "bg-violet-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
              </div>
            </div>
            {previewMode ? (
              <div className="min-h-[300px] w-full p-5 border border-gray-200 rounded-xl bg-white prose overflow-auto">
                {values.content ? (
                  <ReactMarkdown>{values.content}</ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">Nothing to preview.</p>
                )}
              </div>
            ) : (
              <textarea
                name="content"
                required
                rows={16}
                value={values.content}
                onChange={handleChange}
                placeholder="Write your post in Markdown..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white resize-y"
              />
            )}
          </div>
        </div>

        {/* Right column — meta fields */}
        <div className="space-y-6">
          {/* Published toggle */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Publish Settings</h3>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  name="published"
                  checked={values.published}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-violet-600 transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {values.published ? "Published" : "Draft"}
              </span>
            </label>
          </div>

          {/* Category */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Category *</label>
            {isCatLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading categories...
              </div>
            ) : (
              <select
                name="categoryId"
                required
                value={values.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Cover image URL */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Cover Image URL *</label>
            <input
              type="url"
              name="coverImage"
              required
              value={values.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            />
            {values.coverImage && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mt-3 bg-gray-100 border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={values.coverImage}
                  alt="Cover preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Tags</label>
            <input
              type="text"
              name="tags"
              value={values.tags}
              onChange={handleChange}
              placeholder="AI, React, Design"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
            />
            <p className="mt-1.5 text-xs text-gray-400">Comma-separated list of tags</p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Post"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
