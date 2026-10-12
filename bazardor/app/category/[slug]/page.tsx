import Link from "next/link";
import { notFound } from "next/navigation";
import SortedGrid from "@/components/SortedGrid";
import { getCategory, getProducts } from "@/lib/api";
import { toBn } from "@/lib/bn";

export const revalidate = 300;

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const products = await getProducts(slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-100 text-2xl border border-base-300">{category.emoji}</span>
        <div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
          <p className="text-sm text-base-content/60">{toBn(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </div>
      {products.length ? (
        <SortedGrid products={products} />
      ) : (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center">
          <p className="text-4xl">🛒</p>
          <p className="mt-2 text-lg font-semibold">এই বিভাগে কোনো পণ্য পাওয়া যায়নি</p>
          <Link href="/" className="btn btn-primary mt-4">হোম পেজে ফিরে যান</Link>
        </div>
      )}
    </div>
  );
}
