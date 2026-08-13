import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this";

// Helper to decode Base64Url to Uint8Array
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (base64.length % 4)) % 4;
  const padded = base64 + "=".repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Native Edge-compatible JWT verification
async function verifyJwtEdge(token: string): Promise<{ role: string } | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode and parse payload
    const payloadStr = atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(payloadStr);

    // Verify expiration time (exp)
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }

    // Verify signature using Web Crypto HMAC-SHA256
    const encoder = new TextEncoder();
    const keyData = encoder.encode(JWT_SECRET);
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const dataBuffer = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBuffer = base64UrlToUint8Array(signatureB64);

    const isValid = await crypto.subtle.verify(
      "HMAC",
      cryptoKey,
      signatureBuffer.buffer as ArrayBuffer,
      dataBuffer
    );

    return isValid ? payload : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    let verifiedPayload = null;
    if (token) {
      verifiedPayload = await verifyJwtEdge(token);
    }

    const isAuthenticated = !!verifiedPayload && verifiedPayload.role === "ADMIN";

    // Accessing login page
    if (pathname === "/admin/login") {
      if (isAuthenticated) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    // Accessing any other admin page
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
