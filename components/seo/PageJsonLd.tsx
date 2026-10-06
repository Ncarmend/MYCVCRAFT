import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { localizedAlternates, type Locale } from "@/lib/seo";
import { graph, webPageNode, SOFTWARE_ID } from "@/lib/structured-data";

/**
 * WebPage-level node for simple public pages, derived from the page's own
 * metadata so the name/description always match its <title> and meta description.
 */
export function PageJsonLd({
  lang,
  path,
  metadata,
  type = "WebPage",
}: {
  lang: Locale;
  path: string;
  metadata: Metadata;
  type?: "WebPage" | "ContactPage" | "CollectionPage";
}) {
  const title = typeof metadata.title === "string" ? metadata.title : "";
  return (
    <JsonLd
      data={graph(
        webPageNode({
          type,
          url: localizedAlternates(lang, path).canonical,
          name: title,
          description: metadata.description ?? "",
          lang,
          about: type === "WebPage" ? SOFTWARE_ID : undefined,
        }),
      )}
    />
  );
}
