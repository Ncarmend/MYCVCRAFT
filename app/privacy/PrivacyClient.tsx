"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/landing/LanguageContext";

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-3 text-base font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export function PrivacyClient() {
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
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {lang === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            {lang === "fr" ? "Dernière mise à jour : juillet 2026 · S'applique à cvixeo.com" : "Last updated: July 2026 · Applies to cvixeo.com"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          {lang === "fr" ? <PrivacyFR /> : <PrivacyEN />}
        </div>
      </div>
    </>
  );
}

function PrivacyEN() {
  return (
    <>
      <div className="mb-8 rounded-xl bg-blue-50 px-5 py-4 text-xs leading-relaxed text-blue-800 ring-1 ring-blue-100">
        This Privacy Policy explains how <strong>Cvixeo</strong> ("we," "us," or "our") collects, uses, and protects information about you when you use our website at <strong>cvixeo.com</strong> and our services (collectively, the "Service"). We are committed to full compliance with the European Union's General Data Protection Regulation (<strong>GDPR</strong>) — Regulation (EU) 2016/679.
      </div>

      <div className="space-y-8">
        <Section id="controller" title="1. Data Controller">
          <p>The data controller responsible for your personal data is:</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p><strong>Cvixeo</strong></p>
            <p>Website: cvixeo.com</p>
            <p>Contact: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
          </div>
          <p>For any data protection matters, you may contact us at the email address above.</p>
        </Section>

        <Section id="data-collected" title="2. Personal Data We Collect">
          <p>We collect the following categories of personal data:</p>
          <p><strong>Account data:</strong> First name, last name, email address, and hashed password when you create an account.</p>
          <p><strong>CV content:</strong> Professional information you enter into your CV — work experience, education, skills, contact details, and any other information you choose to include. This data belongs entirely to you.</p>
          <p><strong>Usage data:</strong> Pages visited, features used, session duration, browser type, device type, and IP address. This data is collected automatically to operate and improve the Service.</p>
          <p><strong>Payment data:</strong> Subscription and billing information is processed directly by Stripe. We do not store payment card numbers, CVV codes, or full bank account details on our servers.</p>
          <p><strong>Communication data:</strong> Messages you send to our support team, including the content of your message and your contact details.</p>
        </Section>

        <Section id="legal-basis" title="3. Legal Basis for Processing (GDPR Art. 6)">
          <p>We process your personal data on the following legal bases:</p>
          <p><strong>Performance of a contract (Art. 6(1)(b)):</strong> Processing necessary to provide you with the Service — creating your account, storing your CVs, processing your subscription.</p>
          <p><strong>Legitimate interests (Art. 6(1)(f)):</strong> Improving and securing the Service, preventing fraud, and understanding how our users interact with features. We only rely on legitimate interests where they are not overridden by your fundamental rights.</p>
          <p><strong>Consent (Art. 6(1)(a)):</strong> Where we send promotional or marketing communications. You may withdraw consent at any time by unsubscribing or contacting us.</p>
          <p><strong>Legal obligation (Art. 6(1)(c)):</strong> Retaining financial records and transaction data as required by applicable tax and accounting law (typically 7 years in France and the EU).</p>
        </Section>

        <Section id="purposes" title="4. Purposes of Processing">
          <p>We use your personal data for the following purposes:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Creating and managing your account</li>
            <li>Providing, operating, and improving the AI resume-building features</li>
            <li>Processing subscription payments and issuing invoices</li>
            <li>Sending transactional emails (account confirmation, password reset, subscription receipts)</li>
            <li>Responding to support requests and inquiries</li>
            <li>Detecting and preventing fraud and abuse</li>
            <li>Complying with legal and regulatory obligations</li>
          </ul>
          <p>We <strong>do not</strong> sell your personal data to third parties. We do not use your CV content to train AI models without your explicit consent.</p>
        </Section>

        <Section id="retention" title="5. Data Retention">
          <p>We retain your personal data for as long as necessary to fulfil the purposes described in this policy:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Account and CV data:</strong> Retained for as long as your account is active. If you delete your account, your data is deleted within 30 days.</li>
            <li><strong>Financial and billing records:</strong> Retained for 7 years following the transaction, as required by EU tax legislation.</li>
            <li><strong>Support communications:</strong> Retained for 3 years from the date of your last contact, then deleted.</li>
            <li><strong>Usage and analytics data:</strong> Retained in anonymised or aggregated form after 24 months.</li>
          </ul>
        </Section>

        <Section id="processors" title="6. Third-Party Data Processors">
          <p>We use the following third-party services to operate Cvixeo. Each is bound by a Data Processing Agreement (DPA) consistent with GDPR requirements:</p>
          <ul className="ml-4 list-disc space-y-1.5">
            <li><strong>Supabase</strong> (Supabase Inc.) — Authentication and database storage. Data hosted on AWS infrastructure with EU data centres available. <a href="https://supabase.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Privacy policy</a></li>
            <li><strong>Stripe</strong> (Stripe Payments Europe Ltd.) — Payment processing. EU-based entity, PCI-DSS compliant. <a href="https://stripe.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Privacy policy</a></li>
            <li><strong>Anthropic</strong> (Anthropic PBC) — AI features (CV generation, ATS analysis, cover letter generation). <a href="https://www.anthropic.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Privacy policy</a></li>
            <li><strong>Resend</strong> (Resend Inc.) — Transactional email delivery. <a href="https://resend.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Privacy policy</a></li>
            <li><strong>Vercel</strong> (Vercel Inc.) — Website hosting and infrastructure. <a href="https://vercel.com/legal/privacy-policy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Privacy policy</a></li>
          </ul>
        </Section>

        <Section id="transfers" title="7. International Data Transfers">
          <p>Some of our third-party processors are based in the United States. Where personal data is transferred outside the European Economic Area (EEA), we ensure appropriate safeguards are in place, including:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Adequacy decisions where applicable</li>
            <li>Binding corporate rules (where relevant)</li>
          </ul>
          <p>You may request details of the specific safeguards in place by contacting us.</p>
        </Section>

        <Section id="rights" title="8. Your Rights Under the GDPR">
          <p>Under the GDPR (Articles 15–22), you have the following rights regarding your personal data:</p>
          <ul className="ml-4 list-disc space-y-1.5">
            <li><strong>Right of access (Art. 15):</strong> You may request a copy of the personal data we hold about you.</li>
            <li><strong>Right to rectification (Art. 16):</strong> You may request correction of inaccurate or incomplete data.</li>
            <li><strong>Right to erasure (Art. 17):</strong> You may request deletion of your personal data ("right to be forgotten"). Note that some data must be retained for legal compliance (see Section 5).</li>
            <li><strong>Right to restriction (Art. 18):</strong> You may request that we restrict processing of your data in certain circumstances.</li>
            <li><strong>Right to data portability (Art. 20):</strong> You may request your data in a commonly used, machine-readable format. CV data can be exported directly from your account settings.</li>
            <li><strong>Right to object (Art. 21):</strong> You may object to processing based on legitimate interests, including profiling.</li>
            <li><strong>Right not to be subject to automated decision-making (Art. 22):</strong> We do not use your personal data for solely automated decisions that produce legal or similarly significant effects.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a>. We will respond within 30 days as required by the GDPR. We may need to verify your identity before processing your request.</p>
        </Section>

        <Section id="complaints" title="9. Right to Lodge a Complaint">
          <p>If you believe we have not handled your personal data in accordance with the GDPR, you have the right to lodge a complaint with your national data protection supervisory authority. If you are located in France, this is the <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong> at <a href="https://www.cnil.fr" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>. If you are located elsewhere in the EU, your relevant national DPA can be found at the European Data Protection Board's website.</p>
          <p>We would appreciate the opportunity to address any concern before you contact a supervisory authority, so please reach out to us first.</p>
        </Section>

        <Section id="cookies" title="10. Cookies">
          <p>We use a limited number of cookies to operate the Service. See our <Link href="/cookies" className="text-green-700 underline">Cookie Policy</Link> for full details, including how to manage your cookie preferences.</p>
          <p>We use only strictly necessary cookies (authentication session cookies and language preference). We do not use advertising or third-party tracking cookies.</p>
        </Section>

        <Section id="children" title="11. Children's Privacy">
          <p>The Service is not directed to children under the age of 16. We do not knowingly collect personal data from anyone under 16. If you believe a child under 16 has provided us with personal data, please contact us immediately and we will take steps to delete such data.</p>
        </Section>

        <Section id="changes" title="12. Changes to This Policy">
          <p>We may update this Privacy Policy from time to time to reflect changes in our practices, our services, or applicable law. We will notify you of material changes by email or by displaying a prominent notice on the Service at least 30 days before the changes take effect. The updated policy will always be available at <Link href="/privacy" className="text-green-700 underline">cvixeo.com/privacy</Link>.</p>
        </Section>

        <Section id="contact" title="13. Contact">
          <p>For any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>Email: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Contact form: <Link href="/contact" className="text-green-700 underline">cvixeo.com/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}

function PrivacyFR() {
  return (
    <>
      <div className="mb-8 rounded-xl bg-blue-50 px-5 py-4 text-xs leading-relaxed text-blue-800 ring-1 ring-blue-100">
        La présente Politique de confidentialité explique comment <strong>Cvixeo</strong> (« nous », « notre ») collecte, utilise et protège les informations vous concernant lorsque vous utilisez notre site <strong>cvixeo.com</strong> et nos services (collectivement, le « Service »). Nous nous engageons à respecter pleinement le Règlement Général sur la Protection des Données de l'Union européenne (<strong>RGPD</strong>) — Règlement (UE) 2016/679.
      </div>

      <div className="space-y-8">
        <Section id="controller" title="1. Responsable du traitement">
          <p>Le responsable du traitement de vos données personnelles est :</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p><strong>Cvixeo</strong></p>
            <p>Site web : cvixeo.com</p>
            <p>Contact : <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
          </div>
          <p>Pour toute question relative à la protection des données, vous pouvez nous contacter à l'adresse e-mail ci-dessus.</p>
        </Section>

        <Section id="data-collected" title="2. Données personnelles que nous collectons">
          <p>Nous collectons les catégories de données personnelles suivantes :</p>
          <p><strong>Données de compte :</strong> Prénom, nom, adresse e-mail et mot de passe haché lors de la création de votre compte.</p>
          <p><strong>Contenu du CV :</strong> Informations professionnelles que vous saisissez dans votre CV — expérience professionnelle, formation, compétences, coordonnées et toute autre information que vous choisissez d'inclure. Ces données vous appartiennent entièrement.</p>
          <p><strong>Données d'utilisation :</strong> Pages visitées, fonctionnalités utilisées, durée de session, type de navigateur, type d'appareil et adresse IP. Ces données sont collectées automatiquement pour faire fonctionner et améliorer le Service.</p>
          <p><strong>Données de paiement :</strong> Les informations d'abonnement et de facturation sont traitées directement par Stripe. Nous ne stockons pas les numéros de carte de paiement, les codes CVV ou les coordonnées bancaires complètes sur nos serveurs.</p>
          <p><strong>Données de communication :</strong> Messages que vous envoyez à notre équipe de support, y compris le contenu de votre message et vos coordonnées.</p>
        </Section>

        <Section id="legal-basis" title="3. Base juridique du traitement (Art. 6 du RGPD)">
          <p>Nous traitons vos données personnelles sur les bases juridiques suivantes :</p>
          <p><strong>Exécution d'un contrat (Art. 6(1)(b)) :</strong> Traitement nécessaire pour vous fournir le Service — création de votre compte, stockage de vos CV, traitement de votre abonnement.</p>
          <p><strong>Intérêts légitimes (Art. 6(1)(f)) :</strong> Amélioration et sécurisation du Service, prévention de la fraude et compréhension de l'usage des fonctionnalités par nos utilisateurs. Nous ne nous appuyons sur cette base que lorsqu'elle n'est pas supplantée par vos droits fondamentaux.</p>
          <p><strong>Consentement (Art. 6(1)(a)) :</strong> Lorsque nous envoyons des communications promotionnelles ou marketing. Vous pouvez retirer votre consentement à tout moment en vous désabonnant ou en nous contactant.</p>
          <p><strong>Obligation légale (Art. 6(1)(c)) :</strong> Conservation des documents financiers et des données de transaction comme l'exigent les législations fiscale et comptable applicables (généralement 7 ans en France et dans l'UE).</p>
        </Section>

        <Section id="purposes" title="4. Finalités du traitement">
          <p>Nous utilisons vos données personnelles aux fins suivantes :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Création et gestion de votre compte</li>
            <li>Fourniture, exploitation et amélioration des fonctionnalités de création de CV par IA</li>
            <li>Traitement des paiements d'abonnement et émission des factures</li>
            <li>Envoi d'e-mails transactionnels (confirmation de compte, réinitialisation de mot de passe, reçus d'abonnement)</li>
            <li>Réponse aux demandes de support et questions</li>
            <li>Détection et prévention de la fraude et des abus</li>
            <li>Respect des obligations légales et réglementaires</li>
          </ul>
          <p>Nous <strong>ne vendons pas</strong> vos données personnelles à des tiers. Nous n'utilisons pas le contenu de votre CV pour entraîner des modèles d'IA sans votre consentement explicite.</p>
        </Section>

        <Section id="retention" title="5. Conservation des données">
          <p>Nous conservons vos données personnelles aussi longtemps que nécessaire pour répondre aux finalités décrites dans cette politique :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li><strong>Données de compte et de CV :</strong> Conservées tant que votre compte est actif. Si vous supprimez votre compte, vos données sont supprimées dans un délai de 30 jours.</li>
            <li><strong>Documents financiers et de facturation :</strong> Conservés 7 ans après la transaction, comme l'exige la législation fiscale de l'UE.</li>
            <li><strong>Communications de support :</strong> Conservées 3 ans à compter de votre dernier contact, puis supprimées.</li>
            <li><strong>Données d'utilisation et d'analyse :</strong> Conservées sous forme anonymisée ou agrégée après 24 mois.</li>
          </ul>
        </Section>

        <Section id="processors" title="6. Sous-traitants tiers">
          <p>Nous utilisons les services tiers suivants pour exploiter Cvixeo. Chacun est lié par un accord de traitement des données (DPA) conforme aux exigences du RGPD :</p>
          <ul className="ml-4 list-disc space-y-1.5">
            <li><strong>Supabase</strong> (Supabase Inc.) — Authentification et stockage de base de données. Données hébergées sur l'infrastructure AWS, avec des centres de données dans l'UE disponibles. <a href="https://supabase.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a></li>
            <li><strong>Stripe</strong> (Stripe Payments Europe Ltd.) — Traitement des paiements. Entité basée dans l'UE, conforme PCI-DSS. <a href="https://stripe.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a></li>
            <li><strong>Anthropic</strong> (Anthropic PBC) — Fonctionnalités d'IA (génération de CV, analyse ATS, génération de lettres de motivation). <a href="https://www.anthropic.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a></li>
            <li><strong>Resend</strong> (Resend Inc.) — Envoi d'e-mails transactionnels. <a href="https://resend.com/privacy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a></li>
            <li><strong>Vercel</strong> (Vercel Inc.) — Hébergement du site et infrastructure. <a href="https://vercel.com/legal/privacy-policy" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">Politique de confidentialité</a></li>
          </ul>
        </Section>

        <Section id="transfers" title="7. Transferts internationaux de données">
          <p>Certains de nos sous-traitants sont basés aux États-Unis. Lorsque des données personnelles sont transférées en dehors de l'Espace économique européen (EEE), nous veillons à la mise en place de garanties appropriées, notamment :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Les clauses contractuelles types (CCT) approuvées par la Commission européenne</li>
            <li>Les décisions d'adéquation lorsqu'applicables</li>
            <li>Les règles d'entreprise contraignantes (le cas échéant)</li>
          </ul>
          <p>Vous pouvez demander le détail des garanties spécifiques mises en place en nous contactant.</p>
        </Section>

        <Section id="rights" title="8. Vos droits en vertu du RGPD">
          <p>En vertu du RGPD (articles 15 à 22), vous disposez des droits suivants concernant vos données personnelles :</p>
          <ul className="ml-4 list-disc space-y-1.5">
            <li><strong>Droit d'accès (Art. 15) :</strong> Vous pouvez demander une copie des données personnelles que nous détenons à votre sujet.</li>
            <li><strong>Droit de rectification (Art. 16) :</strong> Vous pouvez demander la correction de données inexactes ou incomplètes.</li>
            <li><strong>Droit à l'effacement (Art. 17) :</strong> Vous pouvez demander la suppression de vos données personnelles (« droit à l'oubli »). Certaines données doivent toutefois être conservées pour respecter nos obligations légales (voir Section 5).</li>
            <li><strong>Droit à la limitation du traitement (Art. 18) :</strong> Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.</li>
            <li><strong>Droit à la portabilité des données (Art. 20) :</strong> Vous pouvez demander vos données dans un format structuré et couramment utilisé. Les données de CV peuvent être exportées directement depuis les paramètres de votre compte.</li>
            <li><strong>Droit d'opposition (Art. 21) :</strong> Vous pouvez vous opposer au traitement fondé sur l'intérêt légitime, y compris le profilage.</li>
            <li><strong>Droit de ne pas faire l'objet d'une décision individuelle automatisée (Art. 22) :</strong> Nous n'utilisons pas vos données personnelles pour des décisions uniquement automatisées produisant des effets juridiques ou vous affectant de manière significative.</li>
          </ul>
          <p>Pour exercer l'un de ces droits, veuillez nous contacter à <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a>. Nous répondrons dans un délai de 30 jours, conformément au RGPD. Nous pourrons avoir besoin de vérifier votre identité avant de traiter votre demande.</p>
        </Section>

        <Section id="complaints" title="9. Droit d'introduire une réclamation">
          <p>Si vous estimez que nous n'avons pas traité vos données personnelles conformément au RGPD, vous avez le droit d'introduire une réclamation auprès de votre autorité de contrôle nationale. Si vous résidez en France, il s'agit de la <strong>Commission Nationale de l'Informatique et des Libertés (CNIL)</strong>, à l'adresse <a href="https://www.cnil.fr" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>. Si vous résidez ailleurs dans l'UE, votre autorité de contrôle nationale figure sur le site du Comité européen de la protection des données.</p>
          <p>Nous serions ravis de pouvoir résoudre toute préoccupation avant que vous ne contactiez une autorité de contrôle — n'hésitez pas à nous contacter en premier lieu.</p>
        </Section>

        <Section id="cookies" title="10. Cookies">
          <p>Nous utilisons un nombre limité de cookies pour faire fonctionner le Service. Consultez notre <Link href="/cookies" className="text-green-700 underline">Politique de cookies</Link> pour tous les détails, y compris la gestion de vos préférences.</p>
          <p>Nous utilisons uniquement des cookies strictement nécessaires (cookies de session d'authentification et de préférence linguistique). Nous n'utilisons pas de cookies publicitaires ou de suivi tiers.</p>
        </Section>

        <Section id="children" title="11. Confidentialité des mineurs">
          <p>Le Service ne s'adresse pas aux enfants de moins de 16 ans. Nous ne collectons pas sciemment de données personnelles auprès de personnes de moins de 16 ans. Si vous pensez qu'un enfant de moins de 16 ans nous a fourni des données personnelles, veuillez nous contacter immédiatement afin que nous prenions les mesures nécessaires pour les supprimer.</p>
        </Section>

        <Section id="changes" title="12. Modifications de cette politique">
          <p>Nous pouvons mettre à jour cette Politique de confidentialité de temps à autre pour refléter les évolutions de nos pratiques, de nos services ou de la législation applicable. Nous vous informerons de tout changement important par e-mail ou par un avis bien visible sur le Service, au moins 30 jours avant leur entrée en vigueur. La politique actualisée sera toujours disponible à l'adresse <Link href="/fr/privacy" className="text-green-700 underline">cvixeo.com/fr/privacy</Link>.</p>
        </Section>

        <Section id="contact" title="13. Contact">
          <p>Pour toute question ou préoccupation concernant cette Politique de confidentialité ou nos pratiques en matière de données, veuillez nous contacter :</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>E-mail : <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Formulaire de contact : <Link href="/fr/contact" className="text-green-700 underline">cvixeo.com/fr/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}
