// POST /api/login  -> checks the admin password and returns the (non-secret) video upload settings
import { isAdmin, denied } from "../lib/auth.mjs";

export default async (req) => {
  if (!Netlify.env.get("ADMIN_PASSWORD")) {
    return Response.json({ error: "The admin password has not been set up in Netlify yet." }, { status: 503 });
  }
  if (!isAdmin(req)) return denied();
  return Response.json({
    ok: true,
    cloudinaryCloud: Netlify.env.get("CLOUDINARY_CLOUD_NAME") || "",
    cloudinaryPreset: Netlify.env.get("CLOUDINARY_UPLOAD_PRESET") || "",
  });
};

export const config = { path: "/api/login", method: "POST" };
