import type { Category, Product, Trend } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "chal", name: "চাল", emoji: "🍚" },
  { slug: "dal", name: "ডাল", emoji: "🫘" },
  { slug: "tel", name: "তেল", emoji: "🛢️" },
  { slug: "sobji", name: "সবজি", emoji: "🥬" },
  { slug: "mach", name: "মাছ", emoji: "🐟" },
  { slug: "mangsho", name: "মাংস", emoji: "🍗" },
  { slug: "dim-dudh", name: "ডিম-দুধ", emoji: "🥛" },
  { slug: "moshla", name: "মসলা", emoji: "🌶️" },
];

const MARKETS: [string, string][] = [
  ["মাঠ বাজার", "ময়মনসিংহ"], ["সদর বাজার", "রাজশাহী"], ["বাজারহাট", "খুলনা"],
  ["বাসারহাট বাজার", "রাজশাহী"], ["চৌর বাজার", "ময়মনসিংহ"], ["আমতলী বাজার", "চট্টগ্রাম"],
  ["ডবলগেট বাজার", "খুলনা"], ["চৌরাস্তা বাজার", "সিলেট"], ["গ্রীন মার্কেট, মিরপুর", "ঢাকা"],
  ["চৌদগ্রাম বাজার", "চট্টগ্রাম"], ["আমবাজার", "সিলেট"], ["কারওয়ান বাজার", "ঢাকা"],
];
const MIN_R = [59, 60, 60, 60, 60, 61, 62, 63, 64, 63, 64, 65].map((x) => x / 66);
const MAX_R = [65, 66, 67, 68, 69, 69, 69, 71, 71, 73, 73, 73].map((x) => x / 66);

// [name, emoji, unit, price, change %, trend, category]
type Row = [string, string, string, number, number, Trend, string];
const U = { kg: "প্রতি কেজি", l: "প্রতি লিটার", d: "প্রতি ডজন", p: "প্রতি পিস" };
const ROWS: Row[] = [
  ["স্বর্ণমাছি চাল", "🍚", U.kg, 148, 2.1, "up", "chal"],
  ["মিনিকেট চাল", "🍚", U.kg, 99, 2.9, "down", "chal"],
  ["নাজির চাল", "🍚", U.kg, 74, 0, "flat", "chal"],
  ["বাটাম সাইজ চাল", "🍚", U.kg, 66, 3.1, "up", "chal"],
  ["মসুর ডাল", "🫘", U.kg, 142, 2.9, "up", "dal"],
  ["মুগ ডাল", "🫘", U.kg, 135, 0, "flat", "dal"],
  ["ছোলা", "🫘", U.kg, 120, 2.4, "down", "dal"],
  ["আমন ডাল (খোসাসিলা)", "🫘", U.kg, 156, 2.6, "up", "dal"],
  ["সরিষার তেল", "🫙", U.l, 192, 2.1, "up", "tel"],
  ["পাম তেল", "🛢️", U.kg, 168, 2.3, "down", "tel"],
  ["ঘানি ভাঙা সরিষার তেল", "🫙", U.l, 215, 2.4, "up", "tel"],
  ["আলু", "🥔", U.kg, 30, 6.2, "down", "sobji"],
  ["পেঁয়াজ", "🧅", U.kg, 54, 12.5, "up", "sobji"],
  ["কাঁচামরিচ", "🌶️", U.kg, 92, 12.4, "down", "sobji"],
  ["বেগুন", "🍆", U.kg, 44, 4.8, "up", "sobji"],
  ["ঢেঁড়স", "🟢", U.kg, 38, 0, "flat", "sobji"],
  ["রুই মাছ", "🐟", U.kg, 46, 4.5, "up", "mach"],
  ["তেলাপিয়া", "🐟", U.kg, 36, 0, "flat", "mach"],
  ["ইলিশ মাছ", "🐠", U.kg, 1850, 3.4, "up", "mach"],
  ["কাতলা মাছ", "🐠", U.kg, 43, 4.4, "down", "mach"],
  ["চিংড়ি মাছ (খোলা)", "🦐", U.kg, 330, 3.1, "up", "mach"],
  ["মুরগির মাংস", "🍗", U.kg, 225, 1.3, "down", "mangsho"],
  ["গরুর মাংস", "🥩", U.kg, 790, 1.2, "down", "mangsho"],
  ["খাসির মাংস", "🍖", U.kg, 1290, 3.0, "down", "mangsho"],
  ["হাঁসের মাংস", "🦆", U.kg, 285, 3.4, "down", "mangsho"],
  ["ডিম", "🥚", U.d, 158, 3.9, "up", "dim-dudh"],
  ["দুধ", "🥛", U.l, 102, 2.0, "up", "dim-dudh"],
  ["দই", "🥣", U.l, 92, 0, "flat", "dim-dudh"],
  ["মাখন (১০০ গ্রাম)", "🧈", U.p, 145, 3.6, "up", "dim-dudh"],
  ["আদা", "🫚", U.kg, 85, 9.0, "up", "moshla"],
  ["রসুন", "🧄", U.kg, 125, 7.4, "down", "moshla"],
  ["মরিচ গুঁড়া", "🌶️", U.kg, 245, 2.0, "down", "moshla"],
  ["ধনেপাতা গুঁড়া", "🍃", U.kg, 265, 0, "flat", "moshla"],
];

export const FALLBACK_PRODUCTS: Product[] = ROWS.map(([name, emoji, unit, price, change, trend, category], i) => {
  const cat = CATEGORIES.find((c) => c.slug === category)!;
  return {
    id: String(i + 1), name, emoji, unit, price, change, trend, category,
    categoryName: cat.name,
    description: `${name}-এর আজকের বাজারভিত্তিক দাম, সর্বনিম্ন-সর্বাধিক ও গড় দাম।`,
    markets: MARKETS.map(([market, division], k) => {
      const min = Math.round(price * MIN_R[k]);
      const max = Math.round(price * MAX_R[k]);
      return { market, division, min, max, avg: (min + max) / 2 };
    }),
  };
});
