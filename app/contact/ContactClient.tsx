"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import {
  Mail,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  MessageSquare,
  Shield,
} from "lucide-react";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full rounded-xl bg-white px-5 py-4 text-left ring-1 ring-gray-100 transition-all duration-200 ease-in-out hover:ring-green-200 focus:outline-none"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        {open
          ? <ChevronUp className="h-4 w-4 shrink-0 text-green-700" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
        }
      </div>
      {open && <p className="mt-3 text-sm leading-relaxed text-slate-500">{a}</p>}
    </button>
  );
}

export function ContactClient() {
  const { lang } = useLanguage();
  const T = translations[lang].contact;

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  const inputBase =
    "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-green-600 focus:outline-none focus:ring-1 focus:ring-green-600";

  return (
    <main className="flex-1 bg-slate-50">
      {/* Page header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {T.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{T.subtitle}</p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* LEFT: Form */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-900">{T.form.successTitle}</h2>
                <p className="mt-2 text-sm text-slate-500">{T.form.successText}</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-lg bg-slate-800 px-5 py-2 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-green-700"
                >
                  {lang === "fr" ? "Envoyer un autre message" : "Send another message"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-5">
                  <MessageSquare className="h-4 w-4 text-slate-400" />
                  <h2 className="text-sm font-semibold text-slate-700">
                    {lang === "fr" ? "Votre message" : "Your message"}
                  </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      {T.form.name} <span className="text-red-500">*</span>
                    </label>
                    <input required type="text" name="name" value={form.name} onChange={handleChange} placeholder={T.form.namePlaceholder} className={inputBase} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                      {T.form.email} <span className="text-red-500">*</span>
                    </label>
                    <input required type="email" name="email" value={form.email} onChange={handleChange} placeholder={T.form.emailPlaceholder} className={inputBase} />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {T.form.subject} <span className="text-red-500">*</span>
                  </label>
                  <input required type="text" name="subject" value={form.subject} onChange={handleChange} placeholder={T.form.subjectPlaceholder} className={inputBase} />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                    {T.form.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea required name="message" value={form.message} onChange={handleChange} rows={6} placeholder={T.form.messagePlaceholder} className={`${inputBase} resize-none leading-relaxed`} />
                </div>

                {status === "error" && (
                  <p className="rounded-lg bg-red-50 px-4 py-2.5 text-xs text-red-600 ring-1 ring-red-100">
                    {T.form.errorText}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-slate-800 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-green-700 active:bg-green-700 disabled:opacity-60"
                >
                  {status === "sending" ? T.form.submitting : T.form.submit}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: Support info + FAQ */}
          <div className="space-y-6">
            <div className="rounded-2xl bg-slate-800 p-6 text-white">
              <h2 className="text-base font-bold">{T.support.heading}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{T.support.subheading}</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{T.support.emailLabel}</p>
                    <a href={`mailto:${T.support.email}`} className="mt-0.5 text-sm font-medium text-white transition-colors hover:text-green-400">{T.support.email}</a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{T.support.responseLabel}</p>
                    <p className="mt-0.5 text-sm font-medium text-white">{T.support.responseTime}</p>
                    <p className="text-xs text-slate-400">{T.support.responseNote}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs leading-relaxed text-slate-300">{T.support.reassurance}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">{T.faq.title}</p>
              <div className="space-y-2">
                {T.faq.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
