"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AuthShell from "@/components/AuthShell";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim(), email = String(f.get("email")).trim();
    const password = String(f.get("password")), confirm = String(f.get("confirm"));
    const fail = (m: string) => { setError(m); toast.error(m); };
    if (!name || !email || !password) return fail("সব ঘর পূরণ করুন");
    if (password.length < 8) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (password !== confirm) return fail("পাসওয়ার্ড দুটি মেলেনি");
    setLoading(true); setError("");
    const { error } = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (error) return fail(error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে, এবার সাইন ইন করুন");
    router.push("/signin");
  }

  return (
    <AuthShell title="অ্যাকাউন্ট তৈরি করুন" subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
      footer={<>অ্যাকাউন্ট আছে? <Link href="/signin" className="font-semibold text-primary hover:underline">সাইন ইন করুন</Link></>}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="text-sm font-medium">নাম<input name="name" placeholder="যেমন: রহিম উদ্দিন" className="input mt-1" autoComplete="name" /></label>
        <label className="text-sm font-medium">ইমেইল<input name="email" type="email" placeholder="you@example.com" className="input mt-1" autoComplete="email" /></label>
        <label className="text-sm font-medium">পাসওয়ার্ড<input name="password" type="password" placeholder="কমপক্ষে ৮ অক্ষর" className="input mt-1" autoComplete="new-password" /></label>
        <label className="text-sm font-medium">পাসওয়ার্ড নিশ্চিত করুন<input name="confirm" type="password" placeholder="আবার লিখুন" className="input mt-1" autoComplete="new-password" /></label>
        {error && <p role="alert" className="rounded-lg bg-error/10 px-3 py-2 text-sm text-error">{error}</p>}
        <button disabled={loading} className="btn btn-primary w-full">{loading ? "অপেক্ষা করুন…" : "অ্যাকাউন্ট তৈরি করুন"}</button>
      </form>
      <SocialButtons />
    </AuthShell>
  );
}
