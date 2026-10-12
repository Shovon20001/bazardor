"use client";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SocialButtons() {
  async function go(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({ provider, callbackURL: "/" });
    if (error) toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে");
  }
  return (
    <div className="mt-5">
      <div className="flex items-center gap-3 text-xs text-base-content/50"><span className="h-px flex-1 bg-base-300" />অথবা<span className="h-px flex-1 bg-base-300" /></div>
      <div className="mt-4 flex flex-col gap-2">
        <button type="button" onClick={() => go("google")} className="btn btn-outline w-full">🇬 Google দিয়ে চালিয়ে যান</button>
        <button type="button" onClick={() => go("github")} className="btn btn-outline w-full">🐙 GitHub দিয়ে চালিয়ে যান</button>
      </div>
    </div>
  );
}
