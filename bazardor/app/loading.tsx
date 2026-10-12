import { CardSkeleton } from "@/components/ProductCard";
export default function Loading() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-6" aria-busy="true">
      <div className="skeleton h-[283px] w-full !rounded-3xl" />
      {[0, 1].map((s) => (
        <div key={s} className="flex flex-col gap-4">
          <div className="skeleton h-8 w-48" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        </div>
      ))}
    </div>
  );
}
