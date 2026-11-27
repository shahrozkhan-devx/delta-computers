import { MessageSquareText } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteInquiry } from "@/lib/admin-actions";
import DeleteButton from "@/components/admin/DeleteButton";
import InquiryStatus from "@/components/admin/InquiryStatus";

export default async function AdminInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("inquiries").select("id,name,phone,message,status,created_at,products(name,slug)").order("created_at", { ascending: false });
  if (error) throw new Error(`Could not load inquiries: ${error.message}`);
  return <div><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Customer messages</p><h1 className="mt-2 font-display text-3xl font-semibold">Inquiries</h1><p className="mt-2 text-sm text-slate-400">{data.length} messages</p></div>
    <div className="mt-7 space-y-3">{data.map((item) => <article key={item.id} className="rounded-2xl border border-white/[.07] bg-[#0a111d] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-display text-lg font-semibold">{item.name}</p><div className="mt-1 flex flex-wrap gap-3 text-xs"><a href={`tel:${item.phone}`} className="text-cyan">{item.phone}</a><a href={`https://wa.me/${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" className="text-emerald-300">WhatsApp</a></div></div><div className="flex items-center gap-3"><InquiryStatus id={item.id} status={item.status} /><DeleteButton action={deleteInquiry} id={item.id} label="Delete" /></div></div>{item.products?.name && <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cyan/[.07] px-3 py-1 text-xs text-cyan"><MessageSquareText size={13} />{item.products.name}</p>}<p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-300">{item.message}</p><p className="mt-4 text-[10px] text-slate-600">{new Date(item.created_at).toLocaleString()}</p></article>)}</div>
    {!data.length && <div className="mt-7 rounded-2xl border border-dashed border-white/10 p-12 text-center text-sm text-slate-500">No inquiries received yet.</div>}
  </div>;
}
