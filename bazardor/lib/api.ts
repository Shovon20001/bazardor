import type { Category, MarketPrice, Product, Trend } from "./types";
import { CATEGORIES, FALLBACK_PRODUCTS } from "./fallback";
import { parseBn } from "./bn";

const BASES = [
  "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function getJson(path: string): Promise<unknown | null> {
  for (const base of BASES) {
    try {
      const res = await fetch(base + path, { next: { revalidate: 300 } });
      if (res.ok) return await res.json();
    } catch { /* try next base */ }
  }
  return null;
}

/* ---- tolerant normalisers: the API may wrap data and name fields differently ---- */
type Raw = Record<string, any>;
const pick = (o: Raw, keys: string[], d?: any) => {
  for (const k of keys) if (o?.[k] !== undefined && o?.[k] !== null && o?.[k] !== "") return o[k];
  return d;
};
const list = (j: any): Raw[] => {
  if (Array.isArray(j)) return j;
  if (j && typeof j === "object") {
    for (const k of ["data", "products", "categories", "items", "result"]) if (Array.isArray(j[k])) return j[k];
  }
  return [];
};
const one = (j: any): Raw | null => {
  if (!j || Array.isArray(j)) return null;
  const inner = pick(j, ["data", "product", "category", "result"]);
  return inner && !Array.isArray(inner) ? inner : j;
};

const UNITS: Record<string, string> = {
  kg: "প্রতি কেজি", kilogram: "প্রতি কেজি", liter: "প্রতি লিটার", litre: "প্রতি লিটার", l: "প্রতি লিটার",
  dozen: "প্রতি ডজন", piece: "প্রতি পিস", pcs: "প্রতি পিস", pc: "প্রতি পিস", hali: "প্রতি হালি", gram: "প্রতি গ্রাম", g: "প্রতি গ্রাম",
};
const bnUnit = (u: string) => (u.includes("প্রতি") ? u : UNITS[u.toLowerCase()] ?? `প্রতি ${u}`);

export function toProduct(r: Raw): Product {
  const price = parseBn(pick(r, ["today", "price", "today_price", "current_price", "todayPrice"], 0));
  // change may be a number, or an object like { dir: "up", pct: 2.1 }
  const ch = r.change && typeof r.change === "object" ? r.change : null;
  const pct = parseBn(ch ? pick(ch, ["pct", "percent", "value"], 0) : pick(r, ["change", "change_percent", "percent", "percentage"], 0));
  const dir = String(ch ? pick(ch, ["dir", "direction", "trend"], "") : pick(r, ["trend", "direction", "dir"], "")).toLowerCase();
  const trend: Trend = /up|rise|inc|▲/.test(dir) ? "up" : /down|fall|dec|▼/.test(dir) ? "down" : !dir && pct > 0 ? "up" : !dir && pct < 0 ? "down" : "flat";
  const change = trend === "flat" ? 0 : Math.abs(pct);
  const category = String(pick(r, ["category", "category_slug", "categorySlug"], ""));
  const rawMarkets: Raw[] = pick(r, ["markets", "market_prices", "marketPrices"], []) || [];
  const markets: MarketPrice[] = rawMarkets.map((m) => {
    const min = parseBn(pick(m, ["min", "min_price", "lowest"], 0));
    const max = parseBn(pick(m, ["max", "max_price", "highest"], 0));
    return {
      market: String(pick(m, ["market", "name"], "")), division: String(pick(m, ["division", "district", "region"], "")),
      min, max, avg: parseBn(pick(m, ["avg", "average"], (min + max) / 2)),
    };
  });
  const cat = CATEGORIES.find((c) => c.slug === category);
  const y = pick(r, ["yesterday"]);
  return {
    id: String(pick(r, ["id", "_id", "slug"], "")),
    name: String(pick(r, ["nameBn", "name", "title", "name_bn"], "")),
    emoji: String(pick(r, ["image", "emoji", "icon"], "🛒")),
    unit: bnUnit(String(pick(r, ["unit"], "kg"))),
    price, change, trend, category,
    categoryName: String(pick(r, ["categoryNameBn", "category_name", "categoryName"], cat?.name ?? category)),
    categoryEmoji: String(pick(r, ["categoryIcon"], cat?.emoji ?? "🛒")),
    yesterday: y !== undefined ? parseBn(y) : undefined,
    description: pick(r, ["description", "summary"]),
    markets,
  };
}

function toCategory(r: Raw): Category {
  return {
    slug: String(pick(r, ["slug", "id", "key"], "")),
    name: String(pick(r, ["nameBn", "name", "title", "name_bn"], "")),
    emoji: String(pick(r, ["icon", "emoji", "categoryIcon"], "🛒")),
  };
}

/** Build the category list from products when the categories endpoint gives nothing usable. */
function deriveCategories(products: Product[]): Category[] {
  const seen = new Map<string, Category>();
  for (const p of products) if (p.category && !seen.has(p.category)) seen.set(p.category, { slug: p.category, name: p.categoryName, emoji: p.categoryEmoji ?? "🛒" });
  return [...seen.values()];
}

export async function getProducts(category?: string): Promise<Product[]> {
  const j = await getJson(category ? `/products?category=${encodeURIComponent(category)}` : "/products");
  const items = list(j).map(toProduct).filter((p) => p.name);
  if (items.length) return items;
  return category ? FALLBACK_PRODUCTS.filter((p) => p.category === category) : FALLBACK_PRODUCTS;
}

export async function getProduct(id: string): Promise<Product | null> {
  const j = await getJson(`/products/${encodeURIComponent(id)}`);
  const r = one(j);
  if (r && pick(r, ["name", "title", "name_bn"])) {
    const p = toProduct(r);
    if (!p.markets.length) {
      const fb = FALLBACK_PRODUCTS.find((x) => x.name === p.name);
      if (fb) p.markets = fb.markets;
    }
    return p;
  }
  return FALLBACK_PRODUCTS.find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<Category[]> {
  const items = list(await getJson("/categories")).map(toCategory).filter((c) => c.slug && c.name);
  if (items.length) return items;
  const derived = deriveCategories(await getProducts());
  return derived.length ? derived : CATEGORIES;
}

export async function getCategory(slug: string): Promise<Category | null> {
  const r = one(await getJson(`/categories/${encodeURIComponent(slug)}`));
  if (r && pick(r, ["nameBn", "name", "title", "name_bn"])) return toCategory({ slug, ...r });
  return (await getCategories()).find((c) => c.slug === slug) ?? null;
}
