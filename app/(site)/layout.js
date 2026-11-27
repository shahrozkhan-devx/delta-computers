import { LanguageProvider } from "@/lib/i18n";
import { SiteFrame } from "@/components/site/SiteLayout";
import { CatalogProvider } from "@/components/site/CatalogProvider";

export default function StoreLayout({ children }) {
  return <LanguageProvider><CatalogProvider><SiteFrame>{children}</SiteFrame></CatalogProvider></LanguageProvider>;
}
