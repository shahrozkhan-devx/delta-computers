"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export default function LanguageSwitch({ compact = false }) {
  const { language, t, toggleLanguage } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={language === "en" ? "Switch to Urdu" : "Switch to English"}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan/50 hover:text-cyan"
    >
      <Languages size={15} />
      {!compact && t("language")}
    </button>
  );
}
