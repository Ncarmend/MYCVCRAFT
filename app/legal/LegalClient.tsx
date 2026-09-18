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

export function LegalClient() {
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
            {lang === "fr" ? "Mentions légales" : lang === "nl" ? "Wettelijke vermeldingen" : "Legal Notice"}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            {lang === "fr" ? "Mentions légales — Dernière mise à jour : juillet 2026" : lang === "nl" ? "Wettelijke vermeldingen — Laatst bijgewerkt: juli 2026" : "Mentions légales — Last updated: July 2026"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
          {lang === "fr" ? <LegalFR /> : lang === "nl" ? <LegalNL /> : <LegalEN />}
        </div>
      </div>
    </>
  );
}

function LegalEN() {
  return (
    <>
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
    </>
  );
}

function LegalFR() {
  return (
    <>
      <div className="mb-8 text-xs leading-relaxed text-slate-500">
        Conformément aux articles 6 et 19 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), les informations suivantes sont mises à disposition des utilisateurs du site <strong>cvixeo.com</strong>.
      </div>

      <div className="space-y-8">
        <Section id="publisher" title="1. Éditeur du site">
          <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm ring-1 ring-slate-100">
            <p><strong>Site web :</strong> cvixeo.com</p>
            <p className="mt-1"><strong>Éditeur :</strong> Cvixeo</p>
            <p className="mt-1"><strong>E-mail :</strong> <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1"><strong>Directeur de la publication :</strong> La direction de Cvixeo</p>
          </div>
          <p>Cvixeo est un service en ligne. Pour toute communication juridique formelle, veuillez utiliser l'adresse e-mail indiquée ci-dessus.</p>
        </Section>

        <Section id="hosting" title="2. Hébergement">
          <p>Le site cvixeo.com est hébergé par :</p>
          <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm ring-1 ring-slate-100">
            <p><strong>Vercel Inc.</strong></p>
            <p>340 Pine Street, Suite 900</p>
            <p>San Francisco, CA 94104</p>
            <p>États-Unis</p>
            <p className="mt-1"><a href="https://vercel.com" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
          </div>
          <p>Les services de base de données et d'authentification sont fournis par Supabase (Supabase Inc.), fonctionnant sur l'infrastructure AWS avec des options de centres de données européens.</p>
        </Section>

        <Section id="intellectual-property" title="3. Propriété intellectuelle">
          <p>L'ensemble du contenu du site cvixeo.com — notamment les textes, images, graphiques, logos, icônes, logiciels, modèles, modèles d'IA et la conception générale de l'interface — est la propriété exclusive de Cvixeo ou de ses concédants et est protégé par le droit de la propriété intellectuelle français et international.</p>
          <p>Toute reproduction, représentation, modification, distribution ou utilisation, totale ou partielle, d'un élément du site, sans l'autorisation écrite préalable de Cvixeo, est strictement interdite et constitue une contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété intellectuelle.</p>
          <p>Le nom et le logo Cvixeo sont des marques déposées. Toute utilisation non autorisée est strictement interdite.</p>
          <p><strong>Exception :</strong> Le contenu créé par les utilisateurs à l'aide des outils de Cvixeo (texte de CV, lettres de motivation, etc.) demeure la propriété intellectuelle exclusive de l'utilisateur qui l'a créé. Cvixeo ne revendique aucun droit sur le contenu généré par les utilisateurs.</p>
        </Section>

        <Section id="personal-data" title="4. Données personnelles et RGPD">
          <p>Cvixeo traite les données personnelles de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD — Règlement (UE) 2016/679) et à la loi française Informatique et Libertés.</p>
          <p>Pour plus de détails sur la manière dont nous collectons, utilisons, stockons et protégeons vos données personnelles, et pour comprendre vos droits en tant que personne concernée, veuillez consulter notre <Link href="/privacy" className="text-green-700 underline">Politique de confidentialité</Link>.</p>
          <p>Pour exercer vos droits ou pour toute question relative à la protection des données, contactez : <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
        </Section>

        <Section id="cookies" title="5. Cookies">
          <p>Le site cvixeo.com utilise des cookies strictement nécessaires à l'authentification et aux préférences utilisateur. Nous n'utilisons pas de cookies publicitaires ou de suivi. Pour plus de détails, consultez notre <Link href="/cookies" className="text-green-700 underline">Politique de cookies</Link>.</p>
        </Section>

        <Section id="limitation" title="6. Limitation de responsabilité">
          <p>Cvixeo met tout en œuvre pour garantir l'exactitude et la mise à jour des informations disponibles sur cvixeo.com. Toutefois, Cvixeo ne peut garantir l'exactitude, l'exhaustivité ou l'actualité des informations publiées sur le site et décline toute responsabilité en cas d'erreurs ou d'omissions.</p>
          <p>Cvixeo se réserve le droit de modifier, mettre à jour ou supprimer le contenu du site à tout moment et sans préavis.</p>
          <p>Cvixeo n'est pas responsable des dommages, directs ou indirects, résultant de l'accès au site ou de son utilisation, y compris toute perte de données, interruption technique ou faille de sécurité échappant à son contrôle raisonnable.</p>
        </Section>

        <Section id="hyperlinks" title="7. Liens hypertextes">
          <p>Le site cvixeo.com peut contenir des liens vers des sites tiers. Ces liens sont fournis à titre purement informatif. Cvixeo n'exerce aucun contrôle sur le contenu des sites tiers et décline toute responsabilité à leur égard.</p>
          <p>La création de liens hypertextes vers cvixeo.com nécessite l'autorisation écrite préalable de Cvixeo.</p>
        </Section>

        <Section id="applicable-law" title="8. Droit applicable et juridiction">
          <p>Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur application relèvera de la compétence exclusive des tribunaux français compétents, sous réserve des dispositions impératives de protection des consommateurs de l'UE.</p>
        </Section>

        <Section id="contact-legal" title="9. Contact">
          <p>Pour toute question juridique relative au site cvixeo.com :</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>E-mail : <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Formulaire de contact : <Link href="/fr/contact" className="text-green-700 underline">cvixeo.com/fr/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}

