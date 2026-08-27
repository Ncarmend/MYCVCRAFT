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

export function TermsClient() {
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
            {lang === "fr" ? "Conditions d'utilisation" : "Terms of Use"}
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            {lang === "fr" ? "Dernière mise à jour : juillet 2026 · S'applique à cvixeo.com" : "Last updated: July 2026 · Applies to cvixeo.com"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          {lang === "fr" ? <TermsFR /> : <TermsEN />}
        </div>
      </div>
    </>
  );
}

function TermsEN() {
  return (
    <>
      <div className="mb-8 rounded-xl bg-amber-50 px-5 py-4 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
        Please read these Terms of Use carefully before using <strong>cvixeo.com</strong> and any associated services provided by <strong>Cvixeo</strong> ("we," "us," or "our"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree, do not use the Service.
      </div>

      <div className="space-y-8">
        <Section id="definitions" title="1. Definitions">
          <p><strong>"Service"</strong> means the Cvixeo website at cvixeo.com, including all features, tools, templates, and AI-powered functions accessible thereon.</p>
          <p><strong>"User," "you,"</strong> or <strong>"your"</strong> means any individual who accesses or uses the Service.</p>
          <p><strong>"Content"</strong> means any information, text, data, or files you submit, upload, or create through the Service.</p>
          <p><strong>"Subscription"</strong> means a paid monthly or annual plan granting access to premium features.</p>
        </Section>

        <Section id="acceptance" title="2. Acceptance of Terms">
          <p>By creating an account or otherwise using the Service, you confirm that:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>You are at least 16 years of age, or you have obtained the consent of a parent or legal guardian.</li>
            <li>You have read, understood, and agree to be bound by these Terms and our <Link href="/privacy" className="text-green-700 underline">Privacy Policy</Link>.</li>
            <li>If you are using the Service on behalf of an organisation, you have the authority to bind that organisation to these Terms.</li>
          </ul>
        </Section>

        <Section id="description" title="3. Description of the Service">
          <p>Cvixeo provides an AI-powered platform that allows users to create, edit, customise, and export professional resumes and CVs. Features include but are not limited to:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>AI-assisted content generation for resume sections</li>
            <li>ATS (Applicant Tracking System) optimisation scoring</li>
            <li>Job description matching and keyword analysis</li>
            <li>Professional resume templates</li>
            <li>PDF export</li>
            <li>Cover letter generation</li>
          </ul>
          <p>We reserve the right to modify, suspend, or discontinue any feature of the Service at any time. Where reasonably possible, we will provide advance notice of significant changes.</p>
        </Section>

        <Section id="account" title="4. Account Registration and Security">
          <p>To access most features, you must create an account. You agree to:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain the confidentiality of your password and account credentials.</li>
            <li>Notify us immediately at <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a> of any unauthorised access to your account.</li>
            <li>Take responsibility for all activities that occur under your account.</li>
          </ul>
          <p>We are not liable for any loss or damage arising from your failure to maintain account security.</p>
        </Section>

        <Section id="subscriptions" title="5. Subscriptions, Billing, and 7-Day Pass">
          <p><strong>Free plan:</strong> A free account gives access to basic features with limitations on exports and templates.</p>
          <p><strong>7-Day Premium Pass:</strong> A one-time payment of €3.99 grants full Premium access for 7 days from the date of purchase. At the end of the 7-day period, your account automatically reverts to the Free plan. No recurring charges.</p>
          <p><strong>Monthly Premium Subscription:</strong> Billed at €12 per month on the same day each month. Continues until cancelled.</p>
          <p><strong>Annual Premium Subscription:</strong> Billed at €108 per year (equivalent to €9/month, a 25% saving). Continues until cancelled.</p>
          <p>Subscriptions renew automatically unless cancelled before the renewal date. You may cancel at any time via your Account Settings. Access continues until the end of the current paid period.</p>
          <p>All prices include applicable VAT where required by law.</p>
        </Section>

        <Section id="refunds" title="6. Refund Policy">
          <p><strong>Monthly and Annual Subscriptions</strong> include a <strong>14-day money-back guarantee</strong> from the date of the first payment. If you are not satisfied for any reason, contact us within 14 days of payment and we will issue a full refund, no questions asked.</p>
          <p><strong>7-Day Premium Pass:</strong> Due to the short nature of the pass, refunds are available within 48 hours of purchase if no Premium features have been used.</p>
          <p>To request a refund, contact <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a>. Refunds are processed within 5 to 10 business days.</p>
        </Section>

        <Section id="acceptable-use" title="7. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Create, distribute, or submit resumes containing false, fraudulent, or misleading information.</li>
            <li>Impersonate any person or entity or misrepresent your affiliation.</li>
            <li>Upload malware, viruses, or any malicious code.</li>
            <li>Attempt to scrape, reverse-engineer, or extract the underlying AI models, templates, or source code.</li>
            <li>Use the Service in any way that violates applicable law, including data protection law.</li>
            <li>Resell or sublicense access to the Service without our written consent.</li>
          </ul>
          <p>We reserve the right to suspend or terminate accounts that violate this section.</p>
        </Section>

        <Section id="intellectual-property" title="8. Intellectual Property">
          <p><strong>Your Content:</strong> You retain full ownership of all Content you create or upload using the Service, including the text and structure of your CVs. You grant Cvixeo a limited, non-exclusive licence to store, process, and display your Content solely to the extent necessary to provide the Service to you.</p>
          <p><strong>Cvixeo's Property:</strong> The Service, including its code, design, templates, AI models, algorithms, and branding, is owned by Cvixeo and protected by intellectual property law. You may not copy, modify, distribute, or create derivative works from any part of the Service without our prior written permission.</p>
        </Section>

        <Section id="ai-content" title="9. AI-Generated Content">
          <p>Cvixeo uses AI models to generate resume content, ATS suggestions, and cover letters. You acknowledge that:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>AI-generated content is a tool to assist you, not a guarantee of employment outcomes.</li>
            <li>You are responsible for reviewing, editing, and verifying all AI-generated content before submitting it to employers.</li>
            <li>You must ensure that any content you use accurately represents your qualifications and experience.</li>
          </ul>
        </Section>

        <Section id="privacy-ref" title="10. Privacy and Data Protection">
          <p>Our collection and use of personal data is governed by our <Link href="/privacy" className="text-green-700 underline">Privacy Policy</Link>, which is incorporated into these Terms by reference. For users in the European Union, our Privacy Policy describes your rights under the GDPR.</p>
        </Section>

        <Section id="liability" title="11. Limitation of Liability">
          <p>To the fullest extent permitted by applicable law:</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>The Service is provided "as is" and "as available" without warranties of any kind, express or implied.</li>
            <li>We do not warrant that the Service will be error-free, uninterrupted, or that it will produce specific employment results.</li>
            <li>Cvixeo's total cumulative liability to you for any claim arising out of or relating to the Service shall not exceed the amount you paid to us in the 12 months preceding the claim.</li>
            <li>We are not liable for any indirect, incidental, special, consequential, or punitive damages.</li>
          </ul>
          <p>Nothing in these Terms excludes liability for fraud, death or personal injury caused by negligence, or any other liability that cannot be lawfully excluded under French or EU law.</p>
        </Section>

        <Section id="indemnification" title="12. Indemnification">
          <p>You agree to indemnify and hold Cvixeo, its directors, employees, and agents harmless from any claims, damages, or expenses (including legal fees) arising out of your use of the Service, your violation of these Terms, or your infringement of any third party's rights.</p>
        </Section>

        <Section id="termination" title="13. Termination">
          <p>You may terminate your account at any time by deleting it from your Account Settings or by contacting us. Upon termination, we will delete your personal data in accordance with our Privacy Policy.</p>
          <p>We may suspend or terminate your account immediately if you breach these Terms, if required by law, or if your account poses a security or legal risk to the Service or other users. Where possible, we will provide notice.</p>
        </Section>

        <Section id="governing-law" title="14. Governing Law and Dispute Resolution">
          <p>These Terms are governed by and construed in accordance with the laws of <strong>France</strong>, without regard to its conflict of law provisions. The EU's mandatory consumer protection provisions apply where you are an EU consumer.</p>
          <p>In the event of a dispute, we encourage you to contact us first to seek an amicable resolution. If a dispute cannot be resolved, it will be subject to the exclusive jurisdiction of the courts of France, unless applicable EU law requires otherwise.</p>
          <p>EU consumers also have the right to use the EU Online Dispute Resolution platform at <a href="https://ec.europa.eu/consumers/odr" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.</p>
        </Section>

        <Section id="changes" title="15. Changes to These Terms">
          <p>We may update these Terms from time to time. We will notify you of material changes by email or by a prominent notice on the Service at least 30 days before the changes take effect. Your continued use of the Service after the effective date constitutes acceptance of the updated Terms.</p>
        </Section>

        <Section id="contact" title="16. Contact">
          <p>For questions about these Terms of Use, please contact:</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>Email: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Contact form: <Link href="/contact" className="text-green-700 underline">cvixeo.com/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}

function TermsFR() {
  return (
    <>
      <div className="mb-8 rounded-xl bg-amber-50 px-5 py-4 text-xs leading-relaxed text-amber-800 ring-1 ring-amber-100">
        Veuillez lire attentivement ces Conditions d'utilisation avant d'utiliser <strong>cvixeo.com</strong> et tout service associé fourni par <strong>Cvixeo</strong> (« nous », « notre »). En accédant au Service ou en l'utilisant, vous acceptez d'être lié par ces Conditions. Si vous n'êtes pas d'accord, n'utilisez pas le Service.
      </div>

      <div className="space-y-8">
        <Section id="definitions" title="1. Définitions">
          <p><strong>« Service »</strong> désigne le site web Cvixeo à l'adresse cvixeo.com, y compris toutes les fonctionnalités, outils, modèles et fonctions basées sur l'IA qui y sont accessibles.</p>
          <p><strong>« Utilisateur »</strong> ou <strong>« vous »</strong> désigne toute personne qui accède au Service ou l'utilise.</p>
          <p><strong>« Contenu »</strong> désigne toute information, texte, donnée ou fichier que vous soumettez, téléversez ou créez via le Service.</p>
          <p><strong>« Abonnement »</strong> désigne un forfait mensuel ou annuel payant donnant accès aux fonctionnalités premium.</p>
        </Section>

        <Section id="acceptance" title="2. Acceptation des conditions">
          <p>En créant un compte ou en utilisant le Service, vous confirmez que :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Vous avez au moins 16 ans, ou vous avez obtenu le consentement d'un parent ou tuteur légal.</li>
            <li>Vous avez lu, compris et accepté d'être lié par ces Conditions et notre <Link href="/privacy" className="text-green-700 underline">Politique de confidentialité</Link>.</li>
            <li>Si vous utilisez le Service pour le compte d'une organisation, vous avez l'autorité pour engager cette organisation vis-à-vis de ces Conditions.</li>
          </ul>
        </Section>

        <Section id="description" title="3. Description du Service">
          <p>Cvixeo propose une plateforme propulsée par l'IA permettant aux utilisateurs de créer, modifier, personnaliser et exporter des CV professionnels. Les fonctionnalités incluent notamment :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Génération de contenu assistée par IA pour les sections du CV</li>
            <li>Score d'optimisation ATS (système de suivi des candidatures)</li>
            <li>Correspondance avec les offres d'emploi et analyse de mots-clés</li>
            <li>Modèles de CV professionnels</li>
            <li>Export PDF</li>
            <li>Génération de lettres de motivation</li>
          </ul>
          <p>Nous nous réservons le droit de modifier, suspendre ou interrompre toute fonctionnalité du Service à tout moment. Dans la mesure du raisonnablement possible, nous fournirons un préavis pour tout changement significatif.</p>
        </Section>

        <Section id="account" title="4. Inscription et sécurité du compte">
          <p>Pour accéder à la plupart des fonctionnalités, vous devez créer un compte. Vous acceptez de :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Fournir des informations exactes, à jour et complètes lors de l'inscription.</li>
            <li>Préserver la confidentialité de votre mot de passe et de vos identifiants de compte.</li>
            <li>Nous informer immédiatement à <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a> de tout accès non autorisé à votre compte.</li>
            <li>Assumer la responsabilité de toutes les activités effectuées via votre compte.</li>
          </ul>
          <p>Nous ne sommes pas responsables des pertes ou dommages résultant de votre manquement à préserver la sécurité de votre compte.</p>
        </Section>

        <Section id="subscriptions" title="5. Abonnements, facturation et Pass 7 jours">
          <p><strong>Offre gratuite :</strong> Un compte gratuit donne accès aux fonctionnalités de base, avec des limitations sur les exports et les modèles.</p>
          <p><strong>Pass Premium 7 jours :</strong> Un paiement unique de 3,99 € accorde un accès Premium complet pendant 7 jours à compter de la date d'achat. À l'issue de cette période, votre compte repasse automatiquement à l'offre gratuite. Aucun prélèvement récurrent.</p>
          <p><strong>Abonnement Premium mensuel :</strong> Facturé 12 € par mois, le même jour chaque mois. Se poursuit jusqu'à résiliation.</p>
          <p><strong>Abonnement Premium annuel :</strong> Facturé 108 € par an (équivalent à 9 €/mois, soit 25 % d'économie). Se poursuit jusqu'à résiliation.</p>
          <p>Les abonnements se renouvellent automatiquement sauf annulation avant la date de renouvellement. Vous pouvez annuler à tout moment depuis les paramètres de votre compte. L'accès se poursuit jusqu'à la fin de la période payée en cours.</p>
          <p>Tous les prix incluent la TVA applicable lorsque la loi l'exige.</p>
        </Section>

        <Section id="refunds" title="6. Politique de remboursement">
          <p>Les <strong>abonnements mensuels et annuels</strong> bénéficient d'une <strong>garantie de remboursement de 14 jours</strong> à compter de la date du premier paiement. Si vous n'êtes pas satisfait pour quelque raison que ce soit, contactez-nous dans les 14 jours suivant le paiement et nous procéderons à un remboursement intégral, sans justification à fournir.</p>
          <p><strong>Pass Premium 7 jours :</strong> En raison de sa courte durée, ce pass est remboursable dans les 48 heures suivant l'achat si aucune fonctionnalité Premium n'a été utilisée.</p>
          <p>Pour demander un remboursement, contactez <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a>. Les remboursements sont traités sous 5 à 10 jours ouvrés.</p>
        </Section>

        <Section id="acceptable-use" title="7. Utilisation acceptable">
          <p>Vous acceptez de ne pas utiliser le Service pour :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Créer, distribuer ou soumettre des CV contenant des informations fausses, frauduleuses ou trompeuses.</li>
            <li>Usurper l'identité d'une personne ou d'une entité, ou déformer votre affiliation.</li>
            <li>Téléverser des logiciels malveillants, virus ou tout code nuisible.</li>
            <li>Tenter d'extraire, de rétro-concevoir ou d'exfiltrer les modèles d'IA, modèles de CV ou le code source sous-jacents.</li>
            <li>Utiliser le Service d'une manière contraire à la loi applicable, y compris le droit de la protection des données.</li>
            <li>Revendre ou concéder en sous-licence l'accès au Service sans notre consentement écrit.</li>
          </ul>
          <p>Nous nous réservons le droit de suspendre ou de résilier les comptes qui enfreignent cette section.</p>
        </Section>

        <Section id="intellectual-property" title="8. Propriété intellectuelle">
          <p><strong>Votre Contenu :</strong> Vous conservez l'entière propriété de tout Contenu que vous créez ou téléversez via le Service, y compris le texte et la structure de vos CV. Vous accordez à Cvixeo une licence limitée et non exclusive pour stocker, traiter et afficher votre Contenu, dans la seule mesure nécessaire pour vous fournir le Service.</p>
          <p><strong>Propriété de Cvixeo :</strong> Le Service, y compris son code, son design, ses modèles, ses modèles d'IA, ses algorithmes et son image de marque, appartient à Cvixeo et est protégé par le droit de la propriété intellectuelle. Vous ne pouvez copier, modifier, distribuer ou créer des œuvres dérivées d'aucune partie du Service sans notre autorisation écrite préalable.</p>
        </Section>

        <Section id="ai-content" title="9. Contenu généré par IA">
          <p>Cvixeo utilise des modèles d'IA pour générer du contenu de CV, des suggestions ATS et des lettres de motivation. Vous reconnaissez que :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Le contenu généré par IA est un outil d'assistance, pas une garantie de résultat en matière d'emploi.</li>
            <li>Vous êtes responsable de la relecture, de la modification et de la vérification de tout contenu généré par IA avant de le soumettre à des employeurs.</li>
            <li>Vous devez vous assurer que tout contenu utilisé représente fidèlement vos qualifications et votre expérience.</li>
          </ul>
        </Section>

        <Section id="privacy-ref" title="10. Confidentialité et protection des données">
          <p>La collecte et l'utilisation de vos données personnelles sont régies par notre <Link href="/privacy" className="text-green-700 underline">Politique de confidentialité</Link>, incorporée aux présentes Conditions par référence. Pour les utilisateurs de l'Union européenne, notre Politique de confidentialité décrit vos droits en vertu du RGPD.</p>
        </Section>

        <Section id="liability" title="11. Limitation de responsabilité">
          <p>Dans toute la mesure permise par la loi applicable :</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>Le Service est fourni « tel quel » et « selon disponibilité », sans garantie d'aucune sorte, expresse ou implicite.</li>
            <li>Nous ne garantissons pas que le Service sera exempt d'erreurs, ininterrompu, ou qu'il produira des résultats d'emploi spécifiques.</li>
            <li>La responsabilité cumulée totale de Cvixeo envers vous pour toute réclamation liée au Service ne pourra excéder le montant que vous nous avez versé au cours des 12 mois précédant la réclamation.</li>
            <li>Nous ne sommes pas responsables des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs.</li>
          </ul>
          <p>Rien dans ces Conditions n'exclut la responsabilité en cas de fraude, de décès ou de blessure corporelle causés par négligence, ni toute autre responsabilité qui ne peut être légalement exclue en vertu du droit français ou européen.</p>
        </Section>

        <Section id="indemnification" title="12. Indemnisation">
          <p>Vous acceptez d'indemniser et de dégager de toute responsabilité Cvixeo, ses dirigeants, employés et agents, de toute réclamation, dommage ou dépense (y compris les frais juridiques) découlant de votre utilisation du Service, de votre violation de ces Conditions, ou de votre atteinte aux droits d'un tiers.</p>
        </Section>

        <Section id="termination" title="13. Résiliation">
          <p>Vous pouvez résilier votre compte à tout moment en le supprimant depuis les paramètres de votre compte ou en nous contactant. Après résiliation, nous supprimerons vos données personnelles conformément à notre Politique de confidentialité.</p>
          <p>Nous pouvons suspendre ou résilier votre compte immédiatement si vous enfreignez ces Conditions, si la loi l'exige, ou si votre compte présente un risque de sécurité ou juridique pour le Service ou d'autres utilisateurs. Dans la mesure du possible, nous vous en informerons.</p>
        </Section>

        <Section id="governing-law" title="14. Droit applicable et résolution des litiges">
          <p>Ces Conditions sont régies et interprétées conformément au droit <strong>français</strong>, sans égard aux principes de conflits de lois. Les dispositions impératives de protection des consommateurs de l'UE s'appliquent lorsque vous êtes un consommateur européen.</p>
          <p>En cas de litige, nous vous encourageons à nous contacter en premier lieu afin de rechercher une résolution amiable. Si un litige ne peut être résolu, il relèvera de la compétence exclusive des tribunaux français, sauf disposition contraire du droit de l'UE applicable.</p>
          <p>Les consommateurs européens ont également le droit d'utiliser la plateforme européenne de règlement en ligne des litiges à l'adresse <a href="https://ec.europa.eu/consumers/odr" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.</p>
        </Section>

        <Section id="changes" title="15. Modifications de ces Conditions">
          <p>Nous pouvons mettre à jour ces Conditions de temps à autre. Nous vous informerons de tout changement important par e-mail ou par un avis bien visible sur le Service, au moins 30 jours avant leur entrée en vigueur. La poursuite de votre utilisation du Service après la date d'entrée en vigueur vaut acceptation des Conditions mises à jour.</p>
        </Section>

        <Section id="contact" title="16. Contact">
          <p>Pour toute question concernant ces Conditions d'utilisation, veuillez contacter :</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>E-mail : <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Formulaire de contact : <Link href="/fr/contact" className="text-green-700 underline">cvixeo.com/fr/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}
