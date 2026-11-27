"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInquiry } from "@/lib/admin-actions";

export default function InquiryStatus({ id, status }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <select disabled={pending} value={status} onChange={(event) => {
    const next = event.target.value;
    startTransition(async () => {
      await updateInquiry(id, next);
      router.refresh();
    });
  }} className="rounded-lg border border-white/10 bg-[#0b1321] px-2 py-1.5 text-xs text-slate-200">
    <option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option>
  </select>;
}
