/**
 * Features section for the landing page
 */
import {
  Sparkles,
  FileDown,
  Target,
  LayoutTemplate,
  BrainCircuit,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Describe your experience and let GPT-4 write a compelling, professional CV tailored to your target role.",
    color: "indigo",
  },
  {
    icon: Target,
    title: "ATS Optimization",
    description:
      "Score your CV against Applicant Tracking Systems and get specific suggestions to pass automated screening.",
    color: "purple",
  },
  {
    icon: BrainCircuit,
    title: "Job Description Matching",
    description:
      "Paste any job listing and get a match score plus a list of improvements to tailor your CV perfectly.",
    color: "violet",
  },
  {
    icon: LayoutTemplate,
    title: "Beautiful Templates",
    description:
      "Choose from professionally designed templates. Switch between styles instantly without losing your data.",
    color: "blue",
  },
  {
    icon: FileDown,
    title: "One-Click PDF Export",
    description:
      "Download pixel-perfect PDFs that look great on screen and in print. Pro plan removes watermarks.",
    color: "sky",
  },
  {
    icon: Shield,
    title: "Cover Letter Generator",
    description:
      "Automatically generate personalized cover letters matched to specific job descriptions and companies.",
    color: "emerald",
  },
];

const colorMap: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-100",
  purple: "bg-purple-50 text-purple-600 ring-purple-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  sky: "bg-sky-50 text-sky-600 ring-sky-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
};

export function Features() {
  return (
    <section className="bg-gray-50 py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-indigo-600 uppercase tracking-widest">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to land the job
          </p>
          <p className="mt-4 text-lg text-gray-500">
            From first draft to final PDF — CVCraft handles the heavy lifting so
            you can focus on what matters.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="relative rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div
                className={`inline-flex rounded-xl p-3 ring-1 ${colorMap[feature.color]}`}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
