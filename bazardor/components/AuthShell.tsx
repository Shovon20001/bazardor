import Link from "next/link";
export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-10">
      <div className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-base-content/70">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-sm text-base-content/70">{footer}</p>
      </div>
      <Link href="/" className="mt-4 text-center text-sm text-primary hover:underline">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}
