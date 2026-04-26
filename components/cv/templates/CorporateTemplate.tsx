/**
 * Corporate CV Template — 1 colonne, ATS-friendly
 * Idéal pour business, finance, RH, administratif
 */
import type { CV } from "@/types";

interface CorporateTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function CorporateTemplate({ cv, watermark = false }: CorporateTemplateProps) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div
      className={`relative bg-white font-sans text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{
        minHeight: "1056px",
        maxWidth: "816px",
        margin: "0 auto",
        padding: "48px 56px",
        border: "1px solid #e5e5e5"
      }}
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{cv.name}</h1>
        <p className="text-lg text-blue-700 mt-1">{cv.jobTitle}</p>

        {/* Contact row */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-600">
          {cv.email && <span>{cv.email}</span>}
          {cv.phone && <span>{cv.phone}</span>}
          {cv.location && <span>{cv.location}</span>}
          {cv.linkedin && <span className="break-all">{cv.linkedin}</span>}
          {cv.website && <span className="break-all">{cv.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {cv.summary && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-2">
            Profil
          </h2>
          <p className="text-gray-700 leading-relaxed">{cv.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-3">
            Expérience Professionnelle
          </h2>

          <div className="space-y-5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                    <p className="text-blue-700 font-medium text-xs">{exp.company}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-3 mt-0.5">
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>

                {exp.description && (
                  <p className="mt-1.5 text-sm text-gray-700">{exp.description}</p>
                )}

                {exp.achievements?.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5">
                    {exp.achievements.map((ach, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" />
                        {ach}
                      </li>
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
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-3">
            Formation
          </h2>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {edu.degree}{edu.field ? ` en ${edu.field}` : ""}
                  </h3>
                  <p className="text-sm text-blue-700">{edu.institution}</p>
                  {edu.grade && <p className="text-xs text-gray-500">{edu.grade}</p>}
                </div>
                <span className="text-xs text-gray-500 ml-3">
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-3">
            Compétences
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-md bg-blue-50 text-blue-700 border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-3">
            Langues
          </h2>
          <div className="space-y-1 text-sm">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center justify-between">
                <span className="text-gray-800">{lang.name}</span>
                <span className="text-blue-700">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-3">
            Projets
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                <p className="mt-0.5 text-xs text-gray-600 leading-relaxed">
                  {proj.description}
                </p>
                {proj.technologies?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {proj.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="rounded-md bg-blue-50 px-1.5 py-0.5 text-xs text-blue-700">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 border-b border-blue-700 pb-1 mb-3">
            Certifications
          </h2>
          <div className="space-y-2 text-sm">
            {certifications.map((cert) => (
              <div key={cert.id}>
                <p className="font-semibold text-gray-900">{cert.name}</p>
                <p className="text-blue-700 text-xs">{cert.issuer} · {cert.date}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
