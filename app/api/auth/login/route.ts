import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { LoginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate request body
    const result = LoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    // Find the author by email
    const author = await prisma.author.findUnique({ where: { email } });
    if (!author) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, author.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign and return JWT
    const token = signToken({
      id: author.id,
      email: author.email,
      name: author.name,
    });

    return NextResponse.json({
      token,
      author: {
        id: author.id,
        name: author.name,
        email: author.email,
        avatar: author.avatar,
        bio: author.bio,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
