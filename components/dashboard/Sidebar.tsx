/**
 * Dashboard sidebar navigation
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Plus,
  CreditCard,
  Settings,
  Sparkles,
  LogOut,
  ChevronRight,
  X,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/landing/LanguageContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cv/new", label: "New CV", icon: Plus, highlight: true },
  { href: "/dashboard?tab=cvs", label: "My CVs", icon: FileText },
  { href: "/pricing", label: "Upgrade", icon: CreditCard, badge: "Pro", freeOnly: true },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  plan?: "FREE" | "PRO";
  trialEnd?: string | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  userEmail,
  userName,
  plan = "FREE",
  trialEnd,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { lang, setLang } = useLanguage();

  const isPro = plan === "PRO";

  // Compute trial state from the ISO string passed from the server
  const trialEndDate = trialEnd ? new Date(trialEnd) : null;
  const isTrialing = isPro && trialEndDate !== null && trialEndDate > new Date();
  const trialDaysLeft = isTrialing
    ? Math.max(1, Math.ceil((trialEndDate!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Hide "Upgrade" for PRO users — they're already subscribed
  const visibleNavItems = navItems.filter((item) => !(item.freeOnly && isPro));

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-white",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
        "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-bold text-gray-900">Cvixeo</span>
        {isPro && !isTrialing && (
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Premium
          </Badge>
        )}
        {isTrialing && (
          <Badge variant="warning" size="sm">Trial</Badge>
        )}
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Trial countdown */}
      {isTrialing && (
        <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-xs text-amber-700">
          <span className="font-medium">Trial active</span>
          {" · "}
          {trialDaysLeft} day{trialDaysLeft !== 1 ? "s" : ""} remaining
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href.split("?")[0]);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    item.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge && !item.highlight && (
                    <Badge variant="info" size="sm">{item.badge}</Badge>
                  )}
                  {isActive && !item.highlight && (
                    <ChevronRight className="h-3.5 w-3.5 text-indigo-400" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Language toggle */}
      <div className="border-t border-gray-100 px-3 py-2 flex justify-center">
        <div className="flex items-center rounded-lg border border-gray-200 p-0.5 text-xs font-semibold">
          <button
            onClick={() => setLang("en")}
            className={`rounded-md px-3 py-1 transition-colors ${lang === "en" ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`rounded-md px-3 py-1 transition-colors ${lang === "fr" ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            FR
          </button>
        </div>
      </div>

      {/* User info + sign out */}
      <div className="border-t border-gray-100 p-2">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
            {userName
              ? userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {userName || "User"}
            </p>
            <p className="truncate text-xs text-gray-400">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
