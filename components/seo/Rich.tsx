import type { ReactNode } from "react";
import Link from "next/link";

// Minimal inline markup used in SEO copy: [anchor](/path), **bold**, *italic*.
const INLINE = /\[([^\]]+)\]\((\/[^)\s]*)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    const i = m.index ?? 0;
    if (i > last) out.push(text.slice(last, i));
    if (m[1] && m[2]) {
      out.push(
        <Link key={i} href={m[2]} className="font-medium text-emerald-800 underline underline-offset-2 hover:text-emerald-950">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      out.push(<strong key={i} className="font-semibold text-gray-900">{m[3]}</strong>);
    } else if (m[4]) {
      out.push(<em key={i}>{m[4]}</em>);
    }
    last = i + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Same text with inline markup removed — for meta tags and JSON-LD. */
export function plain(text: string): string {
  return text.replace(INLINE, (_m, a, _h, b, c) => a ?? b ?? c ?? "");
}
