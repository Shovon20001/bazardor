"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";
import { toBn } from "@/lib/bn";

type Sort = "default" | "asc" | "desc";

export default function SortedGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<Sort>("default");
  // Prices are numeric (Bengali digits are only used for display), so sorting is by value, never by string.
  const items = useMemo(() => {
    const a = [...products];
    if (sort === "asc") a.sort((x, y) => x.price - y.price);
    if (sort === "desc") a.sort((x, y) => y.price - x.price);
    return a;
  }, [products, sort]);

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-base-content/60">মোট {toBn(items.length)}টি পণ্য দেখানো হচ্ছে</p>
        <label className="flex items-center gap-2 text-sm font-medium">
          সাজান
          <span className="relative">
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}
              className="input !w-auto cursor-pointer appearance-none !pr-9">
              <option value="default">ডিফল্ট</option>
              <option value="asc">দাম: কম থেকে বেশি</option>
              <option value="desc">দাম: বেশি থেকে কম</option>
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" viewBox="0 0 20 20" fill="currentColor"><path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </>
  );
}
