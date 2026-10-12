export type Trend = "up" | "down" | "flat";
export interface MarketPrice { market: string; division: string; min: number; max: number; avg: number }
export interface Product {
  id: string; name: string; emoji: string; unit: string; price: number;
  change: number; trend: Trend; category: string; categoryName: string; categoryEmoji?: string; yesterday?: number;
  description?: string; markets: MarketPrice[];
}
export interface Category { slug: string; name: string; emoji: string }
