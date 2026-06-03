import type { CV } from "@/types";
import { MailIcon, PhoneIcon, LocationIcon, WebIcon, LinkedinIcon, GithubIcon } from "./ContactIcons";

interface Props { cv: Partial<CV>; watermark?: boolean; }

export function PhotoTemplate({ cv, watermark = false }: Props) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  const initials = cv.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className={`relative bg-white font-sans text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto", display: "flex" }}>

      {/* Dark sidebar with photo */}
      <div className="shrink-0 text-white" style={{ width: "220px", padding: "40px 20px", background: "#1e1b4b" }}>
        {/* Profile photo / initials circle */}
        <div className="mb-5 flex justify-center">
          {cv.photoUrl ? (
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", overflow: "hidden", border: "3px solid #4f46e5", flexShrink: 0 }}>
              <img
                src={cv.photoUrl}
                alt={cv.name ?? "Profile"}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center text-2xl font-bold"
              style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#4f46e5", color: "white", border: "3px solid #6366f1", flexShrink: 0 }}>
              {initials}
            </div>
          )}
        </div>

        <div className="text-center mb-6">
          <h1 className="text-lg font-bold leading-tight text-white">{cv.name}</h1>
          <p className="mt-1 text-xs" style={{ color: "#a5b4fc" }}>{cv.jobTitle}</p>
        </div>

        {/* Contact */}
        <div className="mb-5">
          <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>Contact</h2>
          <div className="space-y-1.5 text-xs" style={{ color: "#c7d2fe" }}>
            {cv.email    && <p className="flex items-center gap-1.5 break-all"><MailIcon />     {cv.email}</p>}
            {cv.phone    && <p className="flex items-center gap-1.5"><PhoneIcon />    {cv.phone}</p>}
            {cv.location && <p className="flex items-center gap-1.5"><LocationIcon /> {cv.location}</p>}
            {cv.website  && <p className="flex items-center gap-1.5 break-all"><WebIcon />      {cv.website}</p>}
            {cv.linkedin && <p className="flex items-center gap-1.5 break-all"><LinkedinIcon /> {cv.linkedin}</p>}
            {cv.github   && <p className="flex items-center gap-1.5 break-all"><GithubIcon />   {cv.github}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>Skills</h2>
            <div className="space-y-2">
              {skills.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-0.5" style={{ color: "#e0e7ff" }}>
                    <span>{s}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ background: "#312e81" }}>
                    <div className="h-full rounded-full" style={{ width: `${90 - (i % 4) * 10}%`, background: "#6366f1" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {languages.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>Languages</h2>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between text-xs mb-1" style={{ color: "#c7d2fe" }}>
                <span>{l.name}</span><span style={{ color: "#818cf8" }}>{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h2 className="mb-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#818cf8" }}>Certifications</h2>
            {certifications.map((c) => (
              <div key={c.id} className="mb-2 text-xs">
                <p className="font-medium text-white">{c.name}</p>
                <p style={{ color: "#818cf8" }}>{c.issuer} · {c.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "40px 32px" }}>
        {cv.summary && (
          <section className="mb-5">
            <h2 className="mb-2 pb-1 border-b-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4338ca", borderColor: "#4338ca" }}>
              Profile
            </h2>
            <p className="leading-relaxed text-gray-600">{cv.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-5">
            <h2 className="mb-3 pb-1 border-b-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4338ca", borderColor: "#4338ca" }}>
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4" style={{ borderLeft: "2px solid #e0e7ff" }}>
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full" style={{ background: "#4338ca" }} />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-xs font-medium" style={{ color: "#4338ca" }}>{exp.company}</p>
                    </div>
                    <span className="ml-3 shrink-0 rounded-full px-2 py-0.5 text-xs" style={{ background: "#e0e7ff", color: "#3730a3" }}>
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="mt-1 text-sm text-gray-600">{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.achievements.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: "#6366f1" }} />{a}
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
            <h2 className="mb-3 pb-1 border-b-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4338ca", borderColor: "#4338ca" }}>
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</h3>
                  <p className="text-xs" style={{ color: "#4338ca" }}>{edu.institution}</p>
                </div>
                <span className="ml-3 shrink-0 text-xs text-gray-400">{edu.startDate} — {edu.endDate}</span>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 className="mb-3 pb-1 border-b-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: "#4338ca", borderColor: "#4338ca" }}>
              Projects
            </h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-3">
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                {p.description && <p className="text-sm text-gray-600">{p.description}</p>}
                {p.technologies?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.technologies.map((t, i) => (
                      <span key={i} className="rounded px-1.5 py-0.5 text-xs" style={{ background: "#e0e7ff", color: "#3730a3" }}>{t}</span>
                    ))}
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
