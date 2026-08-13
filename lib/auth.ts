import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_change_this";
const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Reads the JWT from the httpOnly cookie on the incoming request. */
export async function verifyAuth(req: Request): Promise<JWTPayload> {
  // Prefer httpOnly cookie; fall back to Authorization header for backwards compatibility
  const cookieHeader = req.headers.get("cookie") || "";
  const cookieToken = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  const token = cookieToken || bearerToken;

  if (!token) {
    throw new Error("Unauthorized: No token provided");
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error("Unauthorized: Invalid or expired token");
  }

  return decoded;
}

/** Returns the Set-Cookie header string for setting the httpOnly token cookie. */
export function buildSetCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === "production";
  return [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    `Max-Age=${COOKIE_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
    ...(isProd ? ["Secure"] : []),
  ].join("; ");
}

/** Returns the Set-Cookie header string for clearing the token cookie. */
export function buildClearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}
