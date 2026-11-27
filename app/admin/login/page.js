import Image from "next/image";
import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLogin({ searchParams }) {
  const params = await searchParams;
  const setupRequired = params?.setup === "1" || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#05080f] px-5 py-12 text-white">
      <div className="site-grid absolute inset-0 opacity-70" /><div className="blueprint-orb absolute left-1/2 top-1/2 h-[540px] w-[640px] -translate-x-1/2 -translate-y-1/2" />
      <div className="glass relative w-full max-w-md rounded-[26px] p-7 shadow-2xl sm:p-9">
        <Link href="/" className="mb-9 inline-flex items-center gap-3"><Image src="/logo.png" width={52} height={52} alt="Delta Computers" className="h-12 w-12 rounded-full" /><span><b className="block font-display tracking-[.15em]">DELTA</b><small className="text-[9px] tracking-[.25em] text-cyan">ADMIN STUDIO</small></span></Link>
        <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Protected area</p><h1 className="mt-2 font-display text-3xl font-semibold">Welcome back.</h1><p className="mt-2 text-sm text-slate-400">Sign in with an authorized shop administrator account.</p>
        <AdminLoginForm setupRequired={setupRequired} />
        <p className="mt-6 text-center text-xs text-slate-600">Admin access is restricted to accounts listed in Supabase <code>admin_users</code>.</p>
      </div>
    </main>
  );
}
