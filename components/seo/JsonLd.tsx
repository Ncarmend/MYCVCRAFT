/**
 * Renders JSON-LD as recommended by the Next.js JSON-LD guide: a plain
 * <script> in the page body, with "<" escaped so content can never close
 * the tag (XSS-safe even if article text contains HTML).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
