/**
 * Landing page hero section
 */
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Background gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-indigo-50 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-purple-50 opacity-50 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 text-center lg:pt-32">
        {/* Social proof badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-700">
          <Star className="h-3.5 w-3.5 fill-indigo-500 text-indigo-500" />
          Trusted by 10,000+ professionals
        </div>

        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
          Build your perfect CV{" "}
          <span className="relative">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              with AI
            </span>
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500 sm:text-xl">
          Generate ATS-optimized, professionally crafted CVs in minutes. Match
          your CV to job descriptions, get AI improvement suggestions, and
          download beautiful PDFs.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button size="lg" className="gap-2 px-8">
              <Sparkles className="h-5 w-5" />
              Build your CV free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="secondary">
              View pricing
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-sm text-gray-400">
          No credit card required · Free plan available
        </p>

        {/* Hero CV preview mockup */}
        <div className="mt-16 flow-root sm:mt-20">
          <div className="relative mx-auto max-w-5xl rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-3xl lg:p-4">
            <div className="rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <div className="mx-auto flex-1 max-w-xs rounded-md bg-white px-3 py-1 text-xs text-gray-400 text-center border border-gray-200">
                  app.cvcraft.io/dashboard
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="grid grid-cols-12 min-h-[380px]">
                {/* Sidebar */}
                <div className="col-span-2 border-r border-gray-100 bg-gray-50 p-3">
                  <div className="mb-6 h-8 w-8 rounded-lg bg-indigo-600" />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="mb-2 h-6 rounded-md bg-gray-200" style={{ width: `${60 + i * 5}%`, opacity: 1 - i * 0.15 }} />
                  ))}
                </div>
                {/* Main content */}
                <div className="col-span-10 p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="h-7 w-32 rounded-lg bg-gray-200" />
                    <div className="h-9 w-28 rounded-lg bg-indigo-600" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { w: "full", h: "48", color: "indigo" },
                      { w: "full", h: "48", color: "purple" },
                      { w: "full", h: "48", color: "gray", dashed: true },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className={`rounded-xl ${card.dashed ? "border-2 border-dashed border-gray-200 flex items-center justify-center" : `bg-gradient-to-br ${i === 0 ? "from-indigo-50 to-indigo-100 border border-indigo-100" : "from-purple-50 to-purple-100 border border-purple-100"}`} p-4`}
                        style={{ height: "140px" }}
                      >
                        {card.dashed ? (
                          <div className="text-center text-gray-400">
                            <div className="mx-auto mb-1 h-6 w-6 rounded-md border-2 border-dashed border-gray-300" />
                            <div className="text-xs">New CV</div>
                          </div>
                        ) : (
                          <>
                            <div className="mb-3 h-4 w-24 rounded bg-current opacity-20" />
                            <div className="mb-1.5 h-3 w-full rounded bg-current opacity-10" />
                            <div className="mb-1.5 h-3 w-4/5 rounded bg-current opacity-10" />
                            <div className="mt-4 flex gap-2">
                              <div className="h-6 w-16 rounded-md bg-white/60" />
                              <div className="h-6 w-16 rounded-md bg-white/60" />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
