/**
 * Main dashboard page — shows CV grid + stats
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { Header } from "@/components/dashboard/Header";
import { CVCard } from "@/components/dashboard/CVCard";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Sparkles, TrendingUp, Target } from "lucide-react";
import type { CV } from "@/types";

export default async function DashboardPage() {
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
  const isPro = dbUser?.subscription?.plan === "PRO";
  const canCreateCV = isPro || cvs.length < 1;

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
    {
      label: "Total CVs",
      value: cvs.length,
      icon: FileText,
      color: "indigo",
    },
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
      value: isPro ? "Pro ✨" : "Free",
      icon: Sparkles,
      color: "purple",
    },
  ];

  return (
    <div>
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

      <div className="p-8">
        {/* Stats grid */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-gray-300" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Free plan banner */}
        {!isPro && (
          <div className="mb-8 flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
            <div>
              <p className="font-semibold">Unlock unlimited CVs with Pro</p>
              <p className="mt-0.5 text-sm text-indigo-100">
                Get AI optimization, job matching, cover letters + PDF export
              </p>
            </div>
            <Link href="/pricing">
              <Button className="bg-white text-indigo-700 hover:bg-indigo-50 flex-shrink-0">
                Upgrade — $12/mo
              </Button>
            </Link>
          </div>
        )}

        {/* CV grid */}
        <div>
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Your CVs
          </h2>
          {cvs.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-16 text-center">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cvs.map((cv, i) => (
                <CVCard key={cv.id} cv={cv} index={i} isPro={isPro} />
              ))}
              {/* Add new CV card */}
              {canCreateCV && (
                <Link href="/cv/new">
                  <div className="flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all hover:border-indigo-300 hover:bg-indigo-50">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                      <Plus className="h-5 w-5" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-gray-600">
                      New CV
                    </p>
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
