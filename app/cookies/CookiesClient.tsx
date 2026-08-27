"use client";

import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageContext";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-3 text-base font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export function CookiesClient() {
  const { lang } = useLanguage();
  return (
    <>
      {/* Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
              <Cookie className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {lang === "fr" ? "Politique de cookies" : "Cookie Policy"}
              </h1>
              <p className="text-xs text-slate-400">
                {lang === "fr" ? "Dernière mise à jour : juillet 2026 · S'applique à cvixeo.com" : "Last updated: July 2026 · Applies to cvixeo.com"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          {lang === "fr" ? <CookiesFR /> : <CookiesEN />}
        </div>
      </div>
    </>
  );
}

function CookiesEN() {
  return (
    <>
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
    </>
  );
}

function CookiesFR() {
  return (
    <>
      <div className="mb-8 rounded-xl bg-green-50 px-5 py-4 text-xs leading-relaxed text-green-800 ring-1 ring-green-100">
        <strong>En bref :</strong> Cvixeo n'utilise que des cookies strictement nécessaires pour vous maintenir connecté et mémoriser votre préférence de langue. Nous n'utilisons pas de cookies publicitaires, de pixels de suivi des réseaux sociaux, ni aucun outil d'analyse tiers qui vous suit d'un site à l'autre. Aucune bannière de consentement n'est requise pour les cookies strictement nécessaires en vertu du RGPD, mais nous expliquons tout ici en toute transparence.
      </div>

      <div className="space-y-8">
        <Section id="what-are-cookies" title="1. Que sont les cookies ?">
          <p>Les cookies sont de petits fichiers texte déposés sur votre appareil (ordinateur, tablette ou téléphone) lorsque vous visitez un site web. Ils permettent au site de se souvenir de certaines informations concernant votre visite — comme votre session de connexion ou vos préférences — afin que vous n'ayez pas à les ressaisir à chaque visite.</p>
          <p>Les cookies peuvent être des « cookies de session » (supprimés à la fermeture du navigateur) ou des « cookies persistants » (conservés sur votre appareil pendant une durée déterminée ou jusqu'à leur suppression).</p>
        </Section>

        <Section id="how-we-use" title="2. Comment nous utilisons les cookies">
          <p>Cvixeo utilise un nombre minimal de cookies, tous strictement nécessaires au fonctionnement du Service. Nous n'utilisons pas de cookies à des fins publicitaires, de suivi comportemental, ou pour établir des profils sur votre navigation.</p>

          <div className="overflow-hidden rounded-xl ring-1 ring-gray-200">
            <table className="w-full text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Nom du cookie</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Finalité</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Durée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-white">
                  <td className="px-4 py-3 font-mono text-slate-700">sb-*</td>
                  <td className="px-4 py-3 text-slate-600">Jeton de session d'authentification (Supabase). Vous maintient connecté après connexion.</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">Strictement nécessaire</span></td>
                  <td className="px-4 py-3 text-slate-600">Session / 1 an</td>
                </tr>
                <tr className="bg-white">
                  <td className="px-4 py-3 font-mono text-slate-700">cv-lang</td>
                  <td className="px-4 py-3 text-slate-600">Stocke votre préférence de langue (EN ou FR) afin qu'elle persiste d'une visite à l'autre.</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700">Strictement nécessaire</span></td>
                  <td className="px-4 py-3 text-slate-600">Persistant (localStorage)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500">Remarque : <code className="rounded bg-slate-100 px-1 py-0.5">cv-lang</code> est stocké dans le <em>localStorage</em>, et non dans un cookie. Il fonctionne de manière similaire mais n'est jamais transmis automatiquement à nos serveurs.</p>
        </Section>

        <Section id="third-party" title="3. Cookies tiers">
          <p>Nous utilisons Stripe pour le traitement des paiements. Lorsque vous accédez au parcours de paiement (souscription d'abonnement), Stripe peut déposer des cookies sur votre appareil à des fins de prévention de la fraude et de sécurité des paiements. Ces cookies sont régis par la <a href="https://stripe.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité de Stripe</a>.</p>
          <p>Les cookies anti-fraude de Stripe sont considérés comme strictement nécessaires au fonctionnement du service de paiement et ne nécessitent pas de consentement distinct.</p>
          <p>Nous ne chargeons ni Google Analytics, ni Facebook Pixel, ni TikTok Pixel, ni LinkedIn Insight Tag, ni Hotjar, ni aucun autre script de suivi ou d'analyse tiers.</p>
        </Section>

        <Section id="legal-basis" title="4. Base juridique en vertu du RGPD et de la directive ePrivacy">
          <p>En vertu de la directive européenne ePrivacy (transposée nationalement sous le nom de « loi Cookies ») et du RGPD, les cookies strictement nécessaires au fonctionnement du service ne requièrent pas de consentement. Cela couvre nos cookies de session d'authentification et les cookies anti-fraude de Stripe.</p>
          <p>Comme nous n'utilisons aucun cookie non essentiel, nous n'affichons pas de bannière de consentement aux cookies. Si nous introduisons un jour des cookies d'analyse ou marketing optionnels, nous mettrons à jour cette politique, ajouterons un mécanisme de consentement approprié et informerons les utilisateurs existants.</p>
        </Section>

        <Section id="managing" title="5. Comment gérer ou supprimer les cookies">
          <p>Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur. Les liens suivants fournissent des instructions pour les navigateurs les plus courants :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/fr/kb/effacer-cookies-donnees-navigation-firefox" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
          <p>Veuillez noter que la suppression ou le blocage de nos cookies d'authentification vous déconnectera et vous devrez vous reconnecter lors de votre prochaine visite. La suppression de l'élément <code className="rounded bg-slate-100 px-1 py-0.5">cv-lang</code> du localStorage réinitialisera votre préférence de langue à celle de votre navigateur.</p>
        </Section>

        <Section id="rights" title="6. Vos droits">
          <p>En vertu du RGPD, vous disposez de droits concernant la manière dont nous traitons vos données personnelles, y compris les données associées aux cookies. Consultez notre <Link href="/privacy" className="text-green-700 underline">Politique de confidentialité</Link> — Section 8 — pour une description complète de vos droits et de la manière de les exercer.</p>
        </Section>

        <Section id="changes" title="7. Modifications de cette politique de cookies">
          <p>Nous pouvons mettre à jour cette Politique de cookies si nous modifions les cookies que nous utilisons. Nous vous informerons de tout changement important par e-mail ou par un avis sur le Service. La version actuelle sera toujours disponible à l'adresse <Link href="/fr/cookies" className="text-green-700 underline">cvixeo.com/fr/cookies</Link>.</p>
        </Section>

        <Section id="contact" title="8. Contact">
          <p>Pour toute question concernant cette Politique de cookies, veuillez nous contacter :</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>E-mail : <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Formulaire de contact : <Link href="/fr/contact" className="text-green-700 underline">cvixeo.com/fr/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}
