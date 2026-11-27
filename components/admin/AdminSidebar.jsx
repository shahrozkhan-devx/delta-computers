"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Boxes, FolderTree, LogOut, MessageSquareText, Settings2, Tags } from "lucide-react";
import { logoutAdmin } from "@/lib/admin-actions";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Tags },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquareText },
  { href: "/admin/settings", label: "Shop settings", icon: Settings2 },
];

export default function AdminSidebar({ email }) {
  const pathname = usePathname();
  return (
    <aside className="flex min-h-0 w-full flex-col border-r border-white/[.07] bg-[#080e18] lg:sticky lg:top-0 lg:min-h-screen lg:h-screen lg:w-[250px]">
      <Link href="/admin" className="flex items-center gap-3 border-b border-white/[.07] px-5 py-5"><Image src="/logo.png" width={42} height={42} alt="" className="h-10 w-10 rounded-full" /><span><b className="block font-display text-sm tracking-[.15em]">DELTA</b><small className="text-[9px] tracking-[.22em] text-cyan">ADMIN STUDIO</small></span></Link>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:py-6">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition lg:text-sm ${pathname === href || (href !== "/admin" && pathname.startsWith(href)) ? "bg-blue-500/15 text-cyan" : "text-slate-400 hover:bg-white/[.04] hover:text-white"}`}><Icon size={17} />{label}</Link>)}</nav>
      <div className="flex items-center justify-between border-t border-white/[.07] px-4 py-3 lg:hidden"><span className="max-w-[65vw] truncate text-xs text-slate-400">{email}</span><form action={logoutAdmin}><button className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-300"><LogOut size={14} />Sign out</button></form></div>
      <div className="hidden border-t border-white/[.07] p-4 lg:block"><p className="truncate text-xs text-slate-400" title={email}>{email}</p><form action={logoutAdmin}><button className="mt-4 flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs text-slate-300 transition hover:border-rose-400/30 hover:text-rose-200"><LogOut size={15} />Sign out</button></form></div>
    </aside>
  );
}
