"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfile() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => { if (data?.user) setName(data.user.name ?? ""); }, [data?.user]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return void toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setLoading(false);
    if (error) return void toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য আপডেট হয়েছে");
    router.push("/profile"); router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <p className="mt-1 text-sm text-base-content/70">আপনার নাম পরিবর্তন করুন।</p>
        {isPending ? <div className="skeleton mt-6 h-24 w-full" /> : (
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
            <label className="text-sm font-medium">নাম<input value={name} onChange={(e) => setName(e.target.value)} className="input mt-1" placeholder="আপনার নাম" /></label>
            <button disabled={loading} className="btn btn-primary w-full">{loading ? "অপেক্ষা করুন…" : "তথ্য আপডেট করুন"}</button>
          </form>
        )}
      </div>
    </div>
  );
}