function LegalNL() {
  return (
    <>
      <div className="mb-8 text-xs leading-relaxed text-slate-500">
        Overeenkomstig de artikelen 6 en 19 van de Franse wet nr. 2004-575 van 21 juni 2004 betreffende het vertrouwen in de digitale economie (Loi pour la Confiance dans l'Économie Numérique — LCEN), wordt de volgende informatie ter beschikking gesteld van de gebruikers van de website <strong>cvixeo.com</strong>.
      </div>

      <div className="space-y-8">
        <Section id="publisher" title="1. Uitgever van de website">
          <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm ring-1 ring-slate-100">
            <p><strong>Website:</strong> cvixeo.com</p>
            <p className="mt-1"><strong>Uitgever:</strong> Cvixeo</p>
            <p className="mt-1"><strong>E-mail:</strong> <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1"><strong>Publicatieverantwoordelijke:</strong> De directie van Cvixeo</p>
          </div>
          <p>Cvixeo is een online dienst. Voor formele juridische communicatie gebruik je het hierboven vermelde e-mailadres.</p>
        </Section>

        <Section id="hosting" title="2. Hosting">
          <p>De website cvixeo.com wordt gehost door:</p>
          <div className="rounded-lg bg-slate-50 px-4 py-4 text-sm ring-1 ring-slate-100">
            <p><strong>Vercel Inc.</strong></p>
            <p>340 Pine Street, Suite 900</p>
            <p>San Francisco, CA 94104</p>
            <p>Verenigde Staten</p>
            <p className="mt-1"><a href="https://vercel.com" className="text-green-700 underline" target="_blank" rel="noopener noreferrer">vercel.com</a></p>
          </div>
          <p>Database- en authenticatiediensten worden geleverd door Supabase (Supabase Inc.), dat draait op AWS-infrastructuur met Europese datacenteropties.</p>
        </Section>

        <Section id="intellectual-property" title="3. Intellectuele eigendom">
          <p>De volledige inhoud van de website cvixeo.com — met inbegrip van, maar niet beperkt tot, teksten, afbeeldingen, grafische elementen, logo's, iconen, software, sjablonen, AI-modellen en het algemene interfaceontwerp — is de exclusieve eigendom van Cvixeo of haar licentiegevers en wordt beschermd door het Franse en internationale intellectuele-eigendomsrecht.</p>
          <p>Elke reproductie, weergave, wijziging, verspreiding of gebruik van enig onderdeel van de website, geheel of gedeeltelijk, zonder de voorafgaande schriftelijke toestemming van Cvixeo, is strikt verboden en vormt een inbreuk die strafbaar is onder de artikelen L.335-2 en volgende van het Franse Wetboek van Intellectuele Eigendom.</p>
          <p>De naam en het logo Cvixeo zijn merken. Ongeoorloofd gebruik is strikt verboden.</p>
          <p><strong>Uitzondering:</strong> Inhoud die gebruikers aanmaken met de tools van Cvixeo (cv-tekst, sollicitatiebrieven, enz.) blijft de exclusieve intellectuele eigendom van de gebruiker die ze heeft aangemaakt. Cvixeo maakt geen aanspraak op door gebruikers gegenereerde inhoud.</p>
        </Section>

        <Section id="personal-data" title="4. Persoonsgegevens en AVG">
          <p>Cvixeo verwerkt de persoonsgegevens van zijn gebruikers in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG — Verordening (EU) 2016/679) en de Franse wet Informatique et Libertés.</p>
          <p>Voor volledige details over hoe we je persoonsgegevens verzamelen, gebruiken, bewaren en beschermen, en om je rechten als betrokkene te begrijpen, raadpleeg ons <Link href="/nl/privacy" className="text-green-700 underline">Privacybeleid</Link>.</p>
          <p>Om je rechten uit te oefenen of voor vragen over gegevensbescherming, contacteer: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
        </Section>

        <Section id="cookies" title="5. Cookies">
          <p>De website cvixeo.com gebruikt strikt noodzakelijke cookies voor authenticatie en gebruikersvoorkeuren. We gebruiken geen advertentie- of trackingcookies. Voor volledige details, zie ons <Link href="/nl/cookies" className="text-green-700 underline">Cookiebeleid</Link>.</p>
        </Section>

        <Section id="limitation" title="6. Beperking van aansprakelijkheid">
          <p>Cvixeo doet er alles aan om ervoor te zorgen dat de informatie op cvixeo.com correct en actueel is. Cvixeo kan echter de juistheid, volledigheid of actualiteit van de op de website gepubliceerde informatie niet garanderen en wijst elke aansprakelijkheid af voor eventuele fouten of weglatingen.</p>
          <p>Cvixeo behoudt zich het recht voor om de inhoud van de website op elk moment en zonder voorafgaande kennisgeving te wijzigen, bij te werken of te verwijderen.</p>
          <p>Cvixeo is niet aansprakelijk voor enige directe of indirecte schade die voortvloeit uit de toegang tot of het gebruik van de website, met inbegrip van gegevensverlies, technische onderbreking of een veiligheidslek dat buiten haar redelijke controle valt.</p>
        </Section>

        <Section id="hyperlinks" title="7. Hyperlinks">
          <p>De website cvixeo.com kan links bevatten naar websites van derden. Deze links worden uitsluitend ter informatie aangeboden. Cvixeo heeft geen controle over de inhoud van websites van derden en aanvaardt hiervoor geen aansprakelijkheid.</p>
          <p>Het aanmaken van hyperlinks naar cvixeo.com vereist de voorafgaande schriftelijke toestemming van Cvixeo.</p>
        </Section>

        <Section id="applicable-law" title="8. Toepasselijk recht en bevoegdheid">
          <p>Deze wettelijke vermeldingen worden beheerst door het Franse recht. Elk geschil met betrekking tot de interpretatie of toepassing ervan valt onder de exclusieve bevoegdheid van de bevoegde Franse rechtbanken, onder voorbehoud van de dwingende consumentenbeschermingsbepalingen van de EU.</p>
        </Section>

        <Section id="contact-legal" title="9. Contact">
          <p>Voor juridische vragen met betrekking tot de website cvixeo.com:</p>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-xs ring-1 ring-slate-100">
            <p>E-mail: <a href="mailto:support@cvixeo.com" className="text-green-700 underline">support@cvixeo.com</a></p>
            <p className="mt-1">Contactformulier: <Link href="/nl/contact" className="text-green-700 underline">cvixeo.com/nl/contact</Link></p>
          </div>
        </Section>
      </div>
    </>
  );
}
