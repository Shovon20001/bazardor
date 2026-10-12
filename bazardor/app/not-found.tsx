import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl">🛒</p>
      <h1 className="mt-4 text-3xl font-bold">৪০৪ — পেজটি পাওয়া যায়নি</h1>
      <p className="mt-2 text-base-content/70">আপনি যে পেজটি খুঁজছেন তা নেই বা সরিয়ে নেওয়া হয়েছে।</p>
      <Link href="/" className="btn btn-primary mt-6">হোম পেজে ফিরে যান</Link>
    </div>
  );
}
