import { JsonLd } from "@/components/seo/JsonLd";
import { translations } from "@/lib/translations";
import { localizedAlternates, type Locale } from "@/lib/seo";
import { graph, webPageNode, softwareApplicationNode, faqPageNode, SOFTWARE_ID } from "@/lib/structured-data";

/** Pricing pages show the plans (→ SoftwareApplication offers) and a visible FAQ. */
export function PricingJsonLd({ lang, name, description }: { lang: Locale; name: string; description: string }) {
  const url = localizedAlternates(lang, "/pricing").canonical;
  const T = translations[lang];
  return (
    <JsonLd
      data={graph(
        webPageNode({ url, name, description, lang, about: SOFTWARE_ID }),
        softwareApplicationNode(lang, T.features.items.map((f) => f.title)),
        faqPageNode(url, lang, T.pricing.faqs),
      )}
    />
  );
}
