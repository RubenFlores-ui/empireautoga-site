// Single source for SEO text and structured data (used by the build script and the vehicle/sitemap functions).
export const SITE = "https://www.empireautoga.com";
export const PHONE = "+1-678-383-6024";
export const LOGO = "https://dcdws.blob.core.windows.net/dws-9988903-83873-media/sites/83873/2026/10/Empire-Auto-Group-Automotive-Logo.png";
export const BANNER = "https://dcdws.blob.core.windows.net/dws-9988903-83873-media/sites/43198/2023/02/homepage-banner-68.jpg";
export const GOOGLE = "https://maps.google.com/?cid=11119747200892116993";
export const FACEBOOK = "https://www.facebook.com/Empireautogrp";

export const PAGES = {
  home:         { path: "/",                  title: "Used Cars in Cartersville, GA | Empire Auto Group",          desc: "Shop quality used cars, trucks & SUVs at Empire Auto Group in Cartersville, GA. Easy financing, honest pricing. Call (678) 383-6024." },
  inventory:    { path: "/inventory/",        title: "Used Car Inventory in Cartersville, GA | Empire Auto Group",  desc: "Browse our current used cars, trucks and SUVs for sale in Cartersville, GA. All prices include dealer fees. Easy financing available." },
  specials:     { path: "/vehicle-specials/", title: "Used Car Specials in Cartersville, GA | Empire Auto Group",   desc: "See this week's best deals on used cars, trucks and SUVs at Empire Auto Group in Cartersville, GA." },
  apply:        { path: "/apply-online/",     title: "Apply for Car Financing Online | Empire Auto Group",          desc: "Get pre-approved for auto financing in minutes. All credit situations welcome at Empire Auto Group in Cartersville, GA." },
  rental:       { path: "/car-rental/",       title: "Car Rentals in Cartersville, GA | Empire Auto Group",         desc: "Need a rental car in Cartersville? Empire Auto Group offers affordable, reliable rentals. Call (678) 383-6024 to reserve." },
  finder:       { path: "/car-finder/",       title: "Car Finder: We'll Find Your Next Car | Empire Auto Group",    desc: "Tell us what you're looking for and we'll find the right used car for your budget. Empire Auto Group, Cartersville, GA." },
  warranty:     { path: "/warranty/",         title: "Used Car Warranty Options | Empire Auto Group",               desc: "Protect your next used car with warranty coverage from Empire Auto Group in Cartersville, GA. Ask about available plans." },
  about:        { path: "/about-us/",         title: "About Empire Auto Group | Cartersville Used Car Dealer",      desc: "Family-focused used car dealer in Cartersville, GA built on honesty and integrity. Meet the team and see why customers come back." },
  testimonials: { path: "/testimonials/",     title: "Customer Reviews | Empire Auto Group, Cartersville GA",       desc: "Read what real customers say about buying a used car at Empire Auto Group in Cartersville, GA." },
  contact:      { path: "/contact-us/",       title: "Contact & Directions | Empire Auto Group Cartersville",       desc: "Visit us at 305 S Tennessee St, Cartersville, GA 30120. Open by appointment Mon–Fri 10–6:30, Sat 9–12. Call (678) 383-6024 or send a message." },
};

export const DEALER_ID = SITE + "/#dealer";
export function dealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": DEALER_ID,
    name: "Empire Auto Group LLC",
    url: SITE + "/",
    logo: LOGO,
    image: BANNER,
    description: "Used car dealer in Cartersville, GA offering quality used cars, trucks and SUVs with easy auto financing.",
    telephone: PHONE,
    priceRange: "$5,000-$25,000",
    address: { "@type": "PostalAddress", streetAddress: "305 S Tennessee St", addressLocality: "Cartersville", addressRegion: "GA", postalCode: "30120", addressCountry: "US" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "18:30" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "12:00" },
    ],
    areaServed: ["Cartersville GA", "Bartow County GA"],
    knowsLanguage: ["en", "es"],
    hasMap: GOOGLE,
    sameAs: [GOOGLE, FACEBOOK],
  };
}

const escAttr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// JSON inside <script> must not contain "</script>"
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;

