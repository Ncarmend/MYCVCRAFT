import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NavbarServer } from "@/components/landing/NavbarServer";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const metadata: Metadata = {
  title: "Terms of Use — Cvixeo",
  description: "The terms and conditions that govern your use of Cvixeo's AI-powered CV builder and related services.",
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-3 text-base font-bold text-slate-900">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function TermsPage() {
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
              Terms of Use
            </h1>
            <p className="mt-2 text-xs text-slate-400">Last updated: July 2026 · Applies to cvixeo.com</p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

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
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
