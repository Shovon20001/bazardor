import Link from "next/link";
import type { Product } from "@/lib/types";
import { fmtNum } from "@/lib/bn";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/product/${p.id}`} className="group block rounded-2xl border border-base-300 bg-base-100 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-base-200 text-2xl">{p.emoji}</div>
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-tight">{p.name}</h3>
          <p className="text-xs text-base-content/60">{p.unit}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-base-300 pt-3">
        <span className="text-xs text-base-content/60">আজকের দাম</span>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{fmtNum(p.price)} <span className="text-xs font-medium text-base-content/60">টাকা</span></span>
          <ChangeBadge trend={p.trend} change={p.change} />
        </div>
      </div>
    </Link>
  );
}

export function CardSkeleton() {
  return <div className="skeleton h-[138px] w-full" />;
}
