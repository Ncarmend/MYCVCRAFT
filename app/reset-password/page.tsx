"use client";

/**
 * Password reset — target of the email sent from /forgot-password.
 * The link goes through /auth/callback, which exchanges the code for a session
 * and redirects here; the user then sets a new password with updateUser().
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/Logo";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { authErrorMessage } from "@/lib/ui-errors";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const T = translations[lang].ui;
  const A = T.auth;
  const supabase = useMemo(() => createClient(), []);

  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setHasSession(!!data.user));
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Same password rules as sign-up.
    if (password.length < 8) return setError(A.validation.passwordMin8);
    if (!/[A-Z]/.test(password)) return setError(A.validation.uppercase);
    if (!/[0-9]/.test(password)) return setError(A.validation.number);
    if (password !== confirm) return setError(A.validation.mismatch);
    setError(null);
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      toast.success(A.reset.success);
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      toast.error(authErrorMessage(err instanceof Error ? err.message : undefined, T));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center">
            <Logo height={36} />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            {hasSession === false ? A.reset.invalidTitle : A.reset.title}
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            {hasSession === false ? A.reset.invalidBody : A.reset.subtitle}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          {hasSession === false ? (
            <Link href="/forgot-password" className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
              {A.reset.requestNew}
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                label={A.reset.newPassword}
                type="password"
                placeholder={A.signup.passwordPlaceholder}
                leftIcon={<Lock className="h-4 w-4" />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input
                label={A.signup.confirm}
                type="password"
                placeholder={A.signup.confirmPlaceholder}
                leftIcon={<Lock className="h-4 w-4" />}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                error={error ?? undefined}
                required
              />
              <Button type="submit" size="lg" className="w-full" loading={loading} disabled={hasSession === null}>
                {A.reset.submit}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
