/**
 * Modern CV template — two-column layout with indigo sidebar
 * Designed for design/tech roles
 */
import type { CV } from "@/types";

interface ModernTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function ModernTemplate({ cv, watermark = false }: ModernTemplateProps) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div
      className={`relative bg-white font-sans text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto", display: "flex" }}
    >
      {/* Left sidebar */}
      <div
        className="bg-indigo-700 text-white flex-shrink-0"
        style={{ width: "240px", padding: "40px 28px" }}
      >
        {/* Name block */}
        <div className="mb-8">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-2xl font-bold">
            {cv.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <h1 className="text-xl font-bold leading-tight">{cv.name}</h1>
          <p className="mt-1 text-sm text-indigo-200">{cv.jobTitle}</p>
        </div>

        {/* Contact */}
        <div className="mb-6">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
            Contact
          </h2>
          <div className="space-y-1.5 text-xs text-indigo-100">
            {cv.email && <p>{cv.email}</p>}
            {cv.phone && <p>{cv.phone}</p>}
            {cv.location && <p>{cv.location}</p>}
            {cv.website && <p className="break-all">{cv.website}</p>}
            {cv.linkedin && <p className="break-all">{cv.linkedin}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-300">
              Skills
            </h2>
            <div className="space-y-2">
              {skills.map((skill, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs text-white mb-1">
                    <span>{skill}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-indigo-800">
                    <div
                      className="h-full rounded-full bg-indigo-300"
                      style={{ width: `${85 - (i % 3) * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
              Languages
            </h2>
            <div className="space-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between text-xs">
                  <span className="text-white">{lang.name}</span>
                  <span className="text-indigo-300">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-300">
              Certifications
            </h2>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="text-xs">
                  <p className="font-medium text-white">{cert.name}</p>
                  <p className="text-indigo-300">{cert.issuer} · {cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right main content */}
      <div style={{ flex: 1, padding: "40px 36px" }}>
        {/* Summary */}
        {cv.summary && (
          <section className="mb-6">
            <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1">
              About Me
            </h2>
            <p className="text-gray-600 leading-relaxed">{cv.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1">
              Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-indigo-100">
                  <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-indigo-600" />
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                      <p className="text-indigo-600 font-medium text-xs">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-3 mt-0.5 bg-gray-50 px-2 py-0.5 rounded-full">
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="mt-1.5 text-sm text-gray-600">{exp.description}</p>
                  )}
                  {exp.achievements?.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.achievements.map((ach, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-400" />
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
          <section className="mb-6">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                    </h3>
                    <p className="text-sm text-indigo-600">{edu.institution}</p>
                    {edu.grade && <p className="text-xs text-gray-400">{edu.grade}</p>}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-3 bg-gray-50 px-2 py-0.5 rounded-full">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-600 pb-1">
              Projects
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{proj.name}</h3>
                  <p className="mt-0.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {proj.description}
                  </p>
                  {proj.technologies?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs text-indigo-600">
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
      </div>
    </div>
  );
}
