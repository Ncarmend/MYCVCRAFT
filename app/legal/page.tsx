import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Legal Notice — Cvixeo",
  description: "Legal notice (mentions légales) for Cvixeo — publisher information, hosting details, and intellectual property notice.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-3 text-base font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <NavbarServer />

      <main className="flex-1 bg-slate-50">
        {/* Header */}
        <div className="border-b border-slate-100 bg-white">
          <div className="mx-auto max-w-3xl px-6 py-10">
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Legal Notice
            </h1>
            <p className="mt-1 text-xs text-slate-400">Mentions légales — Last updated: July 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

            <div className="mb-8 text-xs leading-relaxed text-slate-500">
              In accordance with Articles 6 and 19 of the French Law no. 2004-575 of 21 June 2004 on confidence in the digital economy (Loi pour la Confiance dans l'Économie Numérique — LCEN), the following information is provided to users of the website <strong>cvixeo.com</strong>.
            </div>

            <div className="space-y-8">

              <Section id="publisher" title="1. Publisher of the Website">
                <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm ring-1 ring-slate-100">
                  <p><strong>Website:</strong> cvixeo.com</p>
                  <p className="mt-1"><strong>Publisher:</strong> Cvixeo</p>
                  <p className="mt-1"><strong>Email:</strong> <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
                  <p className="mt-1"><strong>Publication Director:</strong> The management of Cvixeo</p>
                </div>
                <p>Cvixeo is an online service. For formal legal communications, please use the email address provided above.</p>
              </Section>

              <Section id="hosting" title="2. Hosting">
                <p>The website cvixeo.com is hosted by:</p>
                <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm ring-1 ring-slate-100">
                  <p><strong>Vercel Inc.</strong></p>
                  <p>340 Pine Street, Suite 900</p>
                  <p>San Francisco, CA 94104</p>
                  <p>United States</p>
                  <p className="mt-1"><a href="https://vercel.com" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
                </div>
                <p>Database and authentication services are provided by Supabase (Supabase Inc.), operating on AWS infrastructure with European data centre options.</p>
              </Section>

              <Section id="intellectual-property" title="3. Intellectual Property">
                <p>The entire content of the cvixeo.com website — including but not limited to text, images, graphics, logos, icons, software, templates, AI models, and the overall interface design — is the exclusive property of Cvixeo or its licensors and is protected by French and international intellectual property law.</p>
                <p>Any reproduction, representation, modification, distribution, or use of any element of the website, in whole or in part, without the prior written authorisation of Cvixeo, is strictly prohibited and constitutes an infringement sanctionable under Articles L.335-2 and following of the French Intellectual Property Code.</p>
                <p>The Cvixeo name and logo are trademarks. Unauthorised use is strictly prohibited.</p>
                <p><strong>Exception:</strong> Content created by users using Cvixeo's tools (CV text, cover letters, etc.) remains the exclusive intellectual property of the user who created it. Cvixeo claims no ownership over user-generated content.</p>
              </Section>

              <Section id="personal-data" title="4. Personal Data and GDPR">
                <p>Cvixeo processes personal data of its users in compliance with the European General Data Protection Regulation (GDPR — Regulation (EU) 2016/679) and the French Data Protection Act (Loi Informatique et Libertés).</p>
                <p>For full details on how we collect, use, store, and protect your personal data, and to understand your rights as a data subject, please consult our <Link href="/privacy" className="text-green-700 underline">Privacy Policy</Link>.</p>
                <p>To exercise your rights or for any data protection enquiry, contact: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
              </Section>

              <Section id="cookies" title="5. Cookies">
                <p>The cvixeo.com website uses strictly necessary cookies for authentication and user preferences. We do not use advertising or tracking cookies. For full details, see our <Link href="/cookies" className="text-green-700 underline">Cookie Policy</Link>.</p>
              </Section>

              <Section id="limitation" title="6. Limitation of Liability">
                <p>Cvixeo makes every effort to ensure that the information available on cvixeo.com is accurate and up to date. However, Cvixeo cannot guarantee the accuracy, completeness, or currency of information published on the website and declines all responsibility for any errors or omissions.</p>
                <p>Cvixeo reserves the right to modify, update, or remove the content of the website at any time and without prior notice.</p>
                <p>Cvixeo is not responsible for any damage, direct or indirect, resulting from access to the website or its use, including any data loss, technical interruption, or security breach beyond its reasonable control.</p>
              </Section>

              <Section id="hyperlinks" title="7. Hyperlinks">
                <p>The cvixeo.com website may contain links to third-party websites. These links are provided for convenience only. Cvixeo has no control over the content of third-party websites and accepts no liability for them.</p>
                <p>Creation of hyperlinks to cvixeo.com requires the prior written authorisation of Cvixeo.</p>
              </Section>

              <Section id="applicable-law" title="8. Applicable Law and Jurisdiction">
                <p>This Legal Notice is governed by French law. Any dispute relating to its interpretation or application shall be subject to the exclusive jurisdiction of the competent French courts, subject to mandatory EU consumer protection provisions.</p>
              </Section>

              <Section id="contact-legal" title="9. Contact">
                <p>For any legal enquiry relating to the cvixeo.com website:</p>
                <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
                  <p>Email: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
                  <p className="mt-1">Contact form: <Link href="/contact" className="text-green-700 underline">cvixeo.com/contact</Link></p>
                </div>
              </Section>

            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
