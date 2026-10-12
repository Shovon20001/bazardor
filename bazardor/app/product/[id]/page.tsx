import Link from "next/link";
import { notFound } from "next/navigation";
import ChangeBadge from "@/components/ChangeBadge";
import { getProduct } from "@/lib/api";
import { fmtNum, toBn } from "@/lib/bn";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = await getProduct(id);
  if (!p) notFound();

  const unit = p.unit.replace("প্রতি ", "");
  const prev = p.price / (1 + (p.trend === "up" ? p.change : p.trend === "down" ? -p.change : 0) / 100);
  const delta = Math.round(Math.abs(p.price - (p.yesterday ?? prev)));
  const m = p.markets;
  const minM = m.length ? m.reduce((a, b) => (b.min < a.min ? b : a)) : null;
  const maxM = m.length ? m.reduce((a, b) => (b.max > a.max ? b : a)) : null;
  const min = minM?.min ?? p.price, max = maxM?.max ?? p.price;
  const avg = m.length ? Math.round(m.reduce((s, x) => s + x.avg, 0) / m.length) : p.price;
  const word = p.trend === "up" ? "বেড়েছে" : p.trend === "down" ? "কমেছে" : "অপরিবর্তিত";
  const wordCls = p.trend === "up" ? "text-success" : p.trend === "down" ? "text-error" : "text-base-content/60";

  const stat = (label: string, v: number, sub: string) => (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className="mt-1 text-3xl font-bold">{fmtNum(v)} <span className="text-base font-medium text-base-content/60">টাকা</span></p>
      <p className="mt-1 text-xs text-base-content/60">{sub}</p>
    </div>
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6">
      <nav className="text-sm text-base-content/60">
        <Link href="/" className="hover:text-primary">হোম</Link> / <Link href={`/category/${p.category}`} className="hover:text-primary">{p.categoryName}</Link> / <span className="text-base-content">{p.name}</span>
      </nav>

      <section className="flex flex-col justify-between gap-5 rounded-3xl border border-base-300 bg-base-100 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-base-200 text-4xl">{p.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold">{p.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-base-content/70">
              <span>{p.unit}</span><span>·</span>
              <span className="rounded-full bg-base-200 px-2 py-0.5">{p.categoryName}</span>
            </div>
            <p className="mt-2 text-sm">গতকালের তুলনায় আজ দাম <b className={wordCls}>{word}</b>{delta ? ` · ${toBn(delta)} টাকা` : ""}</p>
            {p.description && <p className="mt-1 text-sm text-base-content/60">{p.description}</p>}
          </div>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-base-content/60">আজকের দাম</p>
          <p className="text-4xl font-bold">{fmtNum(p.price)} <span className="text-base font-medium text-base-content/60">টাকা / {unit}</span></p>
          <div className="mt-1"><ChangeBadge trend={p.trend} change={p.change} /></div>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {stat("সর্বনিম্ন দাম", min, minM ? `সবচেয়ে কম দামের বাজার: ${minM.market}` : "সবচেয়ে কম দামের বাজার")}
          {stat("সর্বাধিক দাম", max, maxM ? `সবচেয়ে বেশি দামের বাজার: ${maxM.market}` : "সবচেয়ে বেশি দামের বাজার")}
          {stat("গড় দাম", avg, `প্রতি ${unit}-এর হিসাবে`)}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-base-200 text-base-content/70">
              <tr>{["বাজার", "বিভাগ", "সর্বনিম্ন", "সর্বাধিক", "গড়"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody>
              {m.map((r) => (
                <tr key={r.market + r.division} className="border-t border-base-300">
                  <td className="px-4 py-3 font-medium">{r.market}</td>
                  <td className="px-4 py-3 text-base-content/70">{r.division}</td>
                  <td className="px-4 py-3">{fmtNum(r.min)} টাকা</td>
                  <td className="px-4 py-3">{fmtNum(r.max)} টাকা</td>
                  <td className="px-4 py-3 font-semibold">{fmtNum(r.avg)} টাকা</td>
                </tr>
              ))}
              {!m.length && <tr><td colSpan={5} className="px-4 py-8 text-center text-base-content/60">বাজারভিত্তিক তথ্য পাওয়া যায়নি</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
