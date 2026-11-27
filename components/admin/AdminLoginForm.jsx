"use client";

import { useState, useTransition } from "react";
import { KeyRound } from "lucide-react";
import { loginAdmin } from "@/lib/admin-actions";

export default function AdminLoginForm({ setupRequired }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  function submit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setMessage("");
    startTransition(async () => {
      try {
        const result = await loginAdmin(formData);
        if (result?.error) setMessage(result.error);
      } catch (error) {
        setMessage(error.message || "Sign-in failed.");
      }
    });
  }
  return (
    <form onSubmit={submit} className="mt-8 space-y-5">
      {setupRequired && <div className="rounded-xl border border-amber-400/20 bg-amber-300/[.06] p-4 text-sm leading-6 text-amber-100">Connect a Supabase project first. Copy <code>.env.local.example</code> to <code>.env.local</code>, add the public project URL and anonymous key, and restart the app.</div>}
      <label className="block text-xs font-semibold text-slate-300">Email<input name="email" type="email" required autoComplete="email" className="admin-input mt-2" /></label>
      <label className="block text-xs font-semibold text-slate-300">Password<input name="password" type="password" required autoComplete="current-password" className="admin-input mt-2" /></label>
      {message && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-400/[.06] p-3 text-sm text-rose-200">{message}</p>}
      <button disabled={pending || setupRequired} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-electric to-blue-500 px-4 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"><KeyRound size={16} />{pending ? "Signing in…" : "Sign in securely"}</button>
      <style jsx>{`.admin-input{width:100%;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:#070c14;padding:13px;color:#fff;outline:none}.admin-input:focus{border-color:rgba(34,211,255,.6)}`}</style>
    </form>
  );
}
