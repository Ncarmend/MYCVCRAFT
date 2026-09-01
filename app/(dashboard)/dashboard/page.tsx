/**
 * Main dashboard page — shows CV grid + stats
 */
export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { CVCard } from "@/components/dashboard/CVCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Sparkles, TrendingUp, Target, CheckCircle } from "lucide-react";
import { SubscriptionSuccessSync } from "@/components/dashboard/SubscriptionSuccessSync";
import { PassCountdown } from "@/components/dashboard/PassCountdown";
import { translations } from "@/lib/translations";
import { isProUser, getPassState } from "@/lib/isPro";
import { getPlanTypeFromPriceId } from "@/lib/plans";
import type { CV } from "@/types";

interface Props {
  searchParams: Promise<{ success?: string; transaction_id?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { success, transaction_id } = await searchParams;

  const cookieStore = await cookies();
  const lang = cookieStore.get("cv-lang")?.value === "fr" ? "fr" : "en";
  const T = translations[lang].dashboard;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      subscription: true,
      cvs: { orderBy: { updatedAt: "desc" } },
    },
  });

  const cvs = (dbUser?.cvs ?? []) as unknown as CV[];
  const sub = dbUser?.subscription;
  const isPro = isProUser(sub);
  const canCreateCV = isPro || cvs.length < 1;

  const { active: passActive, end: passEnd } = getPassState(sub);

  const planTier = getPlanTypeFromPriceId(sub?.paddlePriceId) ?? "MONTHLY";
  const planName = passActive
    ? lang === "fr" ? "Pass Premium 7 jours" : "7-Day Premium Pass"
    : isPro
      ? planTier === "ANNUAL"
        ? lang === "fr" ? "Premium Annuel" : "Annual Premium"
        : lang === "fr" ? "Premium Mensuel" : "Monthly Premium"
      : null;

  const avgATS =
    cvs.filter((c) => c.atsScore !== null).length > 0
      ? Math.round(
          cvs
            .filter((c) => c.atsScore !== null)
            .reduce((sum, c) => sum + (c.atsScore ?? 0), 0) /
            cvs.filter((c) => c.atsScore !== null).length
        )
      : null;

  const stats = [
    { label: T.stats.totalCVs,  value: cvs.length,                                                    icon: FileText,   color: "indigo" },
    { label: T.stats.published, value: cvs.filter((c) => c.status === "PUBLISHED").length,             icon: TrendingUp, color: "green"  },
    { label: T.stats.avgATS,    value: avgATS !== null ? `${avgATS}%` : "—",                           icon: Target,     color: "amber"  },
    { label: T.stats.plan,      value: isPro ? T.stats.premiumValue : T.stats.freeValue,               icon: Sparkles,   color: "purple" },
  ];

  return (
    <div>
      {success === "true" && <SubscriptionSuccessSync transactionId={transaction_id} />}

      <Header
        title={T.title}
        subtitle={`${T.welcomeBack}${dbUser?.name ? `, ${dbUser.name.split(" ")[0]}` : ""} !`}
        actions={
          canCreateCV ? (
            <Link href="/cv/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                {T.newCV}
              </Button>
            </Link>
          ) : (
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                {T.upgradeForMore}
              </Button>
            </Link>
          )
        }
      />

      <div className="mx-auto max-w-4xl p-3 sm:p-6">
        {/* Stats grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-gray-300" />
              </div>
              <p className="mt-1.5 text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Premium Active banner */}
        {isPro && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">{T.premiumBanner.allUnlocked}</p>
                {planName && (
                  <p className="text-xs font-medium text-emerald-700">{planName}</p>
                )}
                {passActive && passEnd ? (
                  <PassCountdown passEnd={passEnd.toISOString()} />
                ) : (
                  <p className="mt-0.5 text-sm text-emerald-700">{T.premiumBanner.features}</p>
                )}
              </div>
            </div>
            <Badge variant="success" className="shrink-0 self-start">
              Premium
            </Badge>
          </div>
        )}

        {/* CV grid */}
        <div className="mb-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{T.cvGrid.heading}</h2>
            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-slate-600" />
          </div>
          {cvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-950">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{T.cvGrid.noTitle}</h3>
              <p className="mt-1 text-sm text-gray-500">{T.cvGrid.noSubtitle}</p>
              <Link href="/cv/new" className="mt-6">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  {T.cvGrid.createFirst}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid justify-center gap-4 grid-cols-[repeat(auto-fill,480px)]">
              {cvs.map((cv, i) => (
                <CVCard key={cv.id} cv={cv} index={i} isPro={isPro} />
              ))}
              {canCreateCV && (
                <Link href="/cv/new">
                  <div className="flex h-full min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-emerald-200 hover:bg-emerald-50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                      <Plus className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-600">{T.cvGrid.newCVCard}</p>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Free plan upgrade prompt */}
        {!isPro && (
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="mb-2 inline-block rounded-full bg-amber-200 px-3 py-0.5 text-xs font-semibold text-amber-900">
                  {T.upgradeBanner.badge}
                </span>
                <p className="text-sm font-semibold text-slate-800">{T.upgradeBanner.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{T.upgradeBanner.subtitle}</p>
              </div>
              <Link href="/pricing" className="shrink-0">
                <Button
                  size="sm"
                  className="w-full bg-slate-600 text-white hover:bg-green-600 active:bg-green-700 sm:w-auto"
                >
                  {T.upgradeBanner.cta}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
