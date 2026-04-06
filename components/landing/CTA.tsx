/**
 * Call to action section for the landing page
 */
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-indigo-600 py-24">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to land your dream job?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-indigo-100">
          Join 10,000+ professionals who have already leveled up their job
          search with CVCraft. Start free, upgrade when you need.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-50 gap-2 px-8 shadow-lg"
            >
              <Sparkles className="h-5 w-5" />
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/20"
            >
              See all plans
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-indigo-200">
          No credit card required · Cancel anytime · 7-day Pro trial
        </p>
      </div>
    </section>
  );
}
