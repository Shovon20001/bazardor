import { CardSkeleton } from "@/components/ProductCard";
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6" aria-busy="true">
      <div className="mb-6 flex items-center gap-3"><div className="skeleton h-12 w-12" /><div className="skeleton h-10 w-56" /></div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
    </div>
  );
}
