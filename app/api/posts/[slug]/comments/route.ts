import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { CommentCreateSchema } from "@/lib/validation";

interface RouteContext {
  params: { slug: string };
}

// GET /api/posts/[slug]/comments — public, chronological, email never returned
export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug, published: true },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        content: true,
        createdAt: true,
        // email deliberately excluded
      },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Comments fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/posts/[slug]/comments — public, no auth required
export async function POST(req: Request, { params }: RouteContext) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: params.slug, published: true },
      select: { id: true },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await req.json();
    const result = CommentCreateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    // Honeypot check — if `website` has any value, silently discard
    if (result.data.website) {
      // Return a fake 201 so bots don't know they were blocked
      return NextResponse.json({ comment: null }, { status: 201 });
    }

    const { name, email, content } = result.data;

    const comment = await prisma.comment.create({
      data: { postId: post.id, name, email, content },
      select: { id: true, name: true, content: true, createdAt: true },
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Comment create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
