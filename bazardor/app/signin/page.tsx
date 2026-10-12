"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

function Form() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (from) toast("এই পেজ দেখতে সাইন ইন করুন", { icon: "🔒", id: "protected" }); }, [from]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email")).trim(), password = String(f.get("password"));
    if (!email || !password) { setError("ইমেইল ও পাসওয়ার্ড দিন"); toast.error("ইমেইল ও পাসওয়ার্ড দিন"); return; }
    setLoading(true); setError("");
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) { const m = "ইমেইল বা পাসওয়ার্ড সঠিক নয়"; setError(m); toast.error(m); return; }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(from && from.startsWith("/") ? from : "/");
    router.refresh();
  }

  return (
    <AuthShell title="সাইন ইন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"
      footer={<>অ্যাকাউন্ট নেই? <Link href="/signup" className="font-semibold text-primary hover:underline">সাইন আপ করুন</Link></>}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="text-sm font-medium">ইমেইল<input name="email" type="email" placeholder="you@example.com" className="input mt-1" autoComplete="email" /></label>
        <label className="text-sm font-medium">পাসওয়ার্ড<input name="password" type="password" placeholder="কমপক্ষে ৮ অক্ষর" className="input mt-1" autoComplete="current-password" /></label>
        {error && <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        <button disabled={loading} className="btn btn-primary w-full">{loading ? "অপেক্ষা করুন…" : "সাইন ইন"}</button>
      </form>
      <SocialButtons />
    </AuthShell>
  );
}
export default function SignIn() { return <Suspense><Form /></Suspense>; }
