import { timingSafeEqual, createHash } from "node:crypto";

// The admin password lives in the ADMIN_PASSWORD environment variable (set in Netlify, never in code).
export function isAdmin(req) {
  const expected = Netlify.env.get("ADMIN_PASSWORD");
  const given = req.headers.get("x-admin-password") || "";
  if (!expected) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function denied() {
  // small delay slows down password guessing
  await new Promise((r) => setTimeout(r, 800));
  return Response.json({ error: "Wrong password" }, { status: 401 });
}
