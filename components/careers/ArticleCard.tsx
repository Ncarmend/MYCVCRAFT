import Link from "next/link";
import { Clock, Calendar } from "lucide-react";
import { Article, categoryStyle } from "@/lib/articles";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function ArticleCard({ article }: { article: Article }) {
  const style = categoryStyle[article.category];

  return (
    <Link
      href={`/careers/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Gradient cover */}
      <div
        className={`relative h-36 bg-linear-to-br ${style.gradient} shrink-0`}
      >
        {/* Dot-pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "18px 18px",
          }}
        />
        {/* Category badge */}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.badge}`}
        >
          {article.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.publishedAt)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime} min read
          </span>
        </div>

        <h3 className="text-sm font-bold leading-snug text-slate-900 group-hover:text-green-700 transition-colors duration-150 line-clamp-2">
          {article.title}
        </h3>

        <p className="flex-1 text-xs leading-relaxed text-slate-500 line-clamp-3">
          {article.description}
        </p>

        <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-green-700 transition-colors duration-150 group-hover:text-green-800">
          Read article
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </div>
    </Link>
  );
}
