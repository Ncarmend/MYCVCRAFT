import type { CV } from "@/types";
import { MailIcon, PhoneIcon, LocationIcon, WebIcon, LinkedinIcon, GithubIcon } from "./ContactIcons";

interface Props { cv: Partial<CV>; watermark?: boolean; }

export function SlateTemplate({ cv, watermark = false }: Props) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div className={`relative bg-white font-sans text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto", display: "flex" }}>

      {/* Slate sidebar */}
      <div className="flex-shrink-0 bg-slate-700 text-white" style={{ width: "230px", padding: "40px 24px" }}>
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-slate-500 text-xl font-bold text-white">
          {cv.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <h1 className="text-lg font-bold leading-tight text-white">{cv.name}</h1>
        <p className="mt-1 text-xs text-slate-300">{cv.jobTitle}</p>

        <div className="mt-6 mb-5">
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Contact</h2>
          <div className="space-y-1 text-xs text-slate-200">
            {cv.email    && <p className="flex items-center gap-1.5"><MailIcon />     {cv.email}</p>}
            {cv.phone    && <p className="flex items-center gap-1.5"><PhoneIcon />    {cv.phone}</p>}
            {cv.location && <p className="flex items-center gap-1.5"><LocationIcon /> {cv.location}</p>}
            {cv.website  && <p className="flex items-center gap-1.5 break-all"><WebIcon />      {cv.website}</p>}
            {cv.linkedin && <p className="flex items-center gap-1.5 break-all"><LinkedinIcon /> {cv.linkedin}</p>}
            {cv.github   && <p className="flex items-center gap-1.5 break-all"><GithubIcon />   {cv.github}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Skills</h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="rounded bg-slate-600 px-2 py-0.5 text-xs text-slate-100">{s}</span>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Languages</h2>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between text-xs text-slate-200">
                <span>{l.name}</span><span className="text-slate-400">{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">Certifications</h2>
            {certifications.map((c) => (
              <div key={c.id} className="mb-2 text-xs">
                <p className="font-medium text-white">{c.name}</p>
                <p className="text-slate-400">{c.issuer} · {c.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "40px 32px" }}>
        {cv.summary && (
          <section className="mb-5">
            <h2 className="mb-2 border-b-2 border-slate-700 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Summary</h2>
            <p className="text-gray-600 leading-relaxed">{cv.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-3 border-b-2 border-slate-700 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-xs font-medium text-slate-500">{exp.company}</p>
                    </div>
                    <span className="ml-3 flex-shrink-0 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="mt-1 text-sm text-gray-600">{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1 space-y-0.5">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-3 border-b-2 border-slate-700 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                  <p className="text-xs text-slate-500">{edu.institution}</p>
                </div>
                <span className="ml-3 flex-shrink-0 text-xs text-slate-400">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="mb-3 border-b-2 border-slate-700 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
                {p.technologies?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.technologies.map((t, i) => <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">{t}</span>)}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
