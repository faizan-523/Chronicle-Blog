import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    // Retain other params if any, or construct simple page param
    const url = new URL(baseUrl, "http://dummy.com");
    url.searchParams.set("page", page.toString());
    return `${url.pathname}${url.search}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-center space-x-2 mt-12" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
          aria-hidden="true"
        >
          <ChevronLeft className="w-5 h-5" />
        </span>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page) => {
        const isCurrent = page === currentPage;
        return isCurrent ? (
          <span
            key={page}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 text-white font-semibold text-sm shadow-sm"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={createPageUrl(page)}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            {page}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <span
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
          aria-hidden="true"
        >
          <ChevronRight className="w-5 h-5" />
        </span>
      )}
    </nav>
  );
}
