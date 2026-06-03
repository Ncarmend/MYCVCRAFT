import type { CV } from "@/types";
import { MailIcon, PhoneIcon, LocationIcon, WebIcon, LinkedinIcon, GithubIcon } from "./ContactIcons";

interface Props { cv: Partial<CV>; watermark?: boolean; }

export function ClassicTemplate({ cv, watermark = false }: Props) {
  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  const S: React.CSSProperties = {
    fontSize: "9pt", fontWeight: 700,
    textTransform: "uppercase", letterSpacing: "0.1em",
    color: "#111", borderBottom: "1.5px solid #111",
    paddingBottom: "3px", marginBottom: "10px",
  };

  return (
    <div
      className={watermark ? "cv-watermark" : ""}
      style={{ width: "816px", minHeight: "1056px", background: "white", padding: "52px 64px", fontFamily: "'Times New Roman', Times, serif", fontSize: "11pt", color: "#111", lineHeight: 1.5 }}
    >
      {/* Centred header */}
      <div style={{ textAlign: "center", marginBottom: "20px", paddingBottom: "14px", borderBottom: "2px solid #111" }}>
        <h1 style={{ fontFamily: "inherit", fontSize: "24pt", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: 0, color: "#111" }}>
          {cv.name}
        </h1>
        <p style={{ fontSize: "12pt", color: "#444", marginTop: "4px", fontStyle: "italic" }}>{cv.jobTitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", fontSize: "9pt", color: "#555", marginTop: "6px" }}>
          {cv.email    && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><MailIcon />     {cv.email}</span>}
          {cv.phone    && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><PhoneIcon />    {cv.phone}</span>}
          {cv.location && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><LocationIcon /> {cv.location}</span>}
          {cv.linkedin && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><LinkedinIcon /> {cv.linkedin}</span>}
          {cv.github   && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><GithubIcon />   {cv.github}</span>}
          {cv.website  && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><WebIcon />      {cv.website}</span>}
        </div>
      </div>

      {cv.summary && (
        <div style={{ marginBottom: "18px" }}>
          <h2 style={S}>Objective</h2>
          <p style={{ color: "#333" }}>{cv.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h2 style={S}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{exp.role}</span>
                <span style={{ fontStyle: "italic", color: "#555" }}>{exp.startDate} – {exp.endDate}</span>
              </div>
              <div style={{ fontStyle: "italic", color: "#333" }}>{exp.company}</div>
              {exp.description && <p style={{ marginTop: "4px", color: "#333" }}>{exp.description}</p>}
              {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                <ul style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {exp.achievements.map((a, i) => <li key={i} style={{ color: "#333" }}>{a}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h2 style={S}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: 700 }}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}</span>
                <span style={{ fontStyle: "italic", color: "#333" }}>,&nbsp;{edu.institution}</span>
                {edu.grade && <span style={{ color: "#555" }}> — {edu.grade}</span>}
              </div>
              <span style={{ fontStyle: "italic", color: "#555", whiteSpace: "nowrap", marginLeft: "10px" }}>
                {edu.startDate} – {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h2 style={S}>Skills</h2>
          <p style={{ color: "#333" }}>{skills.join("  ·  ")}</p>
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: "18px" }}>
          <h2 style={S}>Projects</h2>
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700 }}>{p.name}</span>
                {p.url && <span style={{ color: "#555", fontSize: "9pt" }}>{p.url}</span>}
              </div>
              {p.description && <p style={{ color: "#333", marginTop: "2px" }}>{p.description}</p>}
              {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                <p style={{ color: "#555", fontSize: "9pt", marginTop: "2px" }}>{p.technologies.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {(languages.length > 0 || certifications.length > 0) && (
        <div>
          <h2 style={S}>Additional</h2>
          {languages.length > 0 && (
            <p style={{ color: "#333" }}>
              <strong>Languages:</strong>{" "}
              {languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}
            </p>
          )}
          {certifications.map((c) => (
            <p key={c.id} style={{ color: "#333" }}>
              <strong>{c.name}</strong> — {c.issuer}, {c.date}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
