export interface Author {
  name: string;
  avatar: string;
  role: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown formatted content
  coverImage: string;
  date: string;
  category: string;
  author: Author;
  readingTime: string;
  featured?: boolean;
}
