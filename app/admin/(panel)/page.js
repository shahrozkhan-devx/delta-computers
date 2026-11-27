import Link from "next/link";
import { ArrowRight, Boxes, CircleAlert, MessageSquareText, PackageCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

async function countRows(supabase, table, column = "id", value = null) {
  let query = supabase.from(table).select("*", { count: "exact", head: true });
  if (column && value) query = query.eq(column, value);
  const { count, error } = await query;
  if (error) throw new Error(`Could not load ${table} summary: ${error.message}`);
  return count || 0;
}

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [total, active, outOfStock, newInquiries] = await Promise.all([
    countRows(supabase, "products"),
    countRows(supabase, "products", "is_active", true),
    countRows(supabase, "products", "stock_status", "out_of_stock"),
    countRows(supabase, "inquiries", "status", "new"),
  ]);
  const { data: inquiries, error: inquiryError } = await supabase.from("inquiries").select("id,name,phone,message,status,created_at").order("created_at", { ascending: false }).limit(5);
  if (inquiryError) throw new Error(`Could not load latest inquiries: ${inquiryError.message}`);
  const { data: recentProducts, error: productError } = await supabase.from("products").select("id,name,price,created_at").order("created_at", { ascending: false }).limit(5);
  if (productError) throw new Error(`Could not load latest products: ${productError.message}`);
  const stats = [
    ["Products", total, Boxes, "All catalog items"],
    ["Active products", active, PackageCheck, "Visible to customers"],
    ["Out of stock", outOfStock, CircleAlert, "Needs attention"],
    ["New inquiries", newInquiries, MessageSquareText, "Waiting for a reply"],
  ];
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Admin overview</p><h1 className="mt-2 font-display text-3xl font-semibold">Good to see you.</h1><p className="mt-2 text-sm text-slate-400">Your shop at a glance.</p></div><Link href="/admin/products/new" className="rounded-xl bg-electric px-4 py-2.5 text-sm font-bold">+ Add product</Link></div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map(([label, count, Icon, note]) => <div key={label} className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-5"><div className="flex items-center justify-between"><span className="text-xs text-slate-400">{label}</span><Icon size={17} className="text-cyan" /></div><p className="mt-4 font-display text-3xl font-semibold">{count}</p><p className="mt-1 text-[11px] text-slate-500">{note}</p></div>)}</div>
      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Latest inquiries</h2><Link href="/admin/inquiries" className="flex items-center gap-1 text-xs text-cyan">All inquiries<ArrowRight size={13} /></Link></div>{inquiries.length ? <div className="mt-5 divide-y divide-white/[.06]">{inquiries.map((item) => <div key={item.id} className="py-4 first:pt-0"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-semibold">{item.name}</p><a href={`tel:${item.phone}`} className="mt-1 block text-xs text-cyan">{item.phone}</a></div><span className="rounded-full bg-cyan/10 px-2 py-1 text-[10px] text-cyan">{item.status}</span></div><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-400">{item.message}</p></div>)}</div> : <p className="py-10 text-center text-sm text-slate-500">No inquiries yet.</p>}</section>
        <section className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Recently added</h2><Link href="/admin/products" className="flex items-center gap-1 text-xs text-cyan">Manage products<ArrowRight size={13} /></Link></div>{recentProducts.length ? <div className="mt-5 divide-y divide-white/[.06]">{recentProducts.map((item) => <div key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0"><div><p className="text-sm font-semibold">{item.name}</p><p className="mt-1 text-xs text-slate-500">{new Date(item.created_at).toLocaleDateString()}</p></div><span className="text-sm font-semibold">{formatPrice(item.price)}</span></div>)}</div> : <p className="py-10 text-center text-sm text-slate-500">Add your first product from the catalog page.</p>}</section>
      </div>
    </div>
  );
}
