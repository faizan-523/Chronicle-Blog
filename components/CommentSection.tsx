"use client";

import { useState, useRef } from "react";
import { MessageSquare, Send, Loader2, CheckCircle } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  slug: string;
  initialComments: Comment[];
}

function formatCommentDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface FormErrors {
  name?: string;
  email?: string;
  content?: string;
  general?: string;
}

export default function CommentSection({ slug, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Honeypot ref — hidden from real users, filled by bots
  const websiteRef = useRef<HTMLInputElement>(null);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Name is required.";
    else if (name.length > 100) errs.name = "Name must be 100 characters or fewer.";

    if (!email.trim()) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email address.";

    if (!content.trim()) errs.content = "Comment cannot be empty.";
    else if (content.length > 2000) errs.content = "Comment must be 2000 characters or fewer.";

    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
          website: websiteRef.current?.value ?? "", // honeypot
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Surface field-level API errors
        if (data?.details?.fieldErrors) {
          const fe = data.details.fieldErrors as Record<string, string[]>;
          setErrors({
            name: fe.name?.[0],
            email: fe.email?.[0],
            content: fe.content?.[0],
          });
        } else {
          setErrors({ general: data?.error ?? "Something went wrong. Please try again." });
        }
        return;
      }

      // Optimistically append (null means honeypot was tripped — still show success)
      if (data.comment) {
        setComments((prev) => [...prev, data.comment as Comment]);
      }

      setName("");
      setEmail("");
      setContent("");
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-24">
      {/* Divider */}
      <div className="border-t border-gray-100 mb-10" />

      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <MessageSquare className="w-5 h-5 text-violet-500" />
        <h2 className="text-xl font-bold text-gray-900">
          {comments.length === 1
            ? "1 Comment"
            : `${comments.length} Comments`}
        </h2>
      </div>

      {/* Comment list */}
      {comments.length > 0 ? (
        <ul className="space-y-6 mb-12">
          {comments.map((c) => (
            <li
              key={c.id}
              className="flex gap-4"
            >
              {/* Avatar initial */}
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-semibold text-sm select-none">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{c.name}</span>
                  <span className="text-xs text-gray-400">{formatCommentDate(c.createdAt)}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{c.content}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-sm mb-12">
          No comments yet. Be the first to share your thoughts!
        </p>
      )}

      {/* Comment form */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
        <h3 className="text-base font-semibold text-gray-900 mb-5">Leave a comment</h3>

        {submitted && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-5">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            Your comment was posted!
          </div>
        )}

        {errors.general && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Honeypot — hidden from real users */}
          <input
            ref={websiteRef}
            type="text"
            name="website"
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            style={{ position: "absolute", opacity: 0, pointerEvents: "none", height: 0, width: 0 }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label htmlFor="comment-name" className="block text-xs font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
                placeholder="Your name"
                autoComplete="name"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 ${
                  errors.name ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="comment-email" className="block text-xs font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
                <span className="ml-1 text-gray-400 font-normal">(not published)</span>
              </label>
              <input
                id="comment-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 ${
                  errors.email ? "border-red-400" : "border-gray-200"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Content */}
          <div>
            <label htmlFor="comment-content" className="block text-xs font-medium text-gray-700 mb-1">
              Comment <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment-content"
              value={content}
              onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors((p) => ({ ...p, content: undefined })); }}
              placeholder="Share your thoughts…"
              rows={4}
              className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white text-gray-900 placeholder-gray-400 outline-none transition resize-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 ${
                errors.content ? "border-red-400" : "border-gray-200"
              }`}
            />
            <div className="flex justify-between items-start mt-1">
              {errors.content ? (
                <p className="text-xs text-red-500">{errors.content}</p>
              ) : (
                <span />
              )}
              <span className={`text-xs ml-auto ${content.length > 1800 ? "text-amber-500" : "text-gray-400"}`}>
                {content.length}/2000
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="comment-submit-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {loading ? "Posting…" : "Post Comment"}
          </button>
        </form>
      </div>
    </section>
  );
}
