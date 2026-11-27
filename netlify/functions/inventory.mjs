// /api/inventory
//   GET  -> public list of vehicles (sold ones left out unless ?all=1 with the admin password)
//   PUT  -> admin saves the whole list
import { getStore } from "@netlify/blobs";
import { isAdmin, denied } from "../lib/auth.mjs";
import { loadCars } from "../lib/seed.mjs";

const store = () => getStore({ name: "inventory", consistency: "strong" });

const STR = ["id", "vin", "make", "model", "trim", "body", "stock", "extColor", "intColor", "engine", "drivetrain", "transmission", "fuel", "doors", "description", "video", "status", "carfaxUrl", "carfaxValue"];
const STATUS = ["available", "pending", "sold"];

function clean(list) {
  if (!Array.isArray(list)) throw new Error("Expected a list of vehicles");
  if (list.length > 500) throw new Error("Too many vehicles");
  return list.map((c) => {
    const out = {};
    for (const k of STR) out[k] = String(c[k] ?? "").slice(0, k === "description" ? 4000 : 400);
    out.year = Number.parseInt(c.year, 10) || null;
    const num = (v) => { const n = Math.round(Number(String(v ?? "").replace(/[^0-9.]/g, ""))); return n > 0 ? n : null; };
    out.price = num(c.price);
    out.miles = num(c.miles);
    out.featured = Boolean(c.featured);
    out.photos = (Array.isArray(c.photos) ? c.photos : []).map(String).slice(0, 40);
    if (!STATUS.includes(out.status)) out.status = "available";
    if (!/^https:\/\/(www\.)?carfax\.com\//i.test(out.carfaxUrl)) out.carfaxUrl = "";
    if (!["", "great", "good", "fair", "1own_great", "1own_good", "1own_fair"].includes(out.carfaxValue)) out.carfaxValue = "";
    if (!out.id) out.id = crypto.randomUUID();
    out.updated = c.updated || new Date().toISOString();
    return out;
  });
}

export default async (req) => {
  const s = store();

  if (req.method === "GET") {
    const all = new URL(req.url).searchParams.get("all") === "1";
    if (all && !isAdmin(req)) return denied();
    const list = await loadCars();
    const out = all ? list : list.filter((c) => c.status !== "sold");
    return Response.json(out, { headers: { "Cache-Control": "no-store" } });
  }

  if (req.method === "PUT") {
    if (!isAdmin(req)) return denied();
    try {
      const list = clean(await req.json());
      await s.setJSON("cars", list);
      return Response.json({ ok: true, count: list.length });
    } catch (e) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/inventory", method: ["GET", "PUT"] };
