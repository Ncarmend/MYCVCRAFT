import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-gray-900 mb-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          CVCraft
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 2026</p>

        <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-gray-900">1. Information We Collect</h2>
            <p>We collect information you provide directly: name, email address, and CV content. We also collect usage data such as pages visited and features used.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p>We use your information to provide and improve the CVCraft service, process payments, and send important service updates. We do not sell your personal data.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">3. Data Storage</h2>
            <p>Your data is stored securely using Supabase (PostgreSQL). CV content is private by default and only accessible to you unless you explicitly share it.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">4. Third-Party Services</h2>
            <p>We use Supabase for authentication and storage, Stripe for payments, and OpenAI for AI features. Each of these services has their own privacy policy.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">5. Cookies</h2>
            <p>We use cookies to maintain your session and authentication state. We do not use tracking or advertising cookies.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">6. Your Rights</h2>
            <p>You may request deletion of your account and all associated data at any time by contacting us. You can also export your CV data from within the app.</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-gray-900">7. Contact</h2>
            <p>For privacy-related questions, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
