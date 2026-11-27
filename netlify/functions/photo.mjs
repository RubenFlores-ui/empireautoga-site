// POST /api/photo  (admin)  body = image file  -> { url: "/img/<key>" }
// GET  /img/<key>  (public) -> the image
// DELETE /api/photo?key=<key> (admin)
import { getStore } from "@netlify/blobs";
import { isAdmin, denied } from "../lib/auth.mjs";

const TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX = 4 * 1024 * 1024; // the admin page shrinks photos well under this before upload

export default async (req, context) => {
  const s = getStore("photos");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const key = context.params.key;
    if (!key || !/^[a-z0-9-]+$/i.test(key)) return new Response("Not found", { status: 404 });
    const entry = await s.getWithMetadata(key, { type: "arrayBuffer" });
    if (entry === null) return new Response("Not found", { status: 404 });
    return new Response(entry.data, {
      headers: {
        "Content-Type": entry.metadata?.type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

  if (!isAdmin(req)) return denied();

  if (req.method === "POST") {
    const type = (req.headers.get("content-type") || "").split(";")[0];
    if (!TYPES.includes(type)) return Response.json({ error: "Photos must be JPG, PNG or WebP" }, { status: 400 });
    const body = await req.arrayBuffer();
    if (body.byteLength > MAX) return Response.json({ error: "Photo too large" }, { status: 413 });
    const key = crypto.randomUUID();
    await s.set(key, body, { metadata: { type, uploaded: new Date().toISOString() } });
    return Response.json({ url: `/img/${key}` });
  }

  if (req.method === "DELETE") {
    const key = url.searchParams.get("key") || "";
    if (!/^[a-z0-9-]+$/i.test(key)) return Response.json({ error: "Bad key" }, { status: 400 });
    await s.delete(key);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: ["/api/photo", "/img/:key"] };
