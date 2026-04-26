/**
 * Minimal CV template — ultra-clean layout with square photo
 * Designed for any role, focus on readability and elegance
 */
import type { CV } from "@/types";

interface MinimalTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function MinimalTemplate({ cv, watermark = false }: MinimalTemplateProps) {
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
      className={`relative bg-white font-sans ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto", padding: "56px 64px" }}
    >
      {/* Header */}
      <header style={{ display: "flex", alignItems: "flex-start", gap: "32px", marginBottom: "40px", paddingBottom: "32px", borderBottom: "1px solid #e5e5e5" }}>
        {/* Photo */}
        <div style={{ flexShrink: 0 }}>
          {cv.photoUrl ? (
            <img
              src={cv.photoUrl}
              alt={cv.name ?? "Profile"}
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "8px",
                objectFit: "cover",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                width: "88px",
                height: "88px",
                borderRadius: "8px",
                background: "#f5f5f5",
                border: "1px solid #e5e5e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                fontWeight: 300,
                color: "#999",
                letterSpacing: "2px",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Name block */}
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: "32px",
            fontWeight: 300,
            color: "#111",
            margin: 0,
            letterSpacing: "-1px",
            lineHeight: 1.1,
          }}>
            {cv.name}
          </h1>
          <p style={{
            fontSize: "13px",
            fontWeight: 400,
            color: "#666",
            margin: "6px 0 16px",
            letterSpacing: "0.5px",
          }}>
            {cv.jobTitle}
          </p>

          {/* Contact — horizontal row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {[cv.email, cv.phone, cv.location, cv.linkedin, cv.github, cv.website, cv.portfolio]
              .filter(Boolean)
              .map((info, i) => (
                <span key={i} style={{
                  fontSize: "11px",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}>
                  {i > 0 && <span style={{ color: "#ddd", marginRight: "-10px" }}>·</span>}
                  {info}
                </span>
              ))}
          </div>
        </div>
      </header>

      {/* Body — two column */}
      <div style={{ display: "flex", gap: "48px" }}>
        {/* Left — narrow */}
        <div style={{ width: "180px", flexShrink: 0 }}>

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <MinimalHeading>Skills</MinimalHeading>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
                {skills.map((skill, i) => (
                  <span key={i} style={{
                    fontSize: "11px",
                    color: "#444",
                    padding: "3px 0",
                    borderBottom: "1px solid #f0f0f0",
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <MinimalHeading>Languages</MinimalHeading>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "7px" }}>
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                      <span style={{ color: "#333" }}>{lang.name}</span>
                      <span style={{ color: "#aaa", fontSize: "10px" }}>{lang.proficiency}</span>
                    </div>
                    <div style={{ height: "1px", background: "#eee" }}>
                      <div style={{
                        height: "1px",
                        background: "#333",
                        width: lang.proficiency === "Native" ? "100%" :
                               lang.proficiency === "Fluent" ? "80%" :
                               lang.proficiency === "Intermediate" ? "55%" : "30%",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <MinimalHeading>Certifications</MinimalHeading>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <p style={{ fontSize: "11px", fontWeight: 500, color: "#222", margin: 0 }}>{cert.name}</p>
                    <p style={{ fontSize: "10px", color: "#aaa", margin: "2px 0 0" }}>{cert.issuer}</p>
                    <p style={{ fontSize: "10px", color: "#bbb", margin: "1px 0 0" }}>{cert.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right — main */}
        <div style={{ flex: 1 }}>

          {/* Summary */}
          {cv.summary && (
            <div style={{ marginBottom: "28px" }}>
              <MinimalHeading>Profile</MinimalHeading>
              <p style={{
                fontSize: "12px",
                color: "#555",
                lineHeight: 1.8,
                marginTop: "10px",
                fontWeight: 300,
              }}>
                {cv.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <MinimalHeading>Experience</MinimalHeading>
              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "20px" }}>
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#111", margin: 0 }}>
                        {exp.role}
                      </h3>
                      <span style={{ fontSize: "10px", color: "#aaa", flexShrink: 0, marginLeft: "12px" }}>
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0", fontStyle: "italic" }}>
                      {exp.company}
                    </p>
                    {exp.description && (
                      <p style={{ fontSize: "11px", color: "#555", margin: "6px 0 0", lineHeight: 1.7, fontWeight: 300 }}>
                        {exp.description}
                      </p>
                    )}
                    {exp.achievements?.length > 0 && (
                      <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "3px" }}>
                        {exp.achievements.map((ach, i) => (
                          <li key={i} style={{ display: "flex", gap: "8px", fontSize: "11px", color: "#555", fontWeight: 300 }}>
                            <span style={{ color: "#bbb", flexShrink: 0 }}>—</span>
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: "28px" }}>
              <MinimalHeading>Education</MinimalHeading>
              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "13px", fontWeight: 500, color: "#111", margin: 0 }}>
                        {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                      </h3>
                      <span style={{ fontSize: "10px", color: "#aaa", flexShrink: 0, marginLeft: "12px" }}>
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                    <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0", fontStyle: "italic" }}>
                      {edu.institution}
                    </p>
                    {edu.grade && (
                      <p style={{ fontSize: "10px", color: "#aaa", margin: "2px 0 0" }}>{edu.grade}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <MinimalHeading>Projects</MinimalHeading>
              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {projects.map((proj) => (
                  <div key={proj.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "12px", fontWeight: 500, color: "#111", margin: 0 }}>{proj.name}</h3>
                      {proj.url && <span style={{ fontSize: "10px", color: "#aaa" }}>{proj.url}</span>}
                    </div>
                    <p style={{ fontSize: "11px", color: "#555", margin: "4px 0", lineHeight: 1.6, fontWeight: 300 }}>
                      {proj.description}
                    </p>
                    {proj.technologies?.length > 0 && (
                      <p style={{ fontSize: "10px", color: "#aaa", margin: 0 }}>
                        {proj.technologies.join(" · ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer line */}
      <div style={{ marginTop: "48px", height: "1px", background: "#e5e5e5" }} />
    </div>
  );
}

function MinimalHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontSize: "8px",
      fontWeight: 600,
      letterSpacing: "3px",
      textTransform: "uppercase",
      color: "#999",
      margin: 0,
      paddingBottom: "6px",
      borderBottom: "1px solid #e5e5e5",
    }}>
      {children}
    </h2>
  );
}
