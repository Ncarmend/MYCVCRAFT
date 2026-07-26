"use client";

import { useState, useEffect, FormEvent } from "react";

const FEATURES = [
  { label: "Optimisation ATS" },
  { label: "Lettre de motivation IA" },
  { label: "Bilingue FR / EN" },
];

const AVATARS = [
  { bg: "bg-green-500", letter: "A" },
  { bg: "bg-green-600", letter: "B" },
  { bg: "bg-green-700", letter: "C" },
];

export default function WaitlistPage() {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 100);

    // Compteur animé
    let current = 0;
    const target = 247;
    const step = Math.ceil(target / 60);
    const counter = setInterval(() => {
      current += step;
      if (current >= target) {
        setCount(target);
        clearInterval(counter);
      } else {
        setCount(current);
      }
    }, 20);

    return () => {
      clearTimeout(showTimer);
      clearInterval(counter);
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // TODO: connecter Brevo ou autre service email ici
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="relative min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-16 overflow-hidden font-sans">

      {/* Lueur verte ambiante */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-green-500/5 blur-3xl" />

      {/* Grille de fond */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Contenu principal */}
      <div
        className={`relative z-10 w-full max-w-lg transition-all duration-700 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">

          <div className="flex items-center gap-3 mb-6">
            {/* Icône CV */}
            <div className="relative w-11 h-14 flex-shrink-0">
              {/* Page arrière slate */}
              <div className="absolute top-1 left-0 w-9 h-12 bg-slate-700 rounded-md" />
              {/* Page avant */}
              <div className="absolute top-0 left-1.5 w-9 h-12 bg-slate-900 border border-slate-800 rounded-md overflow-hidden">
                {/* Bandeau vert */}
                <div className="h-3 bg-green-600 rounded-t-md" />
                {/* Avatar */}
                <div className="w-3.5 h-3.5 bg-slate-700 rounded-full mx-auto mt-1.5 mb-1" />
                {/* Lignes */}
                <div className="h-0.5 bg-slate-700 rounded mx-auto mb-1" style={{ width: "28px" }} />
                <div className="h-0.5 bg-slate-700 rounded mx-auto mb-1" style={{ width: "22px" }} />
                <div className="h-0.5 bg-slate-700 rounded mx-auto" style={{ width: "26px" }} />
              </div>
              {/* Coin vert replié */}
              <div
                className="absolute bottom-0 right-1.5"
                style={{
                  width: 0,
                  height: 0,
                  borderStyle: "solid",
                  borderWidth: "0 0 12px 12px",
                  borderColor: "transparent transparent #16a34a transparent",
                }}
              />
            </div>

            {/* Texte Cvixeo */}
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-green-500 tracking-tight">CV</span>
              <span className="text-4xl font-medium text-slate-50 tracking-tight relative">
                i
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-green-500 text-xs animate-pulse">
                  ✦
                </span>
              </span>
              <span className="text-4xl font-medium text-slate-50 tracking-tight">xeo</span>
            </div>
          </div>

          {/* Badge lancement */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Lancement bientôt</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-slate-50 text-center leading-tight tracking-tight mb-4">
            Ton CV, enfin{" "}
            <span className="text-green-500">visible</span>.
          </h1>

          <p className="text-slate-400 text-center text-base leading-relaxed max-w-md">
            Cvixeo optimise ton CV pour passer les filtres ATS et décrocher des entretiens.
            Sois parmi les premiers à accéder à l'outil.
          </p>
        </div>

        {/* Formulaire / Confirmation */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="ton@email.com"
                required
                className={`flex-1 px-4 py-3 rounded-xl bg-slate-900 text-slate-50 placeholder-slate-600 text-sm outline-none border transition-colors duration-200 ${
                  focused
                    ? "border-green-500"
                    : "border-slate-800"
                }`}
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-200 whitespace-nowrap ${
                  loading
                    ? "bg-green-900 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 cursor-pointer"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Inscription...
                  </span>
                ) : (
                  "Rejoindre la liste →"
                )}
              </button>
            </div>
            <p className="text-center text-xs text-slate-600 mt-3">
              Aucun spam. Juste une notification quand Cvixeo est prêt.
            </p>
          </form>
        ) : (
          <div className="mb-6 text-center p-6 rounded-xl bg-green-500/10 border border-green-500/20">
            <div className="text-2xl text-green-400 mb-2">✦</div>
            <p className="text-green-400 font-medium mb-1">Tu es sur la liste !</p>
            <p className="text-slate-500 text-sm">
              On te prévient dès que Cvixeo est disponible.
            </p>
          </div>
        )}

        {/* Compteur inscrits */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex">
            {AVATARS.map(({ bg, letter }, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full ${bg} border-2 border-slate-950 flex items-center justify-center text-white text-[10px] font-semibold ${
                  i > 0 ? "-ml-2" : ""
                }`}
              >
                {letter}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-sm">
            <span className="text-slate-200 font-medium">{count}+</span> personnes sur la liste
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          {FEATURES.map(({ label }, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center hover:border-slate-700 transition-colors"
            >
              <span className="text-green-500 text-sm">✦</span>
              <p className="text-slate-500 text-xs mt-1.5">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}