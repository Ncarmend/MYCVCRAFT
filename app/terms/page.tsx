import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-gray-900 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          CVCraft
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>By using CVCraft, you agree to these Terms of Service. If you do not agree, please do not use the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. Use of Service</h2>
            <p>CVCraft provides AI-powered CV creation tools. You are responsible for the content you create. You may not use the service for any unlawful purpose.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Accounts</h2>
            <p>You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Subscriptions and Billing</h2>
            <p>Pro subscriptions are billed monthly. You may cancel at any time. Refunds are handled on a case-by-case basis.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Intellectual Property</h2>
            <p>You retain ownership of the CV content you create. CVCraft retains ownership of the platform, design, and underlying technology.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Limitation of Liability</h2>
            <p>CVCraft is provided &quot;as is&quot; without warranties. We are not liable for any indirect or consequential damages arising from use of the service.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Contact</h2>
            <p>For questions about these terms, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
