import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://chronicle-blog.com";

  // Static pages
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
  ];

  // Dynamic published post pages
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt || new Date(),
  }));

  // Dynamic category pages
  const categories = await prisma.category.findMany({
    select: { slug: true },
  });

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/category/${cat.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...postUrls, ...categoryUrls];
}
