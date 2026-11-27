// Builds one HTML file per page (each with its own SEO title, description, canonical URL and
// social-share tags) from src/site.html, and writes the same template for the vehicle-page function.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { SITE, PAGES, dealerJsonLd, headTags, pageHtml } from "../netlify/lib/seo.mjs";

const tpl = readFileSync(new URL("../src/site.html", import.meta.url), "utf8");
if (!tpl.includes("<!--SEO-->")) throw new Error("src/site.html is missing the <!--SEO--> marker");

for (const [key, page] of Object.entries(PAGES)) {
  const head = headTags({ title: page.title, desc: page.desc, url: SITE + page.path, jsonld: [dealerJsonLd()] });
  const html = pageHtml(tpl, key, head);
  const dir = new URL(`../public${page.path}`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL("index.html", dir), html);
  console.log("built", page.path);
}

// 404 page
writeFileSync(new URL("../public/404.html", import.meta.url),
  pageHtml(tpl, "notfound", headTags({ title: "Page Not Found | Empire Auto Group", desc: PAGES.home.desc, url: SITE + "/", noindex: true, jsonld: [dealerJsonLd()] }))
    .replace("<footer>", '<main class="page active"><div class="page-head"><h1>Page Not Found</h1><div class="crumbs"><a href="/">Home</a></div></div><section><div class="wrap" style="text-align:center"><p style="margin-bottom:20px">Sorry, that page doesn\'t exist. It may have moved.</p><a class="btn" href="/inventory/">View Inventory</a></div></section></main>\n<footer>'));

// template for the server-rendered vehicle pages
writeFileSync(new URL("../netlify/lib/site-template.mjs", import.meta.url), "export default " + JSON.stringify(tpl) + ";\n");
console.log("built vehicle template");
