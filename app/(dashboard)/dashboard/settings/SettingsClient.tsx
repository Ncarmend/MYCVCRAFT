"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock, CreditCard, Trash2, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";

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

  // Profile form
  const [name, setName] = useState(user.name);
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  // Danger zone
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
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

  async function handleChangePassword(e: React.FormEvent) {
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

  return (
    <>
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
              <span className="font-medium text-gray-900">{user.plan === "PRO" ? "Pro" : "Free"} plan</span>
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
    </>
  );
}
