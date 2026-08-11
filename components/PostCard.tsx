import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types/blog";
import CategoryBadge from "./CategoryBadge";

interface PostCardProps {
  post: BlogPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-gray-50">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          priority={post.featured}
        />
      </Link>
      
      <div className="flex-1 flex flex-col p-6">
        <div className="mb-3">
          <CategoryBadge category={post.category} />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-violet-600 transition-colors duration-200">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
          {post.excerpt}
        </p>
        
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-[10px] text-gray-500">{post.author.role}</p>
            </div>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] font-medium text-gray-400">{post.date}</p>
            <p className="text-[10px] font-semibold text-violet-600 mt-0.5">{post.readingTime}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
