import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OG_DEFAULTS } from "@/lib/seo";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { ArticleCard } from "@/components/careers/ArticleCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { translations } from "@/lib/translations";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/seo/Breadcrumbs";
import { graph, articleNode } from "@/lib/structured-data";
import { SITE_URL } from "@/lib/seo";
import { ArticleToolLinks } from "@/components/seo/ArticleToolLinks";
import {
  articles,
  getArticleBySlug,
  getRelatedArticles,
  categoryStyle,
} from "@/lib/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.filter((a) => (a.lang ?? "en") === "en").map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || (article.lang ?? "en") !== "en") return { title: "Article not found" };

  // Root layout's title template already appends "| CVixeo" — don't double it here.
  const title = article.title;
  const url = `https://www.cvixeo.com/careers/${article.slug}`;

  return {
    title,
    description: article.description,
    keywords: article.tags.join(", "),
    openGraph: {
      ...OG_DEFAULTS,
      title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: article.description,
    },
    alternates: { canonical: url },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || (article.lang ?? "en") !== "en") {
    notFound();
  }

  const related = getRelatedArticles(article, 3);
  const style = categoryStyle[article.category];

  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: translations.en.careers.backLink, href: "/careers" },
    { name: article.title, href: "/careers/${article.slug}" },
  ];
  const jsonLd = graph(articleNode(article, `${SITE_URL}/careers/${article.slug}`, "en"), breadcrumbJsonLd(crumbs));

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={jsonLd} />

      <NavbarServer />

      <main className="flex-1">
        {/* ── Hero header ── */}
        <div className={`relative overflow-hidden bg-linear-to-br ${style.gradient}`}>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative mx-auto max-w-3xl px-6 py-16 text-white">
            <div className="mb-6">
              <Breadcrumbs items={crumbs} tone="dark" />
            </div>

            <div className="mb-4">
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}>
                {article.category}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
              {article.title}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
              {article.description}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {article.readingTime} min read
              </span>
            </div>
          </div>
        </div>

        {/* ── Article body ── */}
        <div className="mx-auto max-w-3xl px-6 py-12">

          {/* Introduction */}
          <div className="mb-10 rounded-xl bg-slate-50 px-6 py-5 ring-1 ring-slate-100">
            {article.intro.split("\n\n").map((para, i) => (
              <p key={i} className={`text-sm leading-7 text-slate-600 ${i > 0 ? "mt-4" : ""}`}>
                {para}
              </p>
            ))}
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {article.sections.map((section, i) => (
              <section key={i}>
                <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">
                  {section.heading}
                </h2>
                <div
                  className="
                    text-sm leading-7 text-slate-600
                    [&_p]:mb-4
                    [&_ul]:mb-4 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2
                    [&_ol]:mb-4 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2
                    [&_li]:leading-relaxed [&_li]:text-slate-600
                    [&_strong]:font-semibold [&_strong]:text-slate-800
                    [&_em]:italic
                    [&_blockquote]:border-l-4 [&_blockquote]:border-green-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500
                    [&_a]:text-green-700 [&_a]:underline
                  "
                  dangerouslySetInnerHTML={{ __html: section.body }}
                />
              </section>
            ))}
          </div>

          {/* Conclusion */}
          <div className="mt-10 border-t border-gray-100 pt-8">
            <h2 className="mb-4 text-lg font-bold tracking-tight text-slate-900">Conclusion</h2>
            {article.conclusion.split("\n\n").map((para, i) => (
              <p key={i} className={`text-sm leading-7 text-slate-600 ${i > 0 ? "mt-4" : ""}`}>
                {para}
              </p>
            ))}
          </div>

          <ArticleToolLinks article={article} lang="en" />

          {/* Tags */}
          <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-6">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-2xl bg-slate-800 px-8 py-8 text-center text-white">
            <p className="text-base font-bold">Put this advice into action</p>
            <p className="mt-1 text-xs text-slate-300">
              Build an ATS-optimised resume in minutes with CVixeo — free to start.
            </p>
            <Link
              href="/signup"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-all duration-200 hover:bg-green-600 hover:text-white active:bg-green-700"
            >
              Build your CV free
            </Link>
          </div>
        </div>

        {/* ── Related articles ── */}
        {related.length > 0 && (
          <div className="border-t border-gray-100 bg-slate-50">
            <div className="mx-auto max-w-5xl px-6 py-12">
              <div className="mb-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  You might also like
                </h2>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid gap-5 sm:grid-cols-3">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
