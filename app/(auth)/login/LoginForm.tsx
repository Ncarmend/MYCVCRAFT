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
import { createClient } from "@/lib/supabase/client";
import { Mail, Lock } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { authErrorMessage } from "@/lib/ui-errors";
import { OAUTH_PROVIDERS } from "@/lib/auth-config";

function makeSchema(v: (typeof translations)[keyof typeof translations]["ui"]["auth"]["validation"]) {
  return z.object({
    email: z.string().email(v.email),
    password: z.string().min(6, v.passwordMin6),
  });
}
type FormData = z.infer<ReturnType<typeof makeSchema>>;

export default function LoginForm({ redirectTo, callbackError = false }: { redirectTo: string; callbackError?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const { lang } = useLanguage();
  const T = translations[lang].ui;
  const A = T.auth;
  const schema = useMemo(() => makeSchema(A.validation), [A.validation]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) throw error;
      toast.success(A.login.success);
      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      toast.error(authErrorMessage(err instanceof Error ? err.message : undefined, T));
    } finally {
      setLoading(false);
    }
  }

  async function signInWithOAuth(provider: "google") {
    setOauthLoading(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=${redirectTo}`,
      },
    });
    if (error) {
      toast.error(authErrorMessage(error.message, T));
      setOauthLoading(null);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-5 text-center">
          <Link href="/" className="inline-flex items-center">
            <Logo height={32} />
          </Link>
          <h1 className="mt-4 text-xl font-bold text-gray-900">{A.login.title}</h1>
          <p className="mt-1 text-xs text-gray-500">
            {A.login.subtitle}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-100">
          {/* Shown when an email/OAuth callback failed (/login?error=...) */}
          {callbackError && (
            <p role="alert" className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 ring-1 ring-red-100">
              {A.errors.callbackFailed}
            </p>
          )}
          {/* Social login: only providers enabled in Supabase (lib/auth-config.ts). */}
          {OAUTH_PROVIDERS.length > 0 && (
            <>
            <div className="space-y-2 mb-4">
              {OAUTH_PROVIDERS.includes("google") && (
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full gap-3"
                  onClick={() => signInWithOAuth("google")}
                  loading={oauthLoading === "google"}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {A.google}
                </Button>
              )}
            </div>

            <div className="relative mb-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400">
                <span className="bg-white px-3">{A.login.divider}</span>
              </div>
            </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            <Input
              label={A.email}
              type="email"
              placeholder={A.emailPlaceholder}
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
            <div>
              <Input
                label={A.password}
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                {...register("password")}
              />
              <div className="mt-1.5 text-right">
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700">
                  {A.login.forgot}
                </Link>
              </div>
            </div>
            <Button type="submit" size="md" className="w-full" loading={loading}>
              {A.login.submit}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            {A.login.noAccount}{" "}
            <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-700">
              {A.login.signupLink}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
