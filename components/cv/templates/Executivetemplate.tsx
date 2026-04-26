/**
 * Executive CV template — luxury noir & gold layout with photo
 * Designed for senior/executive roles
 */
import type { CV } from "@/types";

interface ExecutiveTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function ExecutiveTemplate({ cv, watermark = false }: ExecutiveTemplateProps) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  const initials = cv.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "CV";

  return (
    <div
      className={`relative bg-white font-sans text-sm leading-relaxed ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto" }}
    >
      {/* Top header bar — noir with gold accent */}
      <header
        style={{
          background: "#111111",
          padding: "40px 48px 36px",
          display: "flex",
          alignItems: "center",
          gap: "32px",
        }}
      >
        {/* Photo or initials */}
        <div style={{ flexShrink: 0 }}>
          {cv.photoUrl ? (
            <img
              src={cv.photoUrl}
              alt={cv.name ?? "Profile"}
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #C9A84C",
              }}
            />
          ) : (
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "50%",
                background: "#1e1e1e",
                border: "3px solid #C9A84C",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: "2px",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Name & title */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "1px",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            {cv.name}
          </h1>
          <p
            style={{
              color: "#C9A84C",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "6px 0 0",
            }}
          >
            {cv.jobTitle}
          </p>

          {/* Gold divider */}
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "#C9A84C",
              margin: "12px 0",
            }}
          />

          {/* Contact info */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {[cv.email, cv.phone, cv.location, cv.linkedin, cv.github, cv.website, cv.portfolio]
              .filter(Boolean)
              .map((info, i) => (
                <span key={i} style={{ color: "#9e9e9e", fontSize: "11px" }}>
                  {info}
                </span>
              ))}
          </div>
        </div>
      </header>

      {/* Body — two column */}
      <div style={{ display: "flex", minHeight: "860px" }}>
        {/* Left sidebar */}
        <div
          style={{
            width: "220px",
            flexShrink: 0,
            background: "#f7f5f0",
            padding: "32px 24px",
            borderRight: "1px solid #e8e2d6",
          }}
        >
          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <SidebarHeading>Compétences</SidebarHeading>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                {skills.map((skill, i) => (
                  <div key={i}>
                    <span style={{ fontSize: "11px", color: "#333", display: "block", marginBottom: "4px" }}>
                      {skill}
                    </span>
                    <div style={{ height: "2px", background: "#e0d9cc", borderRadius: "1px" }}>
                      <div
                        style={{
                          height: "100%",
                          borderRadius: "1px",
                          background: "#C9A84C",
                          width: `${90 - (i % 4) * 12}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <SidebarHeading>Langues</SidebarHeading>
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {languages.map((lang) => (
                  <div key={lang.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
                    <span style={{ color: "#333", fontWeight: 500 }}>{lang.name}</span>
                    <span style={{ color: "#888" }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <SidebarHeading>Certifications</SidebarHeading>
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "#222", margin: 0 }}>{cert.name}</p>
                    <p style={{ fontSize: "10px", color: "#888", margin: "2px 0 0" }}>
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main content */}
        <div style={{ flex: 1, padding: "32px 40px" }}>
          {/* Summary */}
          {cv.summary && (
            <Section title="Profil Professionnel">
              <p style={{ color: "#555", lineHeight: 1.7, fontSize: "12px" }}>{cv.summary}</p>
            </Section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <Section title="Expérience Professionnelle">
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#111", margin: 0 }}>
                          {exp.role}
                        </h3>
                        <p style={{ fontSize: "11px", color: "#C9A84C", fontWeight: 600, margin: "2px 0 0", letterSpacing: "0.5px" }}>
                          {exp.company}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#888",
                          background: "#f7f5f0",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          flexShrink: 0,
                          marginLeft: "12px",
                          border: "1px solid #e8e2d6",
                        }}
                      >
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: "11px", color: "#555", margin: "6px 0 0", lineHeight: 1.6 }}>
                        {exp.description}
                      </p>
                    )}
                    {exp.achievements?.length > 0 && (
                      <ul style={{ margin: "6px 0 0", paddingLeft: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "3px" }}>
                        {exp.achievements.map((ach, i) => (
                          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "11px", color: "#555" }}>
                            <span style={{ color: "#C9A84C", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>›</span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <Section title="Formation">
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {education.map((edu) => (
                  <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#111", margin: 0 }}>
                        {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                      </h3>
                      <p style={{ fontSize: "11px", color: "#C9A84C", margin: "2px 0 0" }}>{edu.institution}</p>
                      {edu.grade && <p style={{ fontSize: "10px", color: "#888", margin: "2px 0 0" }}>{edu.grade}</p>}
                    </div>
                    <span style={{ fontSize: "10px", color: "#888", flexShrink: 0, marginLeft: "12px" }}>
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <Section title="Projets">
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    style={{
                      borderLeft: "2px solid #C9A84C",
                      paddingLeft: "12px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#111", margin: 0 }}>{proj.name}</h3>
                      {proj.url && <span style={{ fontSize: "10px", color: "#888" }}>{proj.url}</span>}
                    </div>
                    <p style={{ fontSize: "11px", color: "#555", margin: "4px 0 0", lineHeight: 1.5 }}>{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
                        {proj.technologies.map((tech, i) => (
                          <span
                            key={i}
                            style={{
                              fontSize: "10px",
                              background: "#f7f5f0",
                              border: "1px solid #e8e2d6",
                              color: "#555",
                              padding: "1px 6px",
                              borderRadius: "3px",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>

      {/* Footer gold line */}
      <div style={{ height: "4px", background: "linear-gradient(90deg, #111111 0%, #C9A84C 50%, #111111 100%)" }} />
    </div>
  );
}

function SidebarHeading({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h2
        style={{
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "2.5px",
          textTransform: "uppercase",
          color: "#C9A84C",
          margin: 0,
        }}
      >
        {children}
      </h2>
      <div style={{ height: "1px", background: "#e0d9cc", marginTop: "6px" }} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
        <h2
          style={{
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            color: "#111",
            margin: 0,
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </h2>
        <div style={{ flex: 1, height: "1px", background: "#e0d9cc" }} />
        <div style={{ width: "6px", height: "6px", background: "#C9A84C", transform: "rotate(45deg)", flexShrink: 0 }} />
      </div>
      {children}
    </section>
  );
}