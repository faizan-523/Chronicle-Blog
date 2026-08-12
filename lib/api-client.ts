import { BlogPost, Author } from "@/types/blog";

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

// ─────────────────────────────────────────────
// Raw API shapes (what the API routes return)
// ─────────────────────────────────────────────

export interface ApiAuthor {
  id: string;
  name: string;
  avatar: string | null;
  bio?: string | null;
}

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

export interface ApiPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: ApiAuthor;
  category: ApiCategory;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

export function calcReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Maps the API post shape to the BlogPost type used by all existing components */
export function apiPostToBlogPost(p: ApiPost): BlogPost {
  const author: Author = {
    name: p.author.name,
    avatar: p.author.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    role: "Author",
  };
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage,
    date: formatDate(p.publishedAt || p.createdAt),
    category: p.category.name,
    author,
    readingTime: calcReadingTime(p.content),
  };
}

// ─────────────────────────────────────────────
// Fetch functions (server-side safe)
// ─────────────────────────────────────────────

export async function fetchPosts(params?: {
  page?: number;
  limit?: number;
  category?: string;
  q?: string;
}): Promise<{ posts: BlogPost[]; pagination: Pagination }> {
  const url = new URL(`${BASE_URL}/api/posts`);
  if (params?.page) url.searchParams.set("page", String(params.page));
  if (params?.limit) url.searchParams.set("limit", String(params.limit));
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.q) url.searchParams.set("q", params.q);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.statusText}`);

  const data: { posts: ApiPost[]; pagination: Pagination } = await res.json();
  return {
    posts: data.posts.map(apiPostToBlogPost),
    pagination: data.pagination,
  };
}

export async function fetchPost(slug: string): Promise<BlogPost> {
  const res = await fetch(`${BASE_URL}/api/posts/${slug}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) throw new Error("Post not found");
  if (!res.ok) throw new Error(`Failed to fetch post: ${res.statusText}`);

  const data: { post: ApiPost } = await res.json();
  return apiPostToBlogPost(data.post);
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${BASE_URL}/api/categories`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch categories: ${res.statusText}`);
  const data: { categories: ApiCategory[] } = await res.json();
  return data.categories;
}
