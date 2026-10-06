"use client";

import Link from "next/link";
import { Sparkles, Target, Eye, Layers, Zap, Shield, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { FAQSection } from "@/components/landing/FAQSection";
import { Rich } from "@/components/seo/Rich";
import { LANDING_ROUTES, type LandingId } from "@/lib/landing-routes";
import { localePath } from "@/lib/seo";

const VALUE_ICONS = [Layers, Zap, Shield, TrendingUp];

// Landing page for each "What does CVixeo do?" item (same order). Dutch has no
// landing pages yet, so Dutch items stay unlinked.
const FEATURE_LINKS: Record<"en" | "fr", (LandingId | null)[]> = {
  en: ["ai-cv-builder", "ats-cv-builder", "job-description-matching", "cv-optimizer", "job-description-matching", "resume-optimizer", "cover-letter-generator", null, null],
  fr: ["generateur-cv-ia", "cv-ats", "cv-offre-emploi", "analyser-cv", "cv-offre-emploi", "optimiser-cv", "lettre-motivation", null, null],
};

export function AboutClient() {
  const { lang } = useLanguage();
  const T = translations[lang].about;
  const links = lang === "nl" ? null : FEATURE_LINKS[lang];

  return (
    <main className="flex-1">
      {/* ── Hero: official definition ── */}
      <section className="relative overflow-hidden bg-slate-800">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center text-white sm:py-20">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700 ring-1 ring-white/10">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {T.hero.heading}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            {T.hero.subtext}
          </p>
        </div>
      </section>

      {/* ── What is CVixeo? + at a glance ── */}
      <section className="border-b border-gray-100 bg-white" id="what-is-cvixeo">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.identity.heading}</h2>
              {T.identity.paragraphs.map((p) => (
                <p key={p} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{p}</p>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-50 p-6 ring-1 ring-slate-100 lg:col-span-2">
              <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">{T.glance.heading}</h2>
              <dl className="mt-4 space-y-3">
                {T.glance.rows.map((r) => (
                  <div key={r.label} className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <dt className="text-xs font-semibold text-slate-500">{r.label}</dt>
                    <dd className="col-span-2 text-xs text-slate-800">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* ── What does CVixeo do? ── */}
      <section className="bg-slate-50" id="features">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.whatItDoes.heading}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">{T.whatItDoes.intro}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {T.whatItDoes.items.map((f, i) => {
              const id = links?.[i] ?? null;
              return (
                <div key={f.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                  <h3 className="text-sm font-bold text-slate-900">
                    {id ? (
                      <Link href={LANDING_ROUTES[id].path} className="hover:text-emerald-800 hover:underline">{f.title}</Link>
                    ) : (
                      f.title
                    )}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Who is CVixeo for? ── */}
      <section className="bg-white" id="who-is-it-for">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.audience.heading}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {T.audience.items.map((a) => (
              <li key={a.title} className="flex gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{a.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── What makes CVixeo different? ── */}
      <section className="bg-slate-50" id="what-makes-it-different">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.different.heading}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {T.different.items.map((d) => (
              <div key={d.title} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                <h3 className="text-sm font-bold text-slate-900">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{d.body}</p>
              </div>
            ))}
          </div>
          <Link
            href={localePath(lang, "/job-match")}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-800 hover:underline"
          >
            Job Match <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                <Target className="h-3 w-3" />
                {T.mission.badge}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {T.mission.heading}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">{T.mission.p1}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{T.mission.p2}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-8 ring-1 ring-slate-100">
              <blockquote className="text-sm font-medium leading-relaxed text-slate-700">
                {T.mission.quote}
              </blockquote>
              <p className="mt-4 text-xs font-semibold text-slate-400">{T.mission.attribution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 pb-16">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
            <Eye className="h-3 w-3" />
            {T.vision.badge}
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.vision.heading}</h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-500">{T.vision.p1}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">{T.vision.p2}</p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.values.heading}</h2>
            <p className="mt-2 text-sm text-slate-500">{T.values.subtext}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {T.values.items.map((v, i) => {
              const Icon = VALUE_ICONS[i];
              return (
                <div key={v.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800">
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{v.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ (mirrored in FAQPage JSON-LD by the route) ── */}
      <FAQSection
        sectionLabel={T.faq.sectionLabel}
        headline={T.faq.headline}
        items={T.faq.items.map((f) => ({ q: f.q, a: <Rich text={f.a} /> }))}
        className="bg-white"
      />

      {/* ── CTA ── */}
      <section className="bg-slate-800">
        <div className="mx-auto max-w-4xl px-6 py-14 text-center">
          <h2 className="text-xl font-bold text-white">{T.cta.heading}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">{T.cta.subtext}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/signup"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-green-600 hover:text-white active:bg-green-700"
            >
              {T.cta.btnPrimary}
            </Link>
            <Link
              href={localePath(lang, "/contact")}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-medium text-white transition-all duration-200 hover:bg-white/10"
            >
              {T.cta.btnSecondary}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
