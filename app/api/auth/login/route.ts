import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken, buildSetCookieHeader } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body with Zod
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Look up author by email
    const author = await prisma.author.findUnique({ where: { email } });
    if (!author) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Only ADMIN role can access the dashboard
    if (author.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Verify bcrypt password hash
    const isValidPassword = await bcrypt.compare(password, author.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Sign JWT containing role
    const token = signToken({
      id: author.id,
      email: author.email,
      name: author.name,
      role: author.role,
    });

    // Return token in an httpOnly cookie — never exposed to JavaScript
    const res = NextResponse.json({
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        avatar: author.avatar,
        bio: author.bio,
        role: author.role,
      },
    });

    res.headers.set("Set-Cookie", buildSetCookieHeader(token));
    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
