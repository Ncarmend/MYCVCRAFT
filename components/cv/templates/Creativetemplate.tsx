/**
 * Creative CV template — bold colorful layout with photo
 * Designed for creative, marketing, design roles
 */
import type { CV } from "@/types";

interface CreativeTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function CreativeTemplate({ cv, watermark = false }: CreativeTemplateProps) {
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

  const accent = "#6C47FF";
  const accentLight = "#EEE9FF";
  const accentMid = "#9B7BFF";

  return (
    <div
      className={`relative bg-white font-sans text-sm leading-relaxed ${watermark ? "cv-watermark" : ""}`}
      style={{ minHeight: "1056px", maxWidth: "816px", margin: "0 auto" }}
    >
      {/* Top colorful banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, #B44FD4 100%)`,
          padding: "0 0 0 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "180px", height: "180px", borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "180px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }} />

        <div style={{ display: "flex", alignItems: "flex-end", padding: "36px 48px 0", position: "relative", zIndex: 1 }}>
          {/* Photo */}
          <div style={{ flexShrink: 0, marginRight: "28px" }}>
            {cv.photoUrl ? (
              <img
                src={cv.photoUrl}
                alt={cv.name ?? "Profile"}
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: "4px solid rgba(255,255,255,0.3)",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.15)",
                  border: "4px solid rgba(255,255,255,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "2px",
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Name & contact */}
          <div style={{ flex: 1, paddingBottom: "24px" }}>
            <h1 style={{ color: "white", fontSize: "30px", fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: "-0.5px" }}>
              {cv.name}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500, margin: "6px 0 14px", letterSpacing: "1px" }}>
              {cv.jobTitle}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              {[cv.email, cv.phone, cv.location, cv.linkedin, cv.github, cv.website]
                .filter(Boolean)
                .map((info, i) => (
                  <span key={i} style={{
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.75)",
                    background: "rgba(255,255,255,0.12)",
                    padding: "3px 10px",
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                    {info}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <svg viewBox="0 0 816 40" style={{ display: "block", marginTop: "-1px" }} preserveAspectRatio="none" height="40" width="100%">
          <path d="M0,40 L0,20 Q204,0 408,20 Q612,40 816,20 L816,40 Z" fill="white" />
        </svg>
      </div>

      {/* Body */}
      <div style={{ display: "flex", padding: "8px 0 0" }}>
        {/* Left column */}
        <div style={{ width: "230px", flexShrink: 0, padding: "16px 24px 32px" }}>

          {/* Summary */}
          {cv.summary && (
            <div style={{ marginBottom: "24px" }}>
              <CreativeSectionTitle accent={accent}>À propos</CreativeSectionTitle>
              <p style={{ fontSize: "11px", color: "#555", lineHeight: 1.7, marginTop: "10px" }}>{cv.summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <CreativeSectionTitle accent={accent}>Compétences</CreativeSectionTitle>
              <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: "10px",
                      fontWeight: 500,
                      padding: "3px 9px",
                      borderRadius: "20px",
                      background: i % 3 === 0 ? accentLight : i % 3 === 1 ? "#FFF0FA" : "#F0FFF4",
                      color: i % 3 === 0 ? accent : i % 3 === 1 ? "#B44FD4" : "#1a7a4a",
                      border: `1px solid ${i % 3 === 0 ? "#D4C5FF" : i % 3 === 1 ? "#EDB8F5" : "#A8EFC8"}`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <CreativeSectionTitle accent={accent}>Langues</CreativeSectionTitle>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {languages.map((lang) => (
                  <div key={lang.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "3px" }}>
                      <span style={{ fontWeight: 600, color: "#333" }}>{lang.name}</span>
                      <span style={{ color: "#888" }}>{lang.proficiency}</span>
                    </div>
                    <div style={{ height: "3px", borderRadius: "2px", background: accentLight }}>
                      <div style={{
                        height: "100%", borderRadius: "2px",
                        background: `linear-gradient(90deg, ${accent}, ${accentMid})`,
                        width: lang.proficiency === "Native" ? "100%" :
                               lang.proficiency === "Fluent" ? "85%" :
                               lang.proficiency === "Intermediate" ? "60%" : "35%",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <CreativeSectionTitle accent={accent}>Certifications</CreativeSectionTitle>
              <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {certifications.map((cert) => (
                  <div key={cert.id} style={{
                    padding: "8px 10px",
                    borderRadius: "8px",
                    background: accentLight,
                    borderLeft: `3px solid ${accent}`,
                  }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#222", margin: 0 }}>{cert.name}</p>
                    <p style={{ fontSize: "10px", color: "#666", margin: "2px 0 0" }}>
                      {cert.issuer} · {cert.date}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", background: "#f0ecfc", flexShrink: 0, margin: "0 0 32px" }} />

        {/* Right column */}
        <div style={{ flex: 1, padding: "16px 36px 32px 28px" }}>

          {/* Experience */}
          {experience.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <CreativeSectionTitle accent={accent}>Expérience</CreativeSectionTitle>
              <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "18px" }}>
                {experience.map((exp, idx) => (
                  <div key={exp.id} style={{ position: "relative", paddingLeft: "18px" }}>
                    {/* Timeline dot */}
                    <div style={{
                      position: "absolute", left: 0, top: "4px",
                      width: "10px", height: "10px", borderRadius: "50%",
                      background: idx === 0 ? accent : accentLight,
                      border: `2px solid ${accent}`,
                    }} />
                    {idx < experience.length - 1 && (
                      <div style={{
                        position: "absolute", left: "4px", top: "16px",
                        width: "2px", bottom: "-18px",
                        background: accentLight,
                      }} />
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#111", margin: 0 }}>{exp.role}</h3>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: accent, margin: "2px 0 0" }}>{exp.company}</p>
                      </div>
                      <span style={{
                        fontSize: "10px", color: accent,
                        background: accentLight,
                        padding: "2px 8px", borderRadius: "20px",
                        flexShrink: 0, marginLeft: "10px",
                        border: `1px solid #D4C5FF`,
                        fontWeight: 500,
                      }}>
                        {exp.startDate} — {exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p style={{ fontSize: "11px", color: "#555", margin: "5px 0 0", lineHeight: 1.6 }}>{exp.description}</p>
                    )}
                    {exp.achievements?.length > 0 && (
                      <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "3px" }}>
                        {exp.achievements.map((ach, i) => (
                          <li key={i} style={{ display: "flex", gap: "7px", fontSize: "11px", color: "#555" }}>
                            <span style={{ color: accentMid, fontWeight: 700, flexShrink: 0 }}>✦</span>
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
            <div style={{ marginBottom: "24px" }}>
              <CreativeSectionTitle accent={accent}>Formation</CreativeSectionTitle>
              <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {education.map((edu) => (
                  <div key={edu.id} style={{
                    padding: "10px 14px",
                    borderRadius: "10px",
                    border: `1px solid #ece8ff`,
                    background: "#FDFCFF",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#111", margin: 0 }}>
                          {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                        </h3>
                        <p style={{ fontSize: "11px", color: accent, margin: "2px 0 0", fontWeight: 500 }}>{edu.institution}</p>
                        {edu.grade && <p style={{ fontSize: "10px", color: "#888", margin: "2px 0 0" }}>{edu.grade}</p>}
                      </div>
                      <span style={{ fontSize: "10px", color: "#888", flexShrink: 0, marginLeft: "10px" }}>
                        {edu.startDate} — {edu.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <CreativeSectionTitle accent={accent}>Projets</CreativeSectionTitle>
              <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {projects.map((proj) => (
                  <div key={proj.id} style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid #ece8ff",
                    background: "#FDFCFF",
                  }}>
                    <h3 style={{ fontSize: "11px", fontWeight: 700, color: "#111", margin: 0 }}>{proj.name}</h3>
                    <p style={{ fontSize: "10px", color: "#666", margin: "4px 0", lineHeight: 1.5 }}>{proj.description}</p>
                    {proj.technologies?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "6px" }}>
                        {proj.technologies.slice(0, 3).map((tech, i) => (
                          <span key={i} style={{
                            fontSize: "9px", fontWeight: 500,
                            background: accentLight, color: accent,
                            padding: "1px 6px", borderRadius: "10px",
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom colorful bar */}
      <div style={{
        height: "6px",
        background: `linear-gradient(90deg, ${accent} 0%, #B44FD4 50%, #FF6B9D 100%)`,
        marginTop: "auto",
      }} />
    </div>
  );
}

function CreativeSectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div style={{ width: "4px", height: "16px", borderRadius: "2px", background: accent, flexShrink: 0 }} />
      <h2 style={{
        fontSize: "9px",
        fontWeight: 800,
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#111",
        margin: 0,
      }}>
        {children}
      </h2>
      <div style={{ flex: 1, height: "1px", background: "#f0ecfc" }} />
    </div>
  );
}
