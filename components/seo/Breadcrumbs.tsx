import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/seo";
import { breadcrumbNode } from "@/lib/structured-data";

export interface Crumb {
  name: string;
  /** Site-relative path. The last crumb is the current page. */
  href: string;
}

/**
 * Visible breadcrumb trail. Pair with `breadcrumbJsonLd(sameItems)` so the
 * BreadcrumbList structured data always mirrors what users see.
 */
export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const muted = tone === "dark" ? "text-white/60 hover:text-white" : "text-gray-400 hover:text-gray-700";
  const current = tone === "dark" ? "text-white/90" : "text-gray-600";
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className={`line-clamp-1 ${current}`}>{c.name}</span>
              ) : (
                <>
                  <Link href={c.href} className={muted}>{c.name}</Link>
                  <ChevronRight className={`h-3 w-3 ${tone === "dark" ? "text-white/40" : "text-gray-300"}`} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function breadcrumbJsonLd(items: Crumb[]) {
  const toUrl = (href: string) => `${SITE_URL}${href}`.replace(/\/$/, "") || SITE_URL;
  const pageUrl = toUrl(items[items.length - 1].href);
  return breadcrumbNode(pageUrl, items.map((c) => ({ name: c.name, url: toUrl(c.href) })));
}
