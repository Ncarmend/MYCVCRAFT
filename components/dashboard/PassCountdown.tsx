"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface PassCountdownProps {
  passEnd: string; // ISO string
}

function formatDate(d: Date, lang: string) {
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function PassCountdown({ passEnd }: PassCountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const end         = new Date(passEnd);
  // Activation date approximated as 7 days before expiry
  const activated   = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
  const remaining   = Math.max(0, end.getTime() - now);
  const days        = Math.floor(remaining / 86_400_000);
  const hours       = Math.floor((remaining % 86_400_000) / 3_600_000);
  const mins        = Math.floor((remaining % 3_600_000) / 60_000);

  return (
    <div className="mt-1 space-y-1">
      <p className="text-sm text-emerald-700">
        <span className="font-medium">Activated:</span> {formatDate(activated, "en")}
        {" · "}
        <span className="font-medium">Expires:</span> {formatDate(end, "en")}
      </p>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-800">
        <Timer className="h-4 w-4 shrink-0 text-emerald-600" />
        {days > 0 && `${days}d `}{hours}h {mins}m remaining
      </p>
    </div>
  );
}
