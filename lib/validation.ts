import { z } from "zod";

// --- Auth ---
export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// --- Post Creation ---
export const PostCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  content: z.string().min(1, "Content is required"),
  coverImage: z.string().url("Cover image must be a valid URL"),
  categoryId: z.string().uuid("Category ID must be a valid UUID"),
  tags: z.array(z.string()).optional().default([]),
  published: z.boolean().optional().default(false),
  publishedAt: z.string().datetime().optional().nullable(),
});

// --- Post Update (all fields optional) ---
export const PostUpdateSchema = PostCreateSchema.partial();

// --- Guest Comment ---
export const CommentCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  email: z.string().email("Invalid email address").max(254),
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must be 2000 characters or fewer"),
  // Honeypot: bots fill this in, humans leave it blank
  website: z.string().max(0, "Spam detected").optional(),
});

// TypeScript inferred types
export type LoginInput = z.infer<typeof LoginSchema>;
export type PostCreateInput = z.infer<typeof PostCreateSchema>;
export type PostUpdateInput = z.infer<typeof PostUpdateSchema>;
export type CommentCreateInput = z.infer<typeof CommentCreateSchema>;
