/**
 * Main dashboard page — shows CV grid + stats
 */
export const dynamic = "force-dynamic";

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
import type { CV } from "@/types";

interface Props {
  searchParams: Promise<{ success?: string }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const { success } = await searchParams;

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
  const isPro = sub?.plan === "PRO" || !!(sub?.premiumPassEnd && sub.premiumPassEnd > new Date());
  const canCreateCV = isPro || cvs.length < 1;

  const passEnd = sub?.premiumPassEnd ?? null;
  const passActive = isPro && passEnd !== null && passEnd > new Date();
  const passDaysLeft = passActive
    ? Math.max(1, Math.ceil((passEnd!.getTime() - Date.now()) / 86_400_000))
    : 0;
  const passEndLabel = passActive
    ? passEnd!.toLocaleDateString("en-GB", { day: "numeric", month: "long" })
    : null;

  console.log("[dashboard] subscription", {
    userId: dbUser?.id,
    plan: sub?.plan,
    status: sub?.status,
    isPro,
    passActive,
    passEnd,
  });

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
    { label: "Total CVs", value: cvs.length, icon: FileText, color: "indigo" },
    {
      label: "Published",
      value: cvs.filter((c) => c.status === "PUBLISHED").length,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Avg ATS Score",
      value: avgATS !== null ? `${avgATS}%` : "—",
      icon: Target,
      color: "amber",
    },
    {
      label: "Plan",
      value: isPro ? "Premium ✨" : "Free",
      icon: Sparkles,
      color: "purple",
    },
  ];

  return (
    <div>
      {/* Syncs live Stripe state when returning from checkout, then refreshes the page */}
      {success === "true" && <SubscriptionSuccessSync />}

      <Header
        title="Dashboard"
        subtitle={`Welcome back${dbUser?.name ? `, ${dbUser.name.split(" ")[0]}` : ""}!`}
        actions={
          canCreateCV ? (
            <Link href="/cv/new">
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                New CV
              </Button>
            </Link>
          ) : (
            <Link href="/pricing">
              <Button size="sm" variant="outline" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Upgrade for more
              </Button>
            </Link>
          )
        }
      />

      <div className="p-3 sm:p-6">
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
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">
                  Premium Active — all features unlocked
                </p>
                {passActive ? (
                  <p className="mt-0.5 text-sm text-emerald-700">
                    7-Day Pass · {passDaysLeft} day{passDaysLeft !== 1 ? "s" : ""} remaining
                    {passEndLabel && ` · expires ${passEndLabel}`}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-emerald-700">
                    AI generation, ATS analysis, cover letters &amp; unlimited CVs
                  </p>
                )}
              </div>
            </div>
            <Badge variant="success" className="shrink-0 self-start sm:self-auto">
              Premium
            </Badge>
          </div>
        )}

        {/* Free plan upgrade banner */}
        {!isPro && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">Unlock Premium — AI, ATS &amp; unlimited CVs</p>
              <p className="mt-0.5 text-sm text-indigo-100">
                Try 7 days for €3.99 · or subscribe from €9/month
              </p>
            </div>
            <Link href="/pricing" className="shrink-0">
              <Button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 sm:w-auto">
                View plans
              </Button>
            </Link>
          </div>
        )}

        {/* CV grid */}
        <div>
          <h2 className="mb-4 text-base font-semibold text-gray-900">Your CVs</h2>
          {cvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <FileText className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-semibold text-gray-900">No CVs yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create your first AI-powered CV in minutes
              </p>
              <Link href="/cv/new" className="mt-6">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Create my first CV
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {cvs.map((cv, i) => (
                <CVCard key={cv.id} cv={cv} index={i} isPro={isPro} />
              ))}
              {canCreateCV && (
                <Link href="/cv/new">
                  <div className="flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-indigo-300 hover:bg-indigo-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Plus className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-600">New CV</p>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
