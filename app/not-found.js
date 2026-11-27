import Link from "next/link";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-ink px-5 text-center text-white"><div><p className="font-display text-sm font-bold uppercase tracking-[.25em] text-cyan">404 · Page not found</p><h1 className="mt-4 font-display text-4xl font-semibold">This page went off-grid.</h1><p className="mt-3 text-sm text-slate-400">The address may have changed, or the page is no longer available.</p><Link href="/" className="mt-7 inline-flex rounded-full bg-electric px-5 py-3 text-sm font-bold">Back to home</Link></div></main>;
}
