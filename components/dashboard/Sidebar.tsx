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
  LogOut,
  ChevronRight,
  X,
  CheckCircle,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useLanguage, translations } from "@/components/landing/LanguageContext";

const NAV_CONFIGS = [
  { href: "/dashboard",         key: "dashboard" as const, icon: LayoutDashboard },
  { href: "/cv/new",            key: "newCV"     as const, icon: Plus, highlight: true },
  { href: "/dashboard?tab=cvs", key: "myCVs"     as const, icon: FileText },
  { href: "/pricing",           key: "upgrade"   as const, icon: CreditCard, badge: "Pro", freeOnly: true },
  { href: "/dashboard/settings",key: "settings"  as const, icon: Settings },
];

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  plan?: "FREE" | "PRO";
  passEnd?: string | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  userEmail,
  userName,
  plan = "FREE",
  passEnd,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { lang, setLang } = useLanguage();
  const T = translations[lang].sidebar;

  const isPro = plan === "PRO";

  // Premium Pass state — passEnd is an ISO string from the server
  const passEndDate = passEnd ? new Date(passEnd) : null;
  const passActive = isPro && passEndDate !== null && passEndDate > new Date();
  const passDaysLeft = passActive
    ? Math.max(1, Math.ceil((passEndDate!.getTime() - Date.now()) / 86_400_000))
    : 0;

  const navItems = NAV_CONFIGS.map((item) => ({ ...item, label: T[item.key] }));
  const visibleNavItems = navItems.filter((item) => !("freeOnly" in item && item.freeOnly && isPro));

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "flex h-full w-52 shrink-0 flex-col border-r border-gray-100 bg-white",
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
        "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2.5">
        <Link href="/dashboard" className="flex items-center">
          <Logo height={24} />
        </Link>
        {isPro && !passActive && (
          <Badge variant="success" size="sm" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Premium
          </Badge>
        )}
        {passActive && (
          <Badge variant="warning" size="sm">Pass</Badge>
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

      {/* Pass countdown */}
      {passActive && (
        <div className="border-b border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          <span className="font-medium">{T.pass7Day}</span>
          {" · "}
          {passDaysLeft} {passDaysLeft !== 1 ? T.daysRemaining : T.dayRemaining}
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-0.5">
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
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                    item.highlight
                      ? "bg-slate-600 text-white hover:bg-green-600 active:bg-green-700"
                      : isActive
                      ? "bg-slate-100 text-slate-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {"badge" in item && item.badge && !item.highlight && (
                    <Badge variant="info" size="sm">{item.badge}</Badge>
                  )}
                  {isActive && !item.highlight && (
                    <ChevronRight className="h-3 w-3 text-indigo-400" />
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
            className={`rounded-md px-3 py-1 transition-colors ${lang === "en" ? "bg-slate-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLang("fr")}
            className={`rounded-md px-3 py-1 transition-colors ${lang === "fr" ? "bg-slate-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
          >
            FR
          </button>
        </div>
      </div>

      {/* User info + sign out */}
      <div className="border-t border-gray-100 px-3 py-2">
        <div className="flex items-center gap-2.5 rounded-lg px-0 py-1">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700">
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
            <p className="truncate text-xs font-medium text-gray-900">
              {userName || "User"}
            </p>
            <p className="truncate text-[11px] text-gray-400">{userEmail}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
