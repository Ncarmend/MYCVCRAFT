"use client";

import Link from "next/link";
import { Sparkles, Target, Eye, Layers, Zap, Shield, TrendingUp } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

const VALUE_ICONS = [Layers, Zap, Shield, TrendingUp];

export function AboutClient() {
  const { lang } = useLanguage();
  const T = translations[lang].about;

  return (
    <main className="flex-1">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-800">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center text-white">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700 ring-1 ring-white/10">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {T.hero.heading}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-300">
            {T.hero.subtext}
          </p>
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
      <section className="bg-slate-50">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 lg:order-last">
              <div className="space-y-4">
                {T.vision.stats.map((item) => (
                  <div key={item.label} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                    <span className="text-xl font-extrabold text-slate-900">{item.stat}</span>
                    <span className="text-xs text-slate-500">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-200">
                <Eye className="h-3 w-3" />
                {T.vision.badge}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {T.vision.heading}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">{T.vision.p1}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{T.vision.p2}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Goal ── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{T.goal.heading}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-500">
            {T.goal.subtext}
          </p>
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-green-50 p-8 ring-1 ring-green-100">
            <p className="text-sm leading-relaxed text-slate-700">
              {T.goal.p1Before}
              <strong className="text-slate-900">{T.goal.p1Bold}</strong>
              {T.goal.p1After}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-slate-700">{T.goal.p2}</p>
          </div>
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
              href="/contact"
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
