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
    stripeCustomerId: string | null;
    currentPeriodEnd: string | null;
  };
}

export function SettingsClient({ user }: Props) {
  const router = useRouter();
  const supabase = createClient();

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
      toast.success("Profile updated.");
      router.refresh();
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: { preventDefault(): void }) {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleOpenPortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to open billing portal.");
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirm !== user.email) {
      toast.error("Email doesn't match.");
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Deletion failed");
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      toast.error("Failed to delete account. Please try again.");
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
      toast.success("Settings saved.");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setSavingSettings(false);
    }
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "account", label: "Account", icon: <User className="h-4 w-4" /> },
    { id: "cv", label: "CV Preferences", icon: <FileText className="h-4 w-4" /> },
    { id: "ai", label: "AI Preferences", icon: <Bot className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* Tab nav */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              activeTab === t.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
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
              <h2 className="font-semibold text-gray-900">Profile</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Display name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
              <Input
                label="Email"
                value={user.email}
                disabled
                className="opacity-60 cursor-not-allowed"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" loading={savingProfile}>
                  Save changes
                </Button>
              </div>
            </form>
          </section>

          {/* Password */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <Lock className="h-4 w-4 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">Password</h2>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="New password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" loading={savingPassword}>
                  Update password
                </Button>
              </div>
            </form>
          </section>

          {/* Billing */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard className="h-4 w-4 text-indigo-600" />
              <h2 className="font-semibold text-gray-900">Subscription</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {user.plan === "PRO" ? "Pro" : "Free"} plan
                  </span>
                  {user.plan === "PRO" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      <Sparkles className="h-3 w-3" /> Active
                    </span>
                  )}
                </div>
                {user.currentPeriodEnd && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    Renews {new Date(user.currentPeriodEnd).toLocaleDateString()}
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
                  Manage billing
                </Button>
              ) : (
                <Link href="/pricing">
                  <Button size="sm" className="gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>
          </section>

          {/* Danger zone */}
          <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-red-100">
            <div className="flex items-center gap-2 mb-5">
              <Trash2 className="h-4 w-4 text-red-500" />
              <h2 className="font-semibold text-red-600">Danger zone</h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Permanently delete your account and all CVs. This cannot be undone.
              Type your email <strong>{user.email}</strong> to confirm.
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
                Delete my account
              </Button>
            </div>
          </section>
        </div>
      )}

      {/* ── CV Preferences tab ── */}
      {activeTab === "cv" && (
        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-6">
          {loadingSettings ? (
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Language */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Language</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                {/* Font */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Font</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                {/* Format */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Page format</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.cvFormat}
                    onChange={(e) => setSettings({ ...settings, cvFormat: e.target.value })}
                  >
                    <option value="A4">A4</option>
                    <option value="Letter">US Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                {/* Color */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Accent color</label>
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

              {/* Section toggles */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-700">Visible sections</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "showSummary" as const, label: "Summary" },
                    { key: "showProjects" as const, label: "Projects" },
                    { key: "showSkills" as const, label: "Skills" },
                    { key: "showInterests" as const, label: "Interests" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
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
                  Save CV preferences
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
            <p className="text-sm text-gray-400">Loading…</p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                These settings control how the AI generates and rewrites content for your CVs.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Tone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Tone</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiTone}
                    onChange={(e) => setSettings({ ...settings, aiTone: e.target.value })}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="creative">Creative</option>
                    <option value="concise">Concise</option>
                  </select>
                </div>

                {/* Length */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Output length</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiLength}
                    onChange={(e) => setSettings({ ...settings, aiLength: e.target.value })}
                  >
                    <option value="short">Short</option>
                    <option value="medium">Medium</option>
                    <option value="long">Long</option>
                  </select>
                </div>

                {/* AI Language */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Output language</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

                {/* Style */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Writing style</label>
                  <select
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={settings.aiStyle}
                    onChange={(e) => setSettings({ ...settings, aiStyle: e.target.value })}
                  >
                    <option value="corporate">Corporate</option>
                    <option value="startup">Startup</option>
                    <option value="academic">Academic</option>
                    <option value="creative">Creative</option>
                    <option value="tech">Tech</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button size="sm" onClick={handleSaveSettings} loading={savingSettings}>
                  Save AI preferences
                </Button>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
