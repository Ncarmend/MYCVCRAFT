"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User } from "lucide-react";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const langActive   = "bg-emerald-950 text-white";
const langInactive = "text-slate-600 hover:bg-green-700 hover:text-white";
const langBase     = "rounded-md px-2.5 py-1 transition-all duration-200 ease-in-out text-xs font-semibold";

// Routes that exist in both languages at /x (English) and /fr/x (French).
// Anything else (e.g. /careers/[slug] articles, which have no French version)
// falls back to the nearest supported ancestor.
const LOCALIZED_ROUTES = ["/", "/pricing", "/careers", "/about", "/contact", "/privacy", "/terms", "/cookies", "/legal"];

function localizedHref(pathname: string, target: "en" | "fr"): string {
  const isFrenchPath = pathname === "/fr" || pathname.startsWith("/fr/");
  const unprefixed = isFrenchPath ? (pathname === "/fr" ? "/" : pathname.slice(3)) : pathname;

  const supported = LOCALIZED_ROUTES.includes(unprefixed)
    ? unprefixed
    : LOCALIZED_ROUTES.find((r) => r !== "/" && unprefixed.startsWith(r + "/")) ?? "/";

  if (target === "en") return supported;
  return supported === "/" ? "/fr" : `/fr${supported}`;
}

interface NavbarProps {
  isLoggedIn?: boolean;
  userName?: string;
}

export function Navbar({ isLoggedIn = false, userName }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const T = translations[lang].nav;
  const pathname = usePathname();

  function isActive(href: string): boolean {
    if (!href || href.startsWith("#") || href.startsWith("/#")) return false;
    if (href === "/") return pathname === "/";
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const desktopLink = (href: string) =>
    cn(
      "text-sm font-semibold transition-all duration-200 ease-in-out",
      isActive(href) ? "text-green-800" : "text-slate-900 hover:text-green-800",
    );

  const mobileLink = (href: string) =>
    cn(
      "rounded-lg px-3 py-2.5 text-sm font-semibold transition-all duration-200 ease-in-out",
      isActive(href) ? "bg-green-50 text-green-800" : "text-slate-900 hover:text-green-800",
    );

  const featuresHref = pathname === "/" ? "#features" : "/#features";

  const LangToggle = ({ mobile }: { mobile?: boolean }) => (
    <div className="flex items-center rounded-lg border border-gray-200 p-0.5">
      {(["en", "fr"] as const).map((l) => (
        <Link
          key={l}
          href={localizedHref(pathname, l)}
          onClick={() => setLang(l)}
          className={cn(
            mobile ? "rounded-md px-2 py-1" : langBase,
            lang === l ? langActive : langInactive,
          )}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Logo height={36} />
        </Link>

        {/* Desktop center links */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link href={featuresHref} className={desktopLink(featuresHref)}>
            {T.features}
          </Link>
          <Link href="/pricing" className={desktopLink("/pricing")}>
            {T.pricing}
          </Link>
          <Link href="/careers" className={desktopLink("/careers")}>
            {T.careers}
          </Link>
          <Link href="/contact" className={desktopLink("/contact")}>
            {T.contact}
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className={desktopLink("/dashboard")}>
              {T.myResumes}
            </Link>
          )}
        </div>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 sm:flex">
          <LangToggle />
          {isLoggedIn ? (
            <Link
              href="/dashboard/settings"
              className={cn(
                "inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-all duration-200 ease-in-out",
                isActive("/dashboard/settings")
                  ? "bg-green-700 text-white"
                  : "bg-slate-800 text-white hover:bg-green-700",
              )}
            >
              <User className="h-4 w-4" />
              {userName ? userName.split(" ")[0] : T.myAccount}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:text-green-700"
              >
                {T.signIn}
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-800 px-4 text-sm font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-green-700 active:bg-green-700"
              >
                {T.getStarted}
              </Link>
            </>
          )}
        </div>

        {/* Mobile right cluster */}
        <div className="flex items-center gap-2 sm:hidden">
          <LangToggle mobile />
          {isLoggedIn ? (
            <Link
              href="/dashboard/settings"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-white transition-all duration-200 ease-in-out hover:bg-green-700"
              aria-label={T.myAccount}
            >
              <User className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href="/signup"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-800 px-3 text-sm font-medium text-white transition-all duration-200 ease-in-out hover:bg-green-700"
            >
              {T.getStarted}
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-lg p-2 text-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-4 sm:hidden">
          <nav className="flex flex-col gap-1">
            <Link href={featuresHref} onClick={() => setMobileOpen(false)} className={mobileLink(featuresHref)}>
              {T.features}
            </Link>
            <Link href="/pricing" onClick={() => setMobileOpen(false)} className={mobileLink("/pricing")}>
              {T.pricing}
            </Link>
            <Link href="/careers" onClick={() => setMobileOpen(false)} className={mobileLink("/careers")}>
              {T.careers}
            </Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)} className={mobileLink("/contact")}>
              {T.contact}
            </Link>

            <div className="my-2 border-t border-gray-200" />

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={mobileLink("/dashboard")}>
                  {T.myResumes}
                </Link>
                <Link href="/dashboard/settings" onClick={() => setMobileOpen(false)} className={mobileLink("/dashboard/settings")}>
                  {T.myAccount}
                </Link>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-900 transition-all duration-200 ease-in-out hover:text-green-700">
                {T.signIn}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
