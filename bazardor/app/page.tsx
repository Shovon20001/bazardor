import Image from "next/image";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/api";
import { banglaDate, toBn } from "@/lib/bn";
import type { Product } from "@/lib/types";

export const revalidate = 300;

function Section({ id, title, subtitle, items }: { id?: string; title: React.ReactNode; subtitle?: string; items: Product[] }) {
  return (
    <section id={id}>
      <div className="mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle && <p className="text-sm text-base-content/60">{subtitle}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

export default async function Home() {
  const products = await getProducts();
  const risers = products.filter((p) => p.trend === "up").sort((a, b) => b.change - a.change).slice(0, 6);
  const fallers = products.filter((p) => p.trend === "down").sort((a, b) => b.change - a.change).slice(0, 6);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6">
      <section className="overflow-hidden rounded-3xl border border-base-300 bg-base-100">
        <div className="flex flex-col-reverse items-center gap-6 px-4 py-8 md:flex-row md:justify-between md:px-10 md:py-10">
          <div className="flex max-w-xl flex-col items-start gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-content">{banglaDate()}</span>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">আজকের বাজারের দাম এক নজরে</h1>
            <p className="mt-1 text-base text-base-content/80">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।</p>
            <a href="#সব-পণ্য" className="btn btn-primary mt-3">সব পণ্য দেখুন</a>
          </div>
          <Image src="/bazar-hero.png" alt="সবজি ও ফলের ঝুড়ি" width={315} height={263} priority className="h-auto w-56 md:w-[315px]" />
        </div>
      </section>

      <Section title={<><span className="text-success">▲</span> আজ দাম বেড়েছে</>} items={risers} />
      <Section title={<><span className="text-error">▼</span> আজ দাম কমেছে</>} items={fallers} />
      <Section id="সব-পণ্য" title="সব পণ্য" subtitle={`মোট ${toBn(products.length)}টি পণ্য দেখানো হচ্ছে`} items={products} />
    </div>
  );
}
