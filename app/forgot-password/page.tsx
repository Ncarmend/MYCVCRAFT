"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { authErrorMessage } from "@/lib/ui-errors";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { lang } = useLanguage();
  const T = translations[lang].ui;
  const A = T.auth;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      setSent(true);
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
          <h1 className="mt-6 text-2xl font-bold text-gray-900">{A.forgot.title}</h1>
          <p className="mt-1 text-xs text-gray-500">
            {A.forgot.subtitle}
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-100">
          {sent ? (
            <div className="text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mx-auto">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <p className="font-medium text-gray-900">{A.forgot.sentTitle}</p>
              <p className="text-sm text-gray-500">
                {A.forgot.sentBody} <strong>{email}</strong>.
              </p>
              <Link href="/login" className="block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                {A.forgot.back}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <Input
                label={A.email}
                type="email"
                placeholder={A.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" size="lg" className="w-full" loading={loading}>
                {A.forgot.submit}
              </Button>
              <p className="text-center text-xs text-gray-500">
                <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">
                  {A.forgot.back}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
