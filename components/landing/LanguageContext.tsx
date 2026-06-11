"use client";

import { createContext, useContext, useState, useEffect } from "react";

type Lang = "en" | "fr";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("cv-lang") as Lang | null;
    if (stored === "fr" || stored === "en") {
      setLangState(stored);
    } else {
      const browserFr = navigator.language.startsWith("fr");
      setLangState(browserFr ? "fr" : "en");
    }
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("cv-lang", l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const translations = {
  en: {
    nav: {
      features: "Features",
      pricing: "Pricing",
      signIn: "Sign in",
      getStarted: "Get started",
    },
    hero: {
      badge: "AI-powered CV builder — free to start",
      headline1: "Land your dream job",
      headline2: "with AI",
      subtext:
        "Generate ATS-optimized, professionally crafted CVs in minutes. Match your CV to any job description and download beautiful PDFs instantly.",
      highlights: [
        "ATS-optimized in one click",
        "AI bullet point generation",
        "PDF export included",
      ],
      stats: [
        { value: "10,000+", label: "CVs created" },
        { value: "94%", label: "ATS pass rate" },
        { value: "3×", label: "More interviews" },
      ],
      ctaPrimary: "Build your CV free",
      ctaSecondary: "View pricing",
      noCard: "No credit card required · Free plan available",
      mock: {
        nav: ["Dashboard", "My CVs", "Templates", "Settings", "Support"],
        stats: [
          { label: "Total CVs", value: "3" },
          { label: "Published", value: "2" },
          { label: "Avg ATS", value: "91%" },
          { label: "Plan", value: "Pro ✨" },
        ],
        yourCVs: "Your CVs",
        atsScore: "ATS Score",
        published: "Published",
        draft: "Draft",
        newCV: "New CV",
      },
    },
    features: {
      sectionLabel: "Features",
      headline: "Everything you need to land the job",
      subtext:
        "From first draft to final PDF — CVCraft handles the heavy lifting so you can focus on what matters.",
      items: [
        {
          title: "AI-Powered Generation",
          description:
            "Describe your experience and let GPT-4 write a compelling, professional CV tailored to your target role.",
        },
        {
          title: "ATS Optimization",
          description:
            "Score your CV against Applicant Tracking Systems and get specific suggestions to pass automated screening.",
        },
        {
          title: "Job Description Matching",
          description:
            "Paste any job listing and get a match score plus a list of improvements to tailor your CV perfectly.",
        },
        {
          title: "Beautiful Templates",
          description:
            "Choose from professionally designed templates. Switch between styles instantly without losing your data.",
        },
        {
          title: "One-Click PDF Export",
          description:
            "Download pixel-perfect PDFs that look great on screen and in print. Pro plan removes watermarks.",
        },
        {
          title: "Cover Letter Generator",
          description:
            "Automatically generate personalized cover letters matched to specific job descriptions and companies.",
        },
      ],
    },
    testimonials: {
      sectionLabel: "Testimonials",
      headline: "Loved by job seekers worldwide",
      items: [
        {
          name: "Sarah Chen",
          role: "Software Engineer at Google",
          avatar: "SC",
          content:
            "CVCraft helped me land my dream job at Google. The ATS optimization feature was a game-changer — my CV was getting ignored before, but after the AI suggestions I started getting callbacks within days.",
        },
        {
          name: "Marcus Johnson",
          role: "Product Manager at Stripe",
          avatar: "MJ",
          content:
            "I rewrote my CV 4 times before trying CVCraft. The job description matching feature is incredible — it told me exactly which keywords I was missing and helped me tailor each application.",
        },
        {
          name: "Elena Rodriguez",
          role: "UX Designer at Figma",
          avatar: "ER",
          content:
            "The modern template is stunning. Multiple recruiters mentioned how professional my CV looked. The cover letter generator saved me hours per application.",
        },
        {
          name: "David Park",
          role: "Data Scientist at OpenAI",
          avatar: "DP",
          content:
            "As someone who hates writing, the AI generation feature was perfect. I just filled in my experience and it turned my bullet points into compelling, professional descriptions.",
        },
        {
          name: "Priya Patel",
          role: "Marketing Lead at HubSpot",
          avatar: "PP",
          content:
            "Worth every penny of the Pro plan. I upgraded within 10 minutes of trying the free plan — the unlimited CVs and PDF export are essential when you're actively job hunting.",
        },
        {
          name: "James Williams",
          role: "Backend Engineer at Vercel",
          avatar: "JW",
          content:
            "The ATS score went from 42 to 91 after following CVCraft's suggestions. I had 3 interviews scheduled within a week of updating my CV.",
        },
      ],
    },
    cta: {
      headline: "Ready to land your dream job?",
      subtext:
        "Join 10,000+ professionals who have already leveled up their job search with CVCraft. Start free, upgrade when you need.",
      primary: "Get started for free",
      secondary: "See all plans",
      footnote: "No credit card required · Cancel anytime · 7-day Pro trial",
    },
    footer: {
      pricing: "Pricing",
      features: "Features",
      signIn: "Sign in",
      rights: "All rights reserved.",
    },
    pricing: {
      back: "Back",
      headline: "Simple, transparent pricing",
      subtext: "Start free. Upgrade when you need more power. No hidden fees.",
      moneyBack:
        "All plans include a 14-day money-back guarantee. No questions asked.",
      freeDescription: "Perfect for getting started",
      proDescription: "For serious job seekers",
      faqTitle: "Frequently asked questions",
      faqs: [
        {
          q: "Can I cancel anytime?",
          a: "Yes. Cancel your Pro subscription any time from your account settings. You retain Pro access until the end of your billing period.",
        },
        {
          q: "What happens to my CVs if I downgrade?",
          a: "Your CVs are always saved. On the Free plan, you can only actively edit 1 CV, but your others remain accessible in read-only mode.",
        },
        {
          q: "Is there a free trial?",
          a: "Yes — Pro comes with a 7-day free trial. No credit card required to sign up for the Free plan.",
        },
        {
          q: "What AI model powers the CV generation?",
          a: "We use OpenAI's GPT-4o for all AI features — the same model behind ChatGPT's most advanced responses.",
        },
        {
          q: "Are my CVs private?",
          a: "Absolutely. Your CVs are private by default. You can choose to generate a shareable link, but nothing is public unless you explicitly share it.",
        },
      ],
    },
  },
  fr: {
    nav: {
      features: "Fonctionnalités",
      pricing: "Tarifs",
      signIn: "Connexion",
      getStarted: "Commencer",
    },
    hero: {
      badge: "Créateur de CV IA — gratuit pour démarrer",
      headline1: "Décrochez l'emploi de vos rêves",
      headline2: "avec l'IA",
      subtext:
        "Générez des CV optimisés ATS et professionnels en quelques minutes. Adaptez votre CV à n'importe quelle offre et téléchargez de beaux PDF instantanément.",
      highlights: [
        "ATS-optimisé en un clic",
        "Génération IA de points clés",
        "Export PDF inclus",
      ],
      stats: [
        { value: "10 000+", label: "CV créés" },
        { value: "94 %", label: "Taux ATS" },
        { value: "3×", label: "Plus d'entretiens" },
      ],
      ctaPrimary: "Créer mon CV gratuitement",
      ctaSecondary: "Voir les tarifs",
      noCard: "Sans carte bancaire · Offre gratuite disponible",
      mock: {
        nav: ["Tableau de bord", "Mes CV", "Modèles", "Paramètres", "Support"],
        stats: [
          { label: "Total CV", value: "3" },
          { label: "Publiés", value: "2" },
          { label: "Score ATS", value: "91 %" },
          { label: "Abonnement", value: "Pro ✨" },
        ],
        yourCVs: "Vos CV",
        atsScore: "Score ATS",
        published: "Publié",
        draft: "Brouillon",
        newCV: "Nouveau CV",
      },
    },
    features: {
      sectionLabel: "Fonctionnalités",
      headline: "Tout ce qu'il vous faut pour décrocher le poste",
      subtext:
        "Du premier jet au PDF final — CVCraft s'occupe du plus dur pour que vous puissiez vous concentrer sur ce qui compte.",
      items: [
        {
          title: "Génération IA",
          description:
            "Décrivez votre parcours et laissez GPT-4 rédiger un CV convaincant et professionnel adapté à votre cible.",
        },
        {
          title: "Optimisation ATS",
          description:
            "Scorez votre CV face aux systèmes de suivi des candidatures et obtenez des suggestions précises pour passer les filtres automatiques.",
        },
        {
          title: "Matching Offre d'emploi",
          description:
            "Collez n'importe quelle offre et obtenez un score de correspondance ainsi qu'une liste d'améliorations pour adapter parfaitement votre CV.",
        },
        {
          title: "Modèles Élégants",
          description:
            "Choisissez parmi des modèles conçus par des professionnels. Changez de style instantanément sans perdre vos données.",
        },
        {
          title: "Export PDF en un clic",
          description:
            "Téléchargez des PDF pixel-perfect parfaits à l'écran et à l'impression. Le plan Pro supprime les filigranes.",
        },
        {
          title: "Générateur de Lettre de Motivation",
          description:
            "Générez automatiquement des lettres de motivation personnalisées adaptées à des offres et entreprises spécifiques.",
        },
      ],
    },
    testimonials: {
      sectionLabel: "Témoignages",
      headline: "Adopté par des chercheurs d'emploi du monde entier",
      items: [
        {
          name: "Sarah Chen",
          role: "Ingénieure Logiciel chez Google",
          avatar: "SC",
          content:
            "CVCraft m'a aidée à décrocher mon emploi de rêve chez Google. La fonctionnalité d'optimisation ATS a tout changé — mon CV était ignoré avant, mais après les suggestions IA j'ai commencé à recevoir des rappels en quelques jours.",
        },
        {
          name: "Marcus Johnson",
          role: "Product Manager chez Stripe",
          avatar: "MJ",
          content:
            "J'ai réécrit mon CV 4 fois avant d'essayer CVCraft. La fonctionnalité de matching par offre d'emploi est incroyable — elle m'a dit exactement quels mots-clés me manquaient et m'a aidé à personnaliser chaque candidature.",
        },
        {
          name: "Elena Rodriguez",
          role: "UX Designer chez Figma",
          avatar: "ER",
          content:
            "Le modèle moderne est superbe. Plusieurs recruteurs ont commenté le professionnalisme de mon CV. Le générateur de lettre de motivation m'a économisé des heures par candidature.",
        },
        {
          name: "David Park",
          role: "Data Scientist chez OpenAI",
          avatar: "DP",
          content:
            "En tant que personne qui n'aime pas écrire, la génération IA était parfaite. J'ai renseigné mon expérience et elle a transformé mes points en descriptions convaincantes et professionnelles.",
        },
        {
          name: "Priya Patel",
          role: "Responsable Marketing chez HubSpot",
          avatar: "PP",
          content:
            "Chaque centime du plan Pro en vaut la peine. J'ai upgradé 10 minutes après l'essai gratuit — les CV illimités et l'export PDF sont indispensables quand on est en recherche active.",
        },
        {
          name: "James Williams",
          role: "Ingénieur Backend chez Vercel",
          avatar: "JW",
          content:
            "Mon score ATS est passé de 42 à 91 après avoir suivi les suggestions de CVCraft. J'avais 3 entretiens planifiés une semaine après avoir mis à jour mon CV.",
        },
      ],
    },
    cta: {
      headline: "Prêt à décrocher l'emploi de vos rêves ?",
      subtext:
        "Rejoignez plus de 10 000 professionnels qui ont déjà boosté leur recherche d'emploi avec CVCraft. Commencez gratuitement, évoluez selon vos besoins.",
      primary: "Commencer gratuitement",
      secondary: "Voir les offres",
      footnote: "Sans carte bancaire · Résiliation facile · 7 jours d'essai Pro",
    },
    footer: {
      pricing: "Tarifs",
      features: "Fonctionnalités",
      signIn: "Connexion",
      rights: "Tous droits réservés.",
    },
    pricing: {
      back: "Retour",
      headline: "Une tarification simple et transparente",
      subtext:
        "Démarrez gratuitement. Évoluez dès que vous avez besoin de plus. Aucun frais caché.",
      moneyBack:
        "Tous les abonnements incluent une garantie satisfait ou remboursé de 14 jours. Sans condition.",
      freeDescription: "Idéal pour démarrer",
      proDescription: "Pour les candidats sérieux",
      faqTitle: "Questions fréquentes",
      faqs: [
        {
          q: "Puis-je annuler à tout moment ?",
          a: "Oui. Annulez votre abonnement Pro à tout moment depuis les paramètres de votre compte. Vous conservez l'accès Pro jusqu'à la fin de votre période de facturation.",
        },
        {
          q: "Que deviennent mes CV si je passe à la version gratuite ?",
          a: "Vos CV sont toujours sauvegardés. Avec le plan Gratuit, vous ne pouvez modifier activement qu'1 CV, mais les autres restent accessibles en lecture seule.",
        },
        {
          q: "Y a-t-il un essai gratuit ?",
          a: "Oui — Pro est fourni avec un essai gratuit de 7 jours. Aucune carte bancaire requise pour s'inscrire au plan Gratuit.",
        },
        {
          q: "Quel modèle IA alimente la génération de CV ?",
          a: "Nous utilisons GPT-4o d'OpenAI pour toutes les fonctionnalités IA — le même modèle qui propulse les réponses les plus avancées de ChatGPT.",
        },
        {
          q: "Mes CV sont-ils privés ?",
          a: "Absolument. Vos CV sont privés par défaut. Vous pouvez choisir de générer un lien partageable, mais rien n'est public sauf si vous le partagez explicitement.",
        },
      ],
    },
  },
} as const;
