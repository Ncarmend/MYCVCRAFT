import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Cookie Policy — Cvixeo",
  description: "How Cvixeo uses cookies and how to manage your preferences. GDPR-compliant cookie policy for European users.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-3 text-base font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function CookiesPage() {
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
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                <Cookie className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  Cookie Policy
                </h1>
                <p className="text-xs text-slate-400">Last updated: July 2026 · Applies to cvixeo.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

            <div className="mb-8 rounded-xl bg-green-50 px-5 py-4 text-xs leading-relaxed text-green-800 ring-1 ring-green-100">
              <strong>The short version:</strong> Cvixeo uses only strictly necessary cookies to keep you logged in and remember your language preference. We do not use advertising cookies, social media tracking pixels, or any third-party analytics that track you across websites. No consent banner is required for strictly necessary cookies under the GDPR, but we explain everything here in full transparency.
            </div>

            <div className="space-y-8">

              <Section id="what-are-cookies" title="1. What Are Cookies?">
                <p>Cookies are small text files placed on your device (computer, tablet, or phone) when you visit a website. They allow the website to remember certain information about your visit — such as your login session or preferences — so you do not have to re-enter them every time you return.</p>
                <p>Cookies can be "session cookies" (deleted when you close your browser) or "persistent cookies" (remain on your device for a set period or until you delete them).</p>
              </Section>

              <Section id="how-we-use" title="2. How We Use Cookies">
                <p>Cvixeo uses a minimal set of cookies, all of which are strictly necessary for the Service to function. We do not use cookies for advertising, behavioural tracking, or to build profiles about your browsing behaviour.</p>

                <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Cookie name</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Purpose</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-mono text-slate-700">sb-*</td>
                        <td className="px-4 py-3 text-slate-600">Authentication session token (Supabase). Keeps you logged in after signing in.</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">Strictly necessary</span></td>
                        <td className="px-4 py-3 text-slate-600">Session / 1 year</td>
                      </tr>
                      <tr className="bg-white">
                        <td className="px-4 py-3 font-mono text-slate-700">cv-lang</td>
                        <td className="px-4 py-3 text-slate-600">Stores your language preference (EN or FR) so it persists across visits.</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">Strictly necessary</span></td>
                        <td className="px-4 py-3 text-slate-600">Persistent (localStorage)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-slate-500">Note: <code className="rounded bg-slate-100 px-1 py-0.5">cv-lang</code> is stored in <em>localStorage</em>, not a cookie. It operates similarly but is never sent to our servers automatically.</p>
              </Section>

              <Section id="third-party" title="3. Third-Party Cookies">
                <p>We use Stripe for payment processing. When you visit the payment flow (subscription checkout), Stripe may set cookies on your device for fraud prevention and payment security purposes. These cookies are governed by <a href="https://stripe.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Stripe's Privacy Policy</a>.</p>
                <p>Stripe's fraud prevention cookies are considered strictly necessary for the payment service to function and do not require separate consent.</p>
                <p>We do not load Google Analytics, Facebook Pixel, TikTok Pixel, LinkedIn Insight Tag, Hotjar, or any other third-party tracking or analytics script.</p>
              </Section>

              <Section id="legal-basis" title="4. Legal Basis Under the GDPR and ePrivacy Directive">
                <p>Under the EU's ePrivacy Directive (implemented nationally as the "Cookie Law") and the GDPR, cookies that are strictly necessary for the operation of the service do not require consent. This covers our authentication session cookies and fraud-prevention cookies from Stripe.</p>
                <p>Because we do not use any non-essential cookies, we do not display a cookie consent banner. If we ever introduce optional analytics or marketing cookies in the future, we will update this policy, add an appropriate consent mechanism, and notify existing users.</p>
              </Section>

              <Section id="managing" title="5. How to Manage or Delete Cookies">
                <p>You can control and delete cookies through your browser settings. The following links provide guidance for popular browsers:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li><a href="https://support.google.com/chrome/answer/95647" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
                  <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                </ul>
                <p>Please note that deleting or blocking our authentication cookies will log you out and you will need to sign in again the next time you visit. Deleting the <code className="rounded bg-slate-100 px-1 py-0.5">cv-lang</code> item from localStorage will reset your language preference to the browser default.</p>
              </Section>

              <Section id="rights" title="6. Your Rights">
                <p>Under the GDPR, you have rights regarding how we process your personal data, including the data associated with cookies. Please see our <Link href="/privacy" className="text-green-700 underline">Privacy Policy</Link> — Section 8 — for a full description of your rights and how to exercise them.</p>
              </Section>

              <Section id="changes" title="7. Changes to This Cookie Policy">
                <p>We may update this Cookie Policy if we change the cookies we use. We will notify you of any material changes by email or by a notice on the Service. The current version will always be available at <Link href="/cookies" className="text-green-700 underline">cvixeo.com/cookies</Link>.</p>
              </Section>

              <Section id="contact" title="8. Contact">
                <p>For questions about this Cookie Policy, please contact us:</p>
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
