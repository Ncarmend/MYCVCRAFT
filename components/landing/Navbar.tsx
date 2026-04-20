"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          CVCraft
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 sm:flex">
          <Link href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Mobile: get started + hamburger */}
        <div className="flex items-center gap-2 sm:hidden">
          <Link
            href="/signup"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-indigo-600 px-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Get started
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 transition-colors"
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
            <Link
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Pricing
            </Link>
            <div className="my-2 border-t border-gray-100" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
