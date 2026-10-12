import type { Product } from "@/lib/types";
import { fmtNum, fmtPct } from "@/lib/bn";

export default function Ticker({ products }: { products: Product[] }) {
  const items = products.slice(0, 40);
  const row = (suffix: string) =>
    items.map((p) => {
      const color = p.trend === "up" ? "text-success" : p.trend === "down" ? "text-error" : "text-base-content/50";
      const sym = p.trend === "up" ? "▲" : p.trend === "down" ? "▼" : "—";
      return (
        <span key={p.id + suffix} className="flex items-center gap-1.5 whitespace-nowrap px-5 text-[13px]">
          <span>{p.emoji}</span>
          <span className="font-medium">{p.name}</span>
          <span className="text-base-content/70">{fmtNum(p.price)} টাকা/{p.unit.replace("প্রতি ", "")}</span>
          <span className={`font-semibold ${color}`}>{sym} {fmtPct(p.trend === "flat" ? 0 : p.change)}%</span>
        </span>
      );
    });
  return (
    <div className="ticker overflow-hidden border-b border-base-300 bg-base-100" aria-label="দামের টিকার">
      <div className="ticker-track flex w-max animate-marquee py-2">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
