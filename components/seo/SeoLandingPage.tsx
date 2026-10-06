import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { FAQSection } from "@/components/landing/FAQSection";
import { LANDING_PAGES, type LandingSection } from "@/lib/landing-pages";
import { LANDING_ROUTES, type LandingId } from "@/lib/landing-routes";
import { getArticleBySlug } from "@/lib/articles";
import { JOB_MATCH_WEIGHTS } from "@/lib/jobMatch";
import { translations } from "@/lib/translations";
import { OG_DEFAULTS, OG_LOCALE, SITE_URL, localePath } from "@/lib/seo";

const UI = {
  en: {
    home: "Home",
    freeNote: "Free plan available · No credit card required",
    related: "Related tools and guides",
    furtherReading: "Further reading",
    faqLabel: "FAQ",
    faqHeading: "Frequently asked questions",
    illustrative: "Illustrative example",
    weightsNote: "Weights used by Cvixeo's job match engine.",
  },
  fr: {
    home: "Accueil",
    freeNote: "Offre gratuite disponible · Sans carte bancaire",
    related: "Outils et guides associés",
    furtherReading: "Pour aller plus loin",
    faqLabel: "FAQ",
    faqHeading: "Questions fréquentes",
    illustrative: "Exemple illustratif",
    weightsNote: "Pondérations utilisées par le moteur de correspondance Cvixeo.",
  },
} as const;

// ── Inline markup: [anchor](/path), **bold**, *italic* ──────────────────────
const INLINE = /\[([^\]]+)\]\((\/[^)\s]*)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;

function Rich({ text }: { text: string }) {
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
function plain(text: string): string {
  return text.replace(INLINE, (_m, a, _h, b, c) => a ?? b ?? c ?? "");
}

function pageUrl(id: LandingId): string {
  return `${SITE_URL}${LANDING_ROUTES[id].path}`;
}

// ── Metadata ────────────────────────────────────────────────────────────────
export function landingMetadata(id: LandingId): Metadata {
  const route = LANDING_ROUTES[id];
  const page = LANDING_PAGES[id];
  const url = pageUrl(id);

  // hreflang only where a same-intent page exists in the other language.
  const languages: Record<string, string> | undefined = route.alternate
    ? (() => {
        const alt = LANDING_ROUTES[route.alternate];
        const en = route.lang === "en" ? url : pageUrl(alt.id);
        const fr = route.lang === "fr" ? url : pageUrl(alt.id);
        return { en, fr, "x-default": en };
      })()
    : undefined;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      ...OG_DEFAULTS,
      title: `${page.metaTitle} | Cvixeo`,
      description: page.metaDescription,
      url,
      locale: OG_LOCALE[route.lang],
    },
    twitter: {
      card: "summary_large_image",
      title: `${page.metaTitle} | Cvixeo`,
      description: page.metaDescription,
    },
  };
}

function landingJsonLd(id: LandingId) {
  const route = LANDING_ROUTES[id];
  const page = LANDING_PAGES[id];
  const url = pageUrl(id);
  const homeUrl = `${SITE_URL}${localePath(route.lang, "/")}`.replace(/\/$/, "");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: page.h1,
        description: page.metaDescription,
        inLanguage: route.lang,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": `${SITE_URL}/#software` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: UI[route.lang].home, item: homeUrl },
          { "@type": "ListItem", position: 2, name: route.label, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: route.lang,
        mainEntity: page.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      },
    ],
  };
}

