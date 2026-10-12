"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function Profile() {
  const router = useRouter();
  const { data, isPending } = authClient.useSession();
  const user = data?.user;

  async function signOut() {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/"); router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="text-sm text-base-content/60">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
      {isPending || !user ? (
        <div className="skeleton mt-6 h-64 w-full !rounded-3xl" />
      ) : (
        <div className="mt-6 rounded-3xl border border-base-300 bg-base-100 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-primary text-xl font-bold text-primary-content">
                {user.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={user.image} alt="" className="h-full w-full object-cover" /> : user.name?.[0]?.toUpperCase()}
              </span>
              <div><p className="text-lg font-semibold">{user.name}</p><p className="text-sm text-base-content/60">{user.email}</p></div>
            </div>
            <button onClick={signOut} className="btn btn-outline">↩ সাইন আউট</button>
          </div>
          <div className="mt-6 border-t border-base-300 pt-5">
            <h2 className="font-semibold">তথ্য</h2>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-base-content/60">নাম</dt><dd className="font-medium">{user.name}</dd></div>
              <div><dt className="text-base-content/60">ইমেইল</dt><dd className="font-medium">{user.email}</dd></div>
            </dl>
            <Link href="/profile/update" className="btn btn-primary mt-5">আপডেট</Link>
          </div>
        </div>
      )}
    </div>
  );
}
