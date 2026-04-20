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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cv/new", label: "New CV", icon: Plus, highlight: true },
  { href: "/dashboard?tab=cvs", label: "My CVs", icon: FileText },
  { href: "/pricing", label: "Upgrade", icon: CreditCard, badge: "Pro" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  plan?: "FREE" | "PRO";
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ userEmail, userName, plan = "FREE", isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        // Base styles
        "flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-white",
        // Mobile: fixed drawer that slides in/out
        "fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out",
        // Desktop: static in flex flow, always visible
        "lg:static lg:z-auto lg:translate-x-0 lg:transition-none",
        // Toggle on mobile
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <Sparkles className="h-4 w-4" />
        </div>
        <span className="font-bold text-gray-900">CVCraft</span>
        {plan === "PRO" && (
          <Badge variant="info" size="sm">Pro</Badge>
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

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
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
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    item.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && !item.highlight && (
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

      {/* User info + sign out */}
      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
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
