import type { CV } from "@/types";
import { MailIcon, PhoneIcon, LocationIcon, WebIcon, LinkedinIcon, GithubIcon } from "./ContactIcons";

interface Props { cv: Partial<CV>; watermark?: boolean; }

export function CrispTemplate({ cv, watermark = false }: Props) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  const blue = "#2563eb";
  const lightBlue = "#eff6ff";
  const muted = "#64748b";
  const dark = "#0f172a";
  const mid = "#475569";
  const border = "#e2e8f0";

  const sectionTitle: React.CSSProperties = {
    fontSize: "9pt", fontWeight: 700, textTransform: "uppercase",
    letterSpacing: "0.1em", color: blue, marginBottom: "10px",
    display: "flex", alignItems: "center", gap: "8px",
  };
  const bar: React.CSSProperties = {
    display: "inline-block", width: "3px", height: "14px",
    background: blue, borderRadius: "2px", flexShrink: 0,
  };
  const entry: React.CSSProperties = {
    marginBottom: "14px", paddingLeft: "12px", borderLeft: `2px solid ${border}`,
  };

  return (
    <div
      className={watermark ? "cv-watermark" : ""}
      style={{ width: "816px", minHeight: "1056px", background: "white", fontFamily: "'Helvetica Neue', Arial, sans-serif", fontSize: "10.5pt", color: dark }}
    >
      {/* Header band */}
      <div style={{ background: lightBlue, borderBottom: `3px solid ${blue}`, padding: "36px 52px 28px" }}>
        <h1 style={{ fontFamily: "inherit", fontSize: "22pt", fontWeight: 800, color: dark, margin: 0, letterSpacing: "-0.3px" }}>
          {cv.name}
        </h1>
        <p style={{ fontSize: "12pt", color: blue, fontWeight: 500, marginTop: "5px" }}>{cv.jobTitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "10px", fontSize: "9pt", color: muted }}>
          {cv.email    && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><MailIcon />     {cv.email}</span>}
          {cv.phone    && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><PhoneIcon />    {cv.phone}</span>}
          {cv.location && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><LocationIcon /> {cv.location}</span>}
          {cv.linkedin && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><LinkedinIcon /> {cv.linkedin}</span>}
          {cv.github   && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><GithubIcon />   {cv.github}</span>}
          {cv.website  && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><WebIcon />      {cv.website}</span>}
        </div>
      </div>

      <div style={{ padding: "32px 52px" }}>
        {cv.summary && (
          <div style={{ marginBottom: "22px" }}>
            <h2 style={sectionTitle}><span style={bar} />Professional Summary</h2>
            <p style={{ color: mid, lineHeight: 1.7 }}>{cv.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <h2 style={sectionTitle}><span style={bar} />Work Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} style={entry}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: "inherit", fontWeight: 700, fontSize: "11pt", color: dark, margin: 0 }}>{exp.role}</h3>
                    <p style={{ fontSize: "10pt", color: blue, fontWeight: 500, marginTop: "2px" }}>{exp.company}</p>
                  </div>
                  <span style={{ fontSize: "9pt", color: muted, whiteSpace: "nowrap", marginLeft: "12px", background: lightBlue, padding: "2px 8px", borderRadius: "4px" }}>
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                {exp.description && <p style={{ marginTop: "5px", color: mid, lineHeight: 1.6 }}>{exp.description}</p>}
                {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                  <ul style={{ paddingLeft: "16px", marginTop: "5px" }}>
                    {exp.achievements.map((a, i) => (
                      <li key={i} style={{ color: mid, lineHeight: 1.6, marginBottom: "2px" }}>{a}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <h2 style={sectionTitle}><span style={bar} />Education</h2>
            {education.map((edu) => (
              <div key={edu.id} style={{ ...entry, display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <div>
                  <h3 style={{ fontFamily: "inherit", fontWeight: 700, color: dark, margin: 0 }}>
                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                  </h3>
                  <p style={{ color: blue, fontWeight: 500, fontSize: "10pt", marginTop: "2px" }}>{edu.institution}</p>
                  {edu.grade && <p style={{ color: muted, fontSize: "9pt" }}>{edu.grade}</p>}
                </div>
                <span style={{ fontSize: "9pt", color: muted, whiteSpace: "nowrap", marginLeft: "12px" }}>
                  {edu.startDate} — {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <h2 style={sectionTitle}><span style={bar} />Skills</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {skills.map((s, i) => (
                <span key={i} style={{ border: `1px solid ${blue}`, borderRadius: "4px", padding: "2px 10px", fontSize: "9.5pt", color: blue, background: lightBlue }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: "22px" }}>
            <h2 style={sectionTitle}><span style={bar} />Projects</h2>
            {projects.map((p) => (
              <div key={p.id} style={entry}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontFamily: "inherit", fontWeight: 700, color: dark, margin: 0 }}>{p.name}</h3>
                  {p.url && <span style={{ fontSize: "9pt", color: muted }}>{p.url}</span>}
                </div>
                {p.description && <p style={{ color: mid, marginTop: "3px", lineHeight: 1.6 }}>{p.description}</p>}
                {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                  <p style={{ fontSize: "9pt", color: muted, marginTop: "4px" }}>{p.technologies.join(" · ")}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {(languages.length > 0 || certifications.length > 0) && (
          <div>
            <h2 style={sectionTitle}><span style={bar} />Additional</h2>
            {languages.length > 0 && (
              <p style={{ color: mid, marginBottom: "6px" }}>
                <strong>Languages:</strong>{" "}
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}
              </p>
            )}
            {certifications.map((c) => (
              <p key={c.id} style={{ color: mid, marginBottom: "4px" }}>
                <strong>{c.name}</strong> — {c.issuer}, {c.date}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
