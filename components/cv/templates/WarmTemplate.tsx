import type { CV } from "@/types";
import { MailIcon, PhoneIcon, LocationIcon, WebIcon, LinkedinIcon, GithubIcon } from "./ContactIcons";

interface Props { cv: Partial<CV>; watermark?: boolean; }

export function WarmTemplate({ cv, watermark = false }: Props) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div className={`relative bg-white font-sans text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto" }}>

      {/* Beige header */}
      <header style={{ background: "#f5f0e8", padding: "40px 56px 32px" }}>
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#3d2b1f" }}>{cv.name}</h1>
        <p className="mt-1 text-base font-medium" style={{ color: "#7c5c3e" }}>{cv.jobTitle}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs" style={{ color: "#a07a5a" }}>
          {cv.email    && <span className="flex items-center gap-1"><MailIcon />     {cv.email}</span>}
          {cv.phone    && <span className="flex items-center gap-1"><PhoneIcon />    {cv.phone}</span>}
          {cv.location && <span className="flex items-center gap-1"><LocationIcon /> {cv.location}</span>}
          {cv.website  && <span className="flex items-center gap-1"><WebIcon />      {cv.website}</span>}
          {cv.linkedin && <span className="flex items-center gap-1"><LinkedinIcon /> {cv.linkedin}</span>}
          {cv.github   && <span className="flex items-center gap-1"><GithubIcon />   {cv.github}</span>}
        </div>
      </header>

      {/* Warm divider */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, #c9956a, #e8c9a0)" }} />

      <div style={{ padding: "32px 56px" }}>
        {cv.summary && (
          <section className="mb-6">
            <h2 className="mb-2 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
              Professional Summary
            </h2>
            <p className="leading-relaxed text-gray-600">{cv.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
              Work Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4" style={{ borderLeft: "2px solid #e8d5c0" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-xs font-medium" style={{ color: "#c9956a" }}>{exp.company}</p>
                    </div>
                    <span className="ml-3 flex-shrink-0 text-xs" style={{ color: "#a07a5a" }}>{exp.startDate} — {exp.endDate}</span>
                  </div>
                  {exp.description && <p className="mt-1 text-sm text-gray-600">{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full" style={{ background: "#c9956a" }} />{a}
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
              <section className="mb-6">
                <h2 className="mb-3 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
                  Education
                </h2>
                {education.map((edu) => (
                  <div key={edu.id} className="mb-3">
                    <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                    <p className="text-xs" style={{ color: "#c9956a" }}>{edu.institution}</p>
                    <p className="text-xs" style={{ color: "#a07a5a" }}>{edu.startDate} — {edu.endDate}</p>
                  </div>
                ))}
              </section>
            )}

            {languages.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-2 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
                  Languages
                </h2>
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{l.name}</span><span style={{ color: "#a07a5a" }}>{l.proficiency}</span>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div>
            {skills.length > 0 && (
              <section className="mb-6">
                <h2 className="mb-2 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, i) => (
                    <span key={i} className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: "#f5ece2", color: "#7c5c3e", border: "1px solid #e8d5c0" }}>{s}</span>
                  ))}
                </div>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h2 className="mb-2 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
                  Certifications
                </h2>
                {certifications.map((c) => (
                  <div key={c.id} className="mb-2 text-sm">
                    <p className="font-medium text-gray-800">{c.name}</p>
                    <p style={{ color: "#a07a5a" }}>{c.issuer} · {c.date}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <section>
            <h2 className="mb-3 pb-1 text-[10px] font-bold uppercase tracking-widest border-b" style={{ color: "#7c5c3e", borderColor: "#e8d5c0" }}>
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((p) => (
                <div key={p.id} className="rounded-lg p-3" style={{ background: "#faf5ef", border: "1px solid #e8d5c0" }}>
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  {p.description && <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{p.description}</p>}
                  {p.technologies?.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {p.technologies.slice(0, 3).map((t, i) => (
                        <span key={i} className="rounded px-1.5 py-0.5 text-xs" style={{ background: "#ede3d5", color: "#7c5c3e" }}>{t}</span>
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
