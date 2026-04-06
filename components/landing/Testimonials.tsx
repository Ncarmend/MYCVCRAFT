/**
 * Social proof / testimonials section
 */
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    avatar: "SC",
    content:
      "CVCraft helped me land my dream job at Google. The ATS optimization feature was a game-changer — my CV was getting ignored before, but after the AI suggestions I started getting callbacks within days.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Product Manager at Stripe",
    avatar: "MJ",
    content:
      "I rewrote my CV 4 times before trying CVCraft. The job description matching feature is incredible — it told me exactly which keywords I was missing and helped me tailor each application.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "UX Designer at Figma",
    avatar: "ER",
    content:
      "The modern template is stunning. Multiple recruiters mentioned how professional my CV looked. The cover letter generator saved me hours per application.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Data Scientist at OpenAI",
    avatar: "DP",
    content:
      "As someone who hates writing, the AI generation feature was perfect. I just filled in my experience and it turned my bullet points into compelling, professional descriptions.",
    rating: 5,
  },
  {
    name: "Priya Patel",
    role: "Marketing Lead at HubSpot",
    avatar: "PP",
    content:
      "Worth every penny of the Pro plan. I upgraded within 10 minutes of trying the free plan — the unlimited CVs and PDF export are essential when you're actively job hunting.",
    rating: 5,
  },
  {
    name: "James Williams",
    role: "Backend Engineer at Vercel",
    avatar: "JW",
    content:
      "The ATS score went from 42 to 91 after following CVCraft's suggestions. I had 3 interviews scheduled within a week of updating my CV.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-widest">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Loved by job seekers worldwide
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl bg-gray-50 p-6 ring-1 ring-gray-100"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="flex-1 text-sm leading-relaxed text-gray-600">
                &ldquo;{t.content}&rdquo;
              </p>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
