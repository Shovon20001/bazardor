"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { Category } from "@/lib/types";
import { authClient } from "@/lib/auth-client";
import { banglaDate } from "@/lib/bn";

export default function Navbar({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setToday(banglaDate()), []);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const user = session?.user;
  async function signOut() {
    await authClient.signOut();
    setOpen(false);
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="border-b border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg text-primary-content">🛒</span>
          <span className="leading-tight">
            <span className="block text-xl font-bold">বাজার দর</span>
            <span className="block min-h-[18px] text-xs text-base-content/70">{today}</span>
          </span>
        </Link>

        {isPending ? (
          <div className="skeleton h-10 w-28" />
        ) : user ? (
          <div className="relative" ref={ref}>
            <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-lg px-3 py-1 hover:bg-base-200" aria-haspopup="menu" aria-expanded={open}>
              <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-[10px] bg-primary text-sm font-bold text-primary-content">
                {user.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={user.image} alt="" className="h-full w-full object-cover" /> : user.name?.[0]?.toUpperCase()}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{user.name?.split(" ")[0]}</span>
              <span className="text-xs">▾</span>
            </button>
            {open && (
              <div role="menu" className="absolute right-0 mt-2 w-64 rounded-xl border border-base-300 bg-base-100 p-2 shadow-lg">
                <div className="border-b border-base-300 px-3 pb-2 pt-1">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-base-content/60">{user.email}</p>
                </div>
                <Link href="/profile" className="mt-1 block rounded-lg px-3 py-2 text-sm hover:bg-base-200">👤 আমার প্রোফাইল</Link>
                <Link href="/#সব-পণ্য" className="block rounded-lg px-3 py-2 text-sm hover:bg-base-200">⚖️ বাজার তুলনা</Link>
                <button onClick={signOut} className="block w-full rounded-lg px-3 py-2 text-left text-sm text-error hover:bg-error/10">↩ সাইন আউট</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/signin" className="btn btn-outline !px-3 !py-2 sm:!px-4">সাইন ইন</Link>
            <Link href="/signup" className="btn btn-primary !px-3 !py-2 sm:!px-4">সাইন আপ</Link>
          </div>
        )}
      </div>

      <nav className="border-t border-base-200">
        <ul className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 [scrollbar-width:none]">
          {categories.map((c) => {
            const active = pathname === `/category/${c.slug}`;
            return (
              <li key={c.slug} className="shrink-0">
                <Link href={`/category/${c.slug}`} aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1 text-sm font-medium transition ${active ? "bg-primary text-primary-content" : "hover:bg-base-200"}`}>
                  <span>{c.emoji}</span><span>{c.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
