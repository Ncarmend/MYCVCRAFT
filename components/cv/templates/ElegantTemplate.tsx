import type { CV } from "@/types";

interface ElegantTemplateProps {
  cv: Partial<CV>;
  watermark?: boolean;
}

export function ElegantTemplate({ cv, watermark = false }: ElegantTemplateProps) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  return (
    <div
      className={`relative bg-white text-sm ${watermark ? "cv-watermark" : ""}`}
      style={{ width: "816px", minHeight: "1056px", display: "flex", flexDirection: "row" }}
    >
      {/* Left main content */}
      <div style={{ flex: 1, padding: "48px 36px 40px", minWidth: 0 }}>
        <div style={{ borderBottom: "1px solid #b8960c", paddingBottom: "16px", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "26pt", fontWeight: 700, color: "#1a1a1a", lineHeight: 1.15 }}>
            {cv.name}
          </h1>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "12pt", color: "#b8960c", marginTop: "6px", fontStyle: "italic" }}>
            {cv.jobTitle}
          </p>
        </div>

        {cv.summary && (
          <section style={{ marginBottom: "22px" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #e8d48b", paddingBottom: "4px", marginBottom: "10px" }}>
              Profil
            </h2>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "10pt", color: "#374151", lineHeight: 1.7 }}>{cv.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section style={{ marginBottom: "22px" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #e8d48b", paddingBottom: "4px", marginBottom: "12px" }}>
              Expérience
            </h2>
            <div>
              {experience.map((exp) => (
                <div key={exp.id} style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h3 style={{ fontFamily: "Georgia, serif", fontSize: "11pt", fontWeight: 700, color: "#1a1a1a" }}>{exp.role}</h3>
                      <p style={{ fontSize: "10pt", color: "#b8960c", fontWeight: 600, marginTop: "2px" }}>{exp.company}</p>
                    </div>
                    <span style={{ fontSize: "9pt", color: "#6b7280", whiteSpace: "nowrap", marginLeft: "12px" }}>
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "10pt", color: "#4b5563", marginTop: "6px", lineHeight: 1.6 }}>{exp.description}</p>
                  )}
                  {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                    <ul style={{ paddingLeft: "16px", marginTop: "6px" }}>
                      {exp.achievements.map((a, i) => (
                        <li key={i} style={{ fontSize: "10pt", color: "#4b5563", lineHeight: 1.6, marginBottom: "2px", listStyleType: "none", paddingLeft: "12px", position: "relative" }}>
                          <span style={{ position: "absolute", left: 0, top: "7px", width: "6px", height: "6px", borderRadius: "50%", background: "#b8960c", display: "inline-block" }} />
                          {a}
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
          <section style={{ marginBottom: "22px" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #e8d48b", paddingBottom: "4px", marginBottom: "12px" }}>
              Formation
            </h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <div>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "11pt", fontWeight: 700, color: "#1a1a1a" }}>
                    {edu.degree}{edu.field ? ` en ${edu.field}` : ""}
                  </h3>
                  <p style={{ fontSize: "10pt", color: "#b8960c" }}>{edu.institution}</p>
                  {edu.grade && <p style={{ fontSize: "9pt", color: "#6b7280" }}>{edu.grade}</p>}
                </div>
                <span style={{ fontSize: "9pt", color: "#6b7280", whiteSpace: "nowrap", marginLeft: "12px" }}>
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "8pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #e8d48b", paddingBottom: "4px", marginBottom: "12px" }}>
              Projets
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {projects.map((proj) => (
                <div key={proj.id} style={{ border: "1px solid #e8d48b", borderRadius: "6px", padding: "10px", background: "#fdfbf3" }}>
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "10pt", fontWeight: 700, color: "#1a1a1a" }}>{proj.name}</h3>
                  <p style={{ fontSize: "9pt", color: "#6b7280", lineHeight: 1.5, marginTop: "3px" }}>{proj.description}</p>
                  {Array.isArray(proj.technologies) && proj.technologies.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginTop: "6px" }}>
                      {proj.technologies.slice(0, 3).map((t, i) => (
                        <span key={i} style={{ background: "#fef9c3", border: "1px solid #e8d48b", borderRadius: "4px", padding: "1px 6px", fontSize: "8pt", color: "#92400e" }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Right sidebar — dark gold & black */}
      <div style={{ width: "220px", flexShrink: 0, background: "#1a1a1a", padding: "48px 22px 40px", color: "white" }}>
        {cv.photoUrl && (
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center" }}>
            <div style={{ width: "96px", height: "96px", borderRadius: "50%", overflow: "hidden", border: "3px solid #b8960c" }}>
              <img src={cv.photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "7.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "10px" }}>
            Contact
          </h2>
          <div style={{ fontSize: "9pt", color: "#d1d5db", lineHeight: 1.7 }}>
            {cv.email && <p style={{ wordBreak: "break-all" }}>{cv.email}</p>}
            {cv.phone && <p>{cv.phone}</p>}
            {cv.location && <p>{cv.location}</p>}
            {cv.website && <p style={{ wordBreak: "break-all" }}>{cv.website}</p>}
            {cv.linkedin && <p style={{ wordBreak: "break-all" }}>{cv.linkedin}</p>}
            {cv.github && <p style={{ wordBreak: "break-all" }}>{cv.github}</p>}
          </div>
        </div>

        {skills.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "7.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "10px" }}>
              Compétences
            </h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {skills.map((s, i) => (
                <li key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "9pt", color: "#d1d5db", marginBottom: "5px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#b8960c", flexShrink: 0 }} />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {languages.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "7.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "10px" }}>
              Langues
            </h2>
            {languages.map((l) => (
              <div key={l.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "9pt", marginBottom: "4px" }}>
                <span style={{ color: "#d1d5db" }}>{l.name}</span>
                <span style={{ color: "#b8960c" }}>{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <h2 style={{ fontSize: "7.5pt", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#b8960c", borderBottom: "1px solid #333", paddingBottom: "4px", marginBottom: "10px" }}>
              Certifications
            </h2>
            {certifications.map((c) => (
              <div key={c.id} style={{ marginBottom: "8px" }}>
                <p style={{ fontSize: "9pt", fontWeight: 600, color: "white" }}>{c.name}</p>
                <p style={{ fontSize: "8pt", color: "#b8960c" }}>{c.issuer} · {c.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
