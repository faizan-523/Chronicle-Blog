import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
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
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">New Post</h1>
        <p className="text-gray-500 text-sm mt-1">Create a new blog article</p>
      </div>

      <PostForm mode="create" />
    </div>
  );
}
