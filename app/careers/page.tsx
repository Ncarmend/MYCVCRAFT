"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArticleCard } from "@/components/careers/ArticleCard";
import { articles, CATEGORIES, type Category } from "@/lib/articles";

export default function CareersPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const featured = useMemo(() => articles.filter((a) => a.featured), []);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesCategory =
        activeCategory === "All" || a.category === activeCategory;
      const matchesQuery =
        query.trim() === "" ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.description.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const showFeatured = query.trim() === "" && activeCategory === "All";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="border-b border-slate-100 bg-gradient-to-b from-white to-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-14 text-center">
            <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-700 ring-1 ring-green-200">
              Career Resources
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Land your next job with confidence
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
              Practical, expert-written guides on resumes, ATS optimisation, interviews, and more — everything you need for a successful job search.
            </p>

            {/* Search bar */}
            <div className="relative mx-auto mt-7 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-colors duration-150"
              />
            </div>

            {/* Category filter */}
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setActiveCategory("All")}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                  activeCategory === "All"
                    ? "bg-slate-800 text-white shadow-sm"
                    : "bg-white text-slate-600 ring-1 ring-gray-200 hover:ring-green-300 hover:text-green-700"
                }`}
              >
                All topics
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-150 ${
                    activeCategory === cat
                      ? "bg-slate-800 text-white shadow-sm"
                      : "bg-white text-slate-600 ring-1 ring-gray-200 hover:ring-green-300 hover:text-green-700"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-6 py-12 space-y-14">

          {/* ── Featured articles ── */}
          {showFeatured && featured.length > 0 && (
            <section>
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-100" />
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Featured articles
                </h2>
                <span className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          )}

          {/* ── All / filtered articles ── */}
          <section>
            {showFeatured && (
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-100" />
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  All articles
                </h2>
                <span className="h-px flex-1 bg-gray-100" />
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-sm text-slate-400">
                  No articles found for{" "}
                  <span className="font-semibold text-slate-600">
                    "{query}"
                  </span>
                  .
                </p>
                <button
                  onClick={() => { setQuery(""); setActiveCategory("All"); }}
                  className="mt-3 text-xs font-medium text-green-700 hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </section>

          {/* ── CTA banner ── */}
          <section className="rounded-2xl bg-slate-800 px-8 py-10 text-center text-white">
            <h2 className="text-lg font-bold">Ready to put these tips into action?</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-300">
              Build a professional, ATS-optimised resume in minutes with Cvixeo — and start getting more interviews.
            </p>
            <a
              href="/signup"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-green-600 hover:text-white active:bg-green-700"
            >
              Build your CV free
            </a>
          </section>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
