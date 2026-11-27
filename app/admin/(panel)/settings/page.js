import SettingsForm from "@/components/admin/SettingsForm";
import { getShopSettings } from "@/lib/queries";

export default async function AdminSettings() {
  const settings = await getShopSettings();
  return <div><p className="text-xs font-bold uppercase tracking-[.2em] text-cyan">Store profile</p><h1 className="mt-2 font-display text-3xl font-semibold">Shop settings</h1><p className="mt-2 text-sm text-slate-400">Update the contact details customers see across the storefront.</p><SettingsForm settings={settings} /></div>;
}
