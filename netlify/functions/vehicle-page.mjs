// Server-rendered vehicle pages: /inventory/<make>/<model>/<stock>/
// Each car gets its own URL with its own title, description, photo preview and Car + Offer structured data.
import TEMPLATE from "../lib/site-template.mjs";
import { loadCars } from "../lib/seed.mjs";
import { SITE, PAGES, headTags, dealerJsonLd, carJsonLd, carPath, titleCase, pageHtml } from "../lib/seo.mjs";

export default async (req, context) => {
  const { stock } = context.params;
  const list = await loadCars();
  const want = decodeURIComponent(stock || "").toLowerCase();
  const car = list.find((c) => String(c.stock || c.id).toLowerCase() === want && c.status !== "sold");

  if (!car) {
    const head = headTags({ title: "Vehicle No Longer Available | Empire Auto Group", desc: PAGES.inventory.desc, url: SITE + "/inventory/", noindex: true, jsonld: [dealerJsonLd()] });
    return new Response(pageHtml(TEMPLATE, "inventory", head), {
      status: 404, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const path = carPath(car);
  const url = SITE + path;
  // send old/wrong-case URLs to the one true address for this car
  if (new URL(req.url).pathname !== path) return Response.redirect(new URL(path, req.url), 301);

  const name = `${car.year} ${titleCase(car.make)} ${titleCase(car.model)}`;
  const bits = [car.trim, car.miles ? car.miles.toLocaleString("en-US") + " miles" : "", car.price ? "$" + car.price.toLocaleString("en-US") : "Call for price"].filter(Boolean).join(", ");
  const desc = `${name} for sale in Cartersville, GA — ${bits}. Easy financing at Empire Auto Group. Call (678) 383-6024.`;
  const img = car.photos?.[0] ? (car.photos[0].startsWith("http") ? car.photos[0] : SITE + car.photos[0]) : undefined;

  const head = headTags({ title: `${name} for Sale in Cartersville, GA | Empire Auto Group`, desc, url, image: img, jsonld: [dealerJsonLd(), carJsonLd(car, url)] });
  return new Response(pageHtml(TEMPLATE, "inventory", head), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=0, must-revalidate" },
  });
};

export const config = { path: ["/inventory/:make/:model/:stock", "/inventory/:make/:model/:stock/"], method: "GET" };
