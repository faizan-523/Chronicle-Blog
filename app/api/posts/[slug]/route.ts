import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { PostUpdateSchema } from "@/lib/validation";

const postInclude = {
  author: { select: { id: true, name: true, avatar: true, bio: true } },
  category: { select: { id: true, name: true, slug: true } },
} as const;

interface RouteContext {
  params: { slug: string };
}

// GET /api/posts/[slug] — public (published only) OR authenticated (any status)
export async function GET(req: Request, { params }: RouteContext) {
  try {
    // Check if the requester is authenticated (admin fetching draft)
    let isAuthenticated = false;
    try {
      await verifyAuth(req);
      isAuthenticated = true;
    } catch {
      // Not authenticated — public access
    }

    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      include: postInclude,
    });

    if (!post || (!post.published && !isAuthenticated)) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error("Post fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/posts/[slug] — protected
export async function PUT(req: Request, { params }: RouteContext) {
  try {
    await verifyAuth(req);

    const post = await prisma.post.findUnique({ where: { slug: params.slug } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = PostUpdateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { publishedAt, ...rest } = result.data;

    // If slug is being changed, check uniqueness
    if (rest.slug && rest.slug !== params.slug) {
      const existing = await prisma.post.findUnique({ where: { slug: rest.slug } });
      if (existing) {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.post.update({
      where: { slug: params.slug },
      data: {
        ...rest,
        ...(publishedAt !== undefined && {
          publishedAt: publishedAt ? new Date(publishedAt) : null,
        }),
        // Auto-set publishedAt when publishing for the first time
        ...(rest.published && !post.publishedAt && !publishedAt && {
          publishedAt: new Date(),
        }),
      },
      include: postInclude,
    });

    return NextResponse.json({ post: updated });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Post update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/posts/[slug] — protected
export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    await verifyAuth(req);

    const post = await prisma.post.findUnique({ where: { slug: params.slug } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { slug: params.slug } });

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith("Unauthorized")) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("Post delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
