import Link from "next/link";

interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const getColors = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "technology":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";
      case "design":
        return "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100";
      case "lifestyle":
        return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
  };

  const slug = category.toLowerCase();

  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${getColors(
        category
      )}`}
    >
      {category}
    </Link>
  );
}
