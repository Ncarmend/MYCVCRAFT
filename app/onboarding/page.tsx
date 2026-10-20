/**
 * Onboarding flow — shown after first sign-up
 * Collects name and job goal, then redirects to dashboard
 */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ChevronRight, Briefcase, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

function makeSchema(v: (typeof translations)[keyof typeof translations]["ui"]["auth"]["validation"]) {
  return z.object({
    name: z.string().min(2, v.fullName),
    jobTitle: z.string().min(2, v.jobTitle),
    goal: z.enum(["new_job", "promotion", "freelance", "other"]),
  });
}

type FormData = z.infer<ReturnType<typeof makeSchema>>;

// Labels come from translations[lang].ui.onboarding.goals.
const GOALS = [
  { value: "new_job", emoji: "🎯" },
  { value: "promotion", emoji: "🚀" },
  { value: "freelance", emoji: "💼" },
  { value: "other", emoji: "✨" },
] as const;

const STEPS = [
  { id: 1, key: "stepName", icon: User },
  { id: 2, key: "stepGoal", icon: Briefcase },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const { lang } = useLanguage();
  const U = translations[lang].ui;
  const O = U.onboarding;
  const schema = useMemo(() => makeSchema(U.auth.validation), [U.auth.validation]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { goal: "new_job" },
  });

  const selectedGoal = watch("goal");

  async function onSubmit(data: FormData) {
    setSaving(true);
    try {
      // Update user profile
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, jobTitle: data.jobTitle }),
      });
      if (!res.ok) throw new Error("profile_save_failed");
      router.push("/dashboard?welcome=true");
    } catch {
      toast.error(O.saveFailed);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <Logo height={36} />
          </Link>
        </div>

        {/* Progress steps */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3" aria-label={O[s.key]}>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-all",
                  step >= s.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                {s.id}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 rounded-full transition-all",
                    step > s.id ? "bg-indigo-600" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {step === 1 ? O.welcome : O.aiming}
          </h1>
          <p className="mb-4 text-xs text-gray-500">
            {step === 1
              ? O.intro1
              : O.intro2}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {step === 1 && (
              <>
                <Input
                  label={U.auth.signup.fullName}
                  placeholder={U.auth.signup.namePlaceholder}
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label={O.jobTitle}
                  placeholder={O.jobPlaceholder}
                  error={errors.jobTitle?.message}
                  {...register("jobTitle")}
                />
                <Button
                  type="button"
                  size="lg"
                  className="w-full gap-2"
                  onClick={async () => {
                    // Validate step 1 fields before advancing
                    const name = watch("name");
                    const jobTitle = watch("jobTitle");
                    if (!name || name.length < 2) return;
                    if (!jobTitle || jobTitle.length < 2) return;
                    setStep(2);
                  }}
                >
                  {O.continue}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.value}
                      type="button"
                      onClick={() => setValue("goal", goal.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all",
                        selectedGoal === goal.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                      )}
                    >
                      <span className="text-2xl">{goal.emoji}</span>
                      <span className="text-xs font-medium">{O.goals[goal.value]}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    {O.back}
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    loading={saving}
                    className="flex-1 gap-2"
                  >
                    {O.finish}
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
