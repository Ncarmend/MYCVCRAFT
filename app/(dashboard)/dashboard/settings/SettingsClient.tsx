"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User, Lock, CreditCard, Trash2, ExternalLink, Sparkles,
  FileText, Bot,
} from "lucide-react";
import Link from "next/link";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

type Tab = "account" | "cv" | "ai";

type CVAISettings = {
  cvLanguage: string;
  cvFont: string;
  cvColor: string;
  cvFormat: string;
  showSummary: boolean;
  showProjects: boolean;
  showSkills: boolean;
  showInterests: boolean;
  aiTone: string;
  aiLength: string;
  aiLanguage: string;
  aiStyle: string;
};

const DEFAULT_SETTINGS: CVAISettings = {
  cvLanguage: "en",
  cvFont: "Inter",
  cvColor: "#4f46e5",
  cvFormat: "A4",
  showSummary: true,
  showProjects: true,
  showSkills: true,
  showInterests: false,
  aiTone: "professional",
  aiLength: "medium",
  aiLanguage: "en",
  aiStyle: "corporate",
};

interface Props {
  user: {
    name: string;
    email: string;
    plan: "FREE" | "PRO";
    paddleCustomerId: string | null;
    currentPeriodEnd: string | null;
  };
}

export function SettingsClient({ user }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const { lang } = useLanguage();
  const T = translations[lang].settings;

  const [activeTab, setActiveTab] = useState<Tab>("account");

  // Profile
  const [name, setName] = useState(user.name);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  // CV / AI settings
  const [settings, setSettings] = useState<CVAISettings>(DEFAULT_SETTINGS);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
        }
      } finally {
        setLoadingSettings(false);
      }
    })();
  }, []);

  async function handleSaveProfile(e: { preventDefault(): void }) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(T.toasts.profileUpdated);
      router.refresh();
    } catch {
      toast.error(T.toasts.profileFailed);
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: { preventDefault(): void }) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error(T.toasts.passwordTooShort);
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success(T.toasts.passwordUpdated);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : T.toasts.passwordFailed);
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleOpenPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/paddle/portal", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : T.toasts.portalFailed);
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== user.email) {
      toast.error(T.toasts.emailMismatch);
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      toast.error(T.toasts.deleteFailed);
    } finally {
      setDeleting(false);
    }
  }

  async function handleSaveSettings() {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success(T.toasts.settingsSaved);
    } catch {
      toast.error(T.toasts.settingsFailed);
    } finally {
      setSavingSettings(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: T.tabs.account, icon: <User className="h-4 w-4" /> },
    { id: "cv",      label: T.tabs.cv,      icon: <FileText className="h-4 w-4" /> },
    { id: "ai",      label: T.tabs.ai,      icon: <Bot className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Tab nav */}
      <div className="flex gap-1 border-b border-gray-200 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-slate-600 text-slate-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Account tab ── */}
      {activeTab === "account" && (
        <div className="space-y-6">
          {/* Profile */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <User className="h-4 w-4 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">{T.profile.title}</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-2">
              <Input
                label={T.profile.displayName}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={T.profile.displayNamePlaceholder}
              />
              <Input
                label={T.profile.email}
                value={user.email}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" loading={savingProfile}>
                  {T.profile.saveChanges}
                </Button>
              </div>
            </form>
          </section>

          {/* Password */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="h-4 w-4 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">{T.password.title}</h2>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-2">
              <Input
                label={T.password.currentPwd}
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label={T.password.newPwd}
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={T.password.newPwdPlaceholder}
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" loading={savingPassword}>
                  {T.password.update}
                </Button>
              </div>
            </form>
          </section>

          {/* Billing */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">{T.subscription.title}</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {user.plan === "PRO" ? T.subscription.proPlan : T.subscription.freePlan} plan
                  </span>
                  {user.plan === "PRO" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      <Sparkles className="h-3 w-3" /> {T.subscription.active}
                    </span>
                  )}
                </div>
                {user.currentPeriodEnd && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    {T.subscription.renews} {new Date(user.currentPeriodEnd).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US")}
                  </p>
                )}
              </div>
              {user.plan === "PRO" ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                  onClick={handleOpenPortal}
                  loading={portalLoading}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {T.subscription.manageBilling}
                </Button>
              ) : (
                <Link href="/pricing">
                  <Button size="sm" className="gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    {T.subscription.upgradeToPro}
                  </Button>
                </Link>
              )}
            </div>
          </section>

          {/* Danger zone */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-100">
            <div className="flex items-center gap-2 mb-5">
              <Trash2 className="h-4 w-4 text-red-500" />
              <h2 className="font-semibold text-red-600">{T.danger.title}</h2>
            </div>
            <p className="text-xs text-gray-500 mb-2">
              {T.danger.description} <strong>{user.email}</strong> {T.danger.descriptionEnd}
            </p>
            <div className="space-y-3">
              <Input
                placeholder={user.email}
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
              />
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleDeleteAccount}
                loading={deleting}
                disabled={deleteConfirm !== user.email}
              >
                <Trash2 className="h-3.5 w-3.5" />
                {T.danger.deleteBtn}
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* ── CV Preferences tab ── */}
      {activeTab === "cv" && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-6">
          {loadingSettings ? (
            <p className="text-sm text-gray-400">{T.cv.loading}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.cv.language}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.cvLanguage}
                    onChange={(e) => setSettings({ ...settings, cvLanguage: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.cv.font}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.cvFont}
                    onChange={(e) => setSettings({ ...settings, cvFont: e.target.value })}
                  >
                    <option value="Inter">Inter</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.cv.pageFormat}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.cvFormat}
                    onChange={(e) => setSettings({ ...settings, cvFormat: e.target.value })}
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">US Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.cv.accentColor}</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="h-9 w-14 cursor-pointer rounded-lg border border-gray-200 p-0.5"
                      value={settings.cvColor}
                      onChange={(e) => setSettings({ ...settings, cvColor: e.target.value })}
                    />
                    <span className="text-sm text-gray-500 font-mono">{settings.cvColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">{T.cv.visibleSections}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { key: "showSummary"   as const, label: T.cv.summary   },
                    { key: "showProjects"  as const, label: T.cv.projects  },
                    { key: "showSkills"    as const, label: T.cv.skills    },
                    { key: "showInterests" as const, label: T.cv.interests },
                  ] as const).map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600"
                        checked={settings[key]}
                        onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings} loading={savingSettings}>
                  {T.cv.save}
                </Button>
              </div>
            </>
          )}
        </section>
      )}

      {/* ── AI Preferences tab ── */}
      {activeTab === "ai" && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-6">
          {loadingSettings ? (
            <p className="text-sm text-gray-400">{T.cv.loading}</p>
          ) : (
            <>
              <p className="text-xs text-gray-500">{T.ai.hint}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.ai.tone}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiTone}
                    onChange={(e) => setSettings({ ...settings, aiTone: e.target.value })}
                  >
                    <option value="professional">{T.ai.tones.professional}</option>
                    <option value="friendly">{T.ai.tones.friendly}</option>
                    <option value="formal">{T.ai.tones.formal}</option>
                    <option value="creative">{T.ai.tones.creative}</option>
                    <option value="concise">{T.ai.tones.concise}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.ai.outputLength}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiLength}
                    onChange={(e) => setSettings({ ...settings, aiLength: e.target.value })}
                  >
                    <option value="short">{T.ai.lengths.short}</option>
                    <option value="medium">{T.ai.lengths.medium}</option>
                    <option value="long">{T.ai.lengths.long}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.ai.outputLanguage}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiLanguage}
                    onChange={(e) => setSettings({ ...settings, aiLanguage: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="pt">Português</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">{T.ai.writingStyle}</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiStyle}
                    onChange={(e) => setSettings({ ...settings, aiStyle: e.target.value })}
                  >
                    <option value="corporate">{T.ai.styles.corporate}</option>
                    <option value="startup">{T.ai.styles.startup}</option>
                    <option value="academic">{T.ai.styles.academic}</option>
                    <option value="creative">{T.ai.styles.creative}</option>
                    <option value="tech">{T.ai.styles.tech}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings} loading={savingSettings}>
                  {T.ai.save}
                </Button>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
