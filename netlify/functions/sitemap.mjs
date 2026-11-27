// /sitemap.xml — every page plus every vehicle that's for sale, always up to date
import { getStore } from "@netlify/blobs";
import { SEED } from "../lib/seed.mjs";
import { SITE, PAGES, carPath } from "../lib/seo.mjs";

const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async () => {
  const list = (await getStore({ name: "inventory", consistency: "strong" }).get("cars", { type: "json" })) ?? SEED;
  const urls = Object.values(PAGES).map((p) => ({ loc: SITE + p.path, pri: p.path === "/" ? "1.0" : "0.7" }));
  for (const c of list) if (c.status !== "sold") urls.push({ loc: SITE + carPath(c), lastmod: (c.updated || "").slice(0, 10), pri: "0.8" });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${xmlEsc(u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<priority>${u.pri}</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=600" } });
};

export const config = { path: "/sitemap.xml", method: "GET" };
