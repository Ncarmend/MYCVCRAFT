/**
 * Onboarding flow — shown after first sign-up
 * Collects name and job goal, then redirects to dashboard
 */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ChevronRight, Briefcase, User } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  jobTitle: z.string().min(2, "Please enter your current or target job title"),
  goal: z.enum(["new_job", "promotion", "freelance", "other"]),
});

type FormData = z.infer<typeof schema>;

const GOALS = [
  { value: "new_job", label: "Find a new job", emoji: "🎯" },
  { value: "promotion", label: "Get a promotion", emoji: "🚀" },
  { value: "freelance", label: "Go freelance", emoji: "💼" },
  { value: "other", label: "Other", emoji: "✨" },
] as const;

const STEPS = [
  { id: 1, title: "What's your name?", icon: User },
  { id: 2, title: "What's your goal?", icon: Briefcase },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

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
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, jobTitle: data.jobTitle }),
      });
      router.push("/dashboard?welcome=true");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">CVCraft</span>
        </div>

        {/* Progress steps */}
        <div className="mb-8 flex items-center justify-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
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
            {step === 1 ? "Welcome to CVCraft! 👋" : "What are you aiming for?"}
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            {step === 1
              ? "Let's set up your profile in just two quick steps."
              : "This helps us tailor your experience."}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <>
                <Input
                  label="Full name"
                  placeholder="Jane Smith"
                  error={errors.name?.message}
                  {...register("name")}
                />
                <Input
                  label="Current or target job title"
                  placeholder="Software Engineer"
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
                  Continue
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
                        "flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all",
                        selectedGoal === goal.value
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                          : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200"
                      )}
                    >
                      <span className="text-2xl">{goal.emoji}</span>
                      <span className="text-xs font-medium">{goal.label}</span>
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
                    Back
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    loading={saving}
                    className="flex-1 gap-2"
                  >
                    Let&apos;s go!
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
