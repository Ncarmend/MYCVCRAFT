import type { CV } from "@/types";

interface Props { cv: Partial<CV>; watermark?: boolean; }

export function SoftTemplate({ cv, watermark = false }: Props) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div className={`relative bg-white font-sans text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto" }}>

      {/* Soft pale header */}
      <header style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #ede9fe 100%)", padding: "44px 56px 32px" }}>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#4c1d5c" }}>{cv.name}</h1>
        <p className="mt-1.5 text-base font-medium" style={{ color: "#7c3aed" }}>{cv.jobTitle}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs" style={{ color: "#9461b8" }}>
          {cv.email && <span>✉ {cv.email}</span>}
          {cv.phone && <span>✆ {cv.phone}</span>}
          {cv.location && <span>⌖ {cv.location}</span>}
          {cv.website && <span>⬡ {cv.website}</span>}
          {cv.linkedin && <span>in {cv.linkedin}</span>}
          {cv.github && <span>⌥ {cv.github}</span>}
        </div>
      </header>

      <div style={{ padding: "32px 56px" }}>
        {cv.summary && (
          <section className="mb-6 rounded-xl p-4" style={{ background: "#fdf2f8", border: "1px solid #f3e8ff" }}>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>About Me</h2>
            <p className="leading-relaxed text-gray-600">{cv.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>
              <span className="h-px flex-1" style={{ background: "#e9d5ff" }} />
              Experience
              <span className="h-px flex-1" style={{ background: "#e9d5ff" }} />
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="rounded-lg p-3" style={{ background: "#faf5ff", border: "1px solid #ede9fe" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-xs font-medium" style={{ color: "#7c3aed" }}>{exp.company}</p>
                    </div>
                    <span className="ml-3 flex-shrink-0 rounded-full px-2.5 py-0.5 text-xs" style={{ background: "#ede9fe", color: "#5b21b6" }}>
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="mt-1.5 text-sm text-gray-600">{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "#a78bfa" }} />{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-8">
          <div>
            {education.length > 0 && (
              <section className="mb-5">
                <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>Education</h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3 rounded-lg p-3" style={{ background: "#fdf2f8", border: "1px solid #fce7f3" }}>
                    <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                    <p className="text-xs" style={{ color: "#9333ea" }}>{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.startDate} — {edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {languages.length > 0 && (
              <section>
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>Languages</h2>
                {languages.map((l) => (
                  <div key={l.id} className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-700">{l.name}</span>
                    <span className="rounded-full px-2 py-0.5 text-xs" style={{ background: "#ede9fe", color: "#5b21b6" }}>{l.proficiency}</span>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <section className="mb-5">
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>Skills</h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, i) => (
                    <span key={i} className="rounded-full px-2.5 py-0.5 text-xs font-medium" style={{ background: "#fce7f3", color: "#9d174d", border: "1px solid #fbcfe8" }}>{s}</span>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>Certifications</h2>
                {certifications.map((c) => (
                  <div key={c.id} className="mb-2 text-sm">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p style={{ color: "#9461b8" }}>{c.issuer} · {c.date}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <section className="mt-2">
            <h2 className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7c3aed" }}>
              <span className="h-px flex-1" style={{ background: "#e9d5ff" }} />Projects<span className="h-px flex-1" style={{ background: "#e9d5ff" }} />
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((p) => (
                <div key={p.id} className="rounded-xl p-3" style={{ background: "linear-gradient(135deg, #fdf2f8, #ede9fe)", border: "1px solid #f3e8ff" }}>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  {p.description && <p className="mt-0.5 text-xs text-gray-500">{p.description}</p>}
                  {p.technologies?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.technologies.slice(0, 3).map((t, i) => (
                        <span key={i} className="rounded-full px-1.5 py-0.5 text-xs" style={{ background: "#ede9fe", color: "#5b21b6" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