export function headTags({ title, desc, url, image = BANNER, noindex = false, jsonld = [] }) {
  return [
    `<title>${escAttr(title)}</title>`,
    `<meta name="description" content="${escAttr(desc)}">`,
    `<link rel="canonical" href="${escAttr(url)}">`,
    noindex ? `<meta name="robots" content="noindex">` : "",
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="Empire Auto Group">`,
    `<meta property="og:title" content="${escAttr(title)}">`,
    `<meta property="og:description" content="${escAttr(desc)}">`,
    `<meta property="og:url" content="${escAttr(url)}">`,
    `<meta property="og:image" content="${escAttr(image)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<script>window.PAGES=${JSON.stringify(PAGES).replace(/</g, "\\u003c")};</script>`,
    ...jsonld.map(ld),
  ].filter(Boolean).join("\n");
}

const DRIVE = [[/4x4|4wd|four/i, "https://schema.org/FourWheelDriveConfiguration"], [/awd|all/i, "https://schema.org/AllWheelDriveConfiguration"],
  [/rwd|rear|4x2.*rear/i, "https://schema.org/RearWheelDriveConfiguration"], [/fwd|front/i, "https://schema.org/FrontWheelDriveConfiguration"]];
// "HONDA" -> "Honda", but keep model codes like CR-V, CX-5, F150, ILX as they are
const KEEP_MAKES = new Set(["BMW", "GMC", "RAM", "MINI"]);
const titleCase = (s) => String(s || "").split(/\s+/).map((w) => {
  const u = w.toUpperCase();
  if (KEEP_MAKES.has(u) || /[0-9-]/.test(w) || (w.length <= 3 && u !== "KIA" && u !== "CAB")) return u;
  return u.charAt(0) + u.slice(1).toLowerCase();
}).join(" ");

export function carJsonLd(c, url) {
  const photos = (c.photos || []).map((p) => (p.startsWith("http") ? p : SITE + p));
  const name = `${c.year} ${titleCase(c.make)} ${titleCase(c.model)}${c.trim ? " " + c.trim : ""}`;
  const car = {
    "@context": "https://schema.org",
    "@type": "Car",
    name,
    url,
    brand: { "@type": "Brand", name: titleCase(c.make) },
    model: titleCase(c.model),
    vehicleModelDate: String(c.year || ""),
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      availability: c.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      url,
      seller: { "@id": DEALER_ID },
      ...(c.price ? { price: c.price } : {}),
    },
  };
  if (photos.length) car.image = photos;
  if (c.trim) car.vehicleConfiguration = c.trim;
  if (c.miles) car.mileageFromOdometer = { "@type": "QuantitativeValue", value: c.miles, unitCode: "SMI" };
  if (c.vin) car.vehicleIdentificationNumber = c.vin;
  if (c.body) car.bodyType = c.body;
  if (c.extColor) car.color = c.extColor;
  if (c.intColor) car.vehicleInteriorColor = c.intColor;
  if (c.transmission) car.vehicleTransmission = c.transmission;
  if (c.fuel) car.fuelType = c.fuel;
  if (c.doors && +c.doors) car.numberOfDoors = +c.doors;
  if (c.engine) car.vehicleEngine = { "@type": "EngineSpecification", name: c.engine };
  const d = DRIVE.find(([re]) => re.test(c.drivetrain || ""));
  if (d) car.driveWheelConfiguration = d[1];
  if (c.description) car.description = c.description;
  return car;
}

export const slugify = (s) => String(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const carPath = (c) => `/inventory/${slugify(c.make)}/${slugify(c.model)}/${encodeURIComponent(String(c.stock || c.id).toLowerCase())}/`;
export { titleCase, escAttr };

// Keep only one page's <main> section, so each URL has one H1 and only its own content.
export function pageHtml(tpl, key, head) {
  let out = tpl.replace(/<main id="page-([a-z]+)" class="page">[\s\S]*?<\/main>\n?/g, (m, k) => (k === key ? m.replace('class="page"', 'class="page active"') : ""));
  return out.replace("<!--SEO-->", head).replace("<body>", `<body data-page="${key}">`);
}