// ── Section blocks ──────────────────────────────────────────────────────────
function MatchWeights({ lang }: { lang: "en" | "fr" }) {
  const labels = translations[lang].jobMatch.categories;
  const rows = (Object.keys(JOB_MATCH_WEIGHTS) as (keyof typeof JOB_MATCH_WEIGHTS)[]).map((k) => ({
    label: labels[k],
    pct: Math.round(JOB_MATCH_WEIGHTS[k] * 100),
  }));
  return (
    <div className="mt-6 max-w-xl space-y-3">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-800">{r.label}</span>
            <span className="font-semibold text-emerald-800">{r.pct}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${r.pct}%` }} />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-gray-400">{UI[lang].weightsNote}</p>
    </div>
  );
}

function Section({ section, lang, shaded }: { section: LandingSection; lang: "en" | "fr"; shaded: boolean }) {
  return (
    <section className={`${shaded ? "bg-slate-50/70" : "bg-white"} py-12 sm:py-14`}>
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{section.heading}</h2>

        {section.paragraphs?.map((p, i) => (
          <p key={i} className="mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
            <Rich text={p} />
          </p>
        ))}

        {section.matchWeights && <MatchWeights lang={lang} />}

        {section.cards && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.cards.map((c) => (
              <div key={c.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-base">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600"><Rich text={c.body} /></p>
              </div>
            ))}
          </div>
        )}

        {section.steps && (
          <ol className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {section.steps.map((s, i) => (
              <li key={s.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 text-sm font-semibold text-gray-900 sm:text-base">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-600"><Rich text={s.body} /></p>
              </li>
            ))}
          </ol>
        )}

        {section.example && (
          <figure className="mt-6 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-red-50/60 p-5 ring-1 ring-red-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-red-700">{section.example.beforeLabel}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{section.example.before}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50/70 p-5 ring-1 ring-emerald-100">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{section.example.afterLabel}</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{section.example.after}</p>
            </div>
            <figcaption className="text-xs text-gray-400 sm:col-span-2">{UI[lang].illustrative}</figcaption>
          </figure>
        )}

        {section.dosDonts && (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white p-5 ring-1 ring-emerald-100">
              <h3 className="text-sm font-semibold text-emerald-800">{section.dosDonts.doTitle}</h3>
              <ul className="mt-3 space-y-2">
                {section.dosDonts.dos.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-gray-700">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span><Rich text={d} /></span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white p-5 ring-1 ring-red-100">
              <h3 className="text-sm font-semibold text-red-700">{section.dosDonts.dontTitle}</h3>
              <ul className="mt-3 space-y-2">
                {section.dosDonts.donts.map((d) => (
                  <li key={d} className="flex gap-2 text-sm text-gray-700">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <span><Rich text={d} /></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {section.bullets && (
          <ul className="mt-5 max-w-3xl space-y-2.5">
            {section.bullets.map((b) => (
              <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-gray-700 sm:text-base">
                <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                <span><Rich text={b} /></span>
              </li>
            ))}
          </ul>
        )}

        {section.outro?.map((p, i) => (
          <p key={i} className="mt-5 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base">
            <Rich text={p} />
          </p>
        ))}
      </div>
    </section>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────
export function SeoLandingPage({ id }: { id: LandingId }) {
  const route = LANDING_ROUTES[id];
  const page = LANDING_PAGES[id];
  const lang = route.lang;
  const ui = UI[lang];
  const homeHref = localePath(lang, "/");
  const careersPrefix = lang === "fr" ? "/fr/careers" : "/careers";
  const articles = page.articles
    .map((slug) => getArticleBySlug(slug))
    .filter((a) => a && (a.lang ?? "en") === lang);

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(landingJsonLd(id)).replace(/</g, "\\u003c") }}
      />
      <NavbarServer />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-40 -right-40 h-120 w-120 rounded-full bg-emerald-50 opacity-70 blur-3xl" />
          </div>
          <div className="mx-auto max-w-5xl px-6 pb-12 pt-8 sm:pt-12">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-gray-400">
              <Link href={homeHref} className="hover:text-gray-700">{ui.home}</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-gray-600">{route.label}</span>
            </nav>

            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-800">{page.eyebrow}</p>
            <h1 className="mt-2 max-w-3xl text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {page.h1}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">{page.intro}</p>

            <ul className="mt-6 grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
              {page.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={page.primaryCta.href}>
                <Button size="lg" className="w-full gap-2 px-8 sm:w-auto">
                  {page.primaryCta.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {page.secondaryCta && (
                <Link href={page.secondaryCta.href}>
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    {page.secondaryCta.label}
                  </Button>
                </Link>
              )}
            </div>
            <p className="mt-3 text-xs text-gray-400">{ui.freeNote}</p>
          </div>
        </section>

        {page.sections.map((s, i) => (
          <Section key={s.heading} section={s} lang={lang} shaded={i % 2 === 0} />
        ))}

        <FAQSection
          sectionLabel={ui.faqLabel}
          headline={ui.faqHeading}
          items={page.faq.map((f) => ({ q: f.q, a: <Rich text={f.a} /> }))}
          className={page.sections.length % 2 === 0 ? "bg-slate-50/70" : "bg-white"}
        />

        {/* Internal links */}
        <section className="bg-white py-12 sm:py-14">
          <div className="mx-auto max-w-5xl px-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">{ui.related}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {page.related.map((rid) => {
                const r = LANDING_ROUTES[rid];
                return (
                  <Link
                    key={rid}
                    href={r.path}
                    className="group flex items-start justify-between gap-3 rounded-2xl p-5 ring-1 ring-gray-100 transition-shadow hover:shadow-md"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-emerald-800">{r.label}</h3>
                      <p className="mt-1 text-sm text-gray-500">{r.blurb}</p>
                    </div>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 group-hover:text-emerald-700" />
                  </Link>
                );
              })}
            </div>

            {articles.length > 0 && (
              <>
                <h2 className="mt-10 text-base font-bold tracking-tight text-gray-900">{ui.furtherReading}</h2>
                <ul className="mt-4 space-y-2">
                  {articles.map((a) => (
                    <li key={a!.slug}>
                      <Link
                        href={`${careersPrefix}/${a!.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 hover:underline"
                      >
                        <BookOpen className="h-4 w-4 shrink-0" />
                        {a!.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-slate-700 py-14">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">{page.closing.heading}</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">{page.closing.body}</p>
            <Link href={page.primaryCta.href} className="mt-6 inline-block">
              <Button size="md" className="gap-2 bg-white px-8 text-slate-700 hover:bg-green-600 hover:text-white">
                {page.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
