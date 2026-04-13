/**
 * Basic CV template — clean, traditional layout
 * Optimized for ATS parsing
 */
import type { CV } from "@/types";

interface BasicTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function BasicTemplate({ cv, watermark = false }: BasicTemplateProps) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div
      className={`relative bg-white font-sans text-sm leading-relaxed text-gray-800 ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", padding: "48px 56px", maxWidth: "816px", margin: "0 auto" }}
    >
      {/* Header */}
      <header className="border-b-2 border-gray-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{cv.name}</h1>
        <p className="mt-1 text-base font-medium text-gray-600">{cv.jobTitle}</p>
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {cv.location && <span>{cv.location}</span>}
          {cv.website && <span>{cv.website}</span>}
          {cv.linkedin && <span>{cv.linkedin}</span>}
          {cv.github && <span>{cv.github}</span>}
          {cv.portfolio && <span>{cv.portfolio}</span>}
        </div>
      </header>

      {/* Summary */}
      {cv.summary && (
        <section className="mb-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">{cv.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Work Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                  </div>
                  <span className="flex-shrink-0 text-xs text-gray-400 ml-4">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                {exp.description && (
                  <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
                )}
                {exp.achievements?.length > 0 && (
                  <ul className="mt-1.5 list-disc pl-4 space-y-0.5">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="text-sm text-gray-600">{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Education
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </h3>
                  <p className="text-sm text-gray-600">{edu.institution}</p>
                  {edu.grade && <p className="text-xs text-gray-400">{edu.grade}</p>}
                </div>
                <span className="flex-shrink-0 text-xs text-gray-400 ml-4">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="rounded border border-gray-200 px-2.5 py-0.5 text-xs text-gray-700"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                  {proj.url && (
                    <span className="text-xs text-gray-400">{proj.url}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{proj.description}</p>
                {proj.technologies?.length > 0 && (
                  <p className="mt-0.5 text-xs text-gray-400">
                    {proj.technologies.join(" · ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Languages
          </h2>
          <div className="flex flex-wrap gap-3">
            {languages.map((lang) => (
              <span key={lang.id} className="text-sm text-gray-700">
                <span className="font-medium">{lang.name}</span>
                <span className="text-gray-400"> — {lang.proficiency}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
            Certifications
          </h2>
          <div className="space-y-1.5">
            {certifications.map((cert) => (
              <div key={cert.id} className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">{cert.name}</span>
                  <span className="ml-2 text-gray-500">· {cert.issuer}</span>
                </div>
                <span className="text-xs text-gray-400">{cert.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
