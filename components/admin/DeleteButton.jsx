"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({ action, id, label = "Delete", confirmText = "Delete this item? This cannot be undone." }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  function remove() {
    if (!window.confirm(confirmText)) return;
    setError("");
    startTransition(async () => {
      try {
        await action(id);
        router.refresh();
      } catch (deleteError) {
        setError(deleteError.message || "Delete failed.");
      }
    });
  }
  return <span className="inline-flex items-center gap-2"><button type="button" onClick={remove} disabled={pending} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300/15 px-2.5 py-1.5 text-xs text-rose-200 hover:bg-rose-400/10 disabled:opacity-50"><Trash2 size={13} />{pending ? "Deleting…" : label}</button>{error && <span role="alert" className="max-w-40 text-[10px] text-rose-300">{error}</span>}</span>;
}
