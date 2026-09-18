"use client";

import type { CV } from "@/types";
import { useLanguage, translations } from "@/components/landing/LanguageContext";
import { MailIcon, PhoneIcon, LocationIcon, WebIcon, LinkedinIcon, GithubIcon } from "./ContactIcons";

interface Props { cv: Partial<CV>; watermark?: boolean; }

/**
 * "Administrative Digital" — centred icon-led header, soft rounded "badge"
 * section labels, and flex-row entries with a right-aligned date chip.
 * Layout reference only: no personal data from any source document is
 * hard-coded here — every value comes from the `cv` prop.
 */
export function AdministrativeDigitalTemplate({ cv, watermark = false }: Props) {
  const { lang } = useLanguage();
  const L = translations[lang].cvTemplateLabels;

  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const experience = Array.isArray(cv.experience) ? cv.experience : [];
  const education = Array.isArray(cv.education) ? cv.education : [];
  const projects = Array.isArray(cv.projects) ? cv.projects : [];
  const languages = Array.isArray(cv.languages) ? cv.languages : [];
  const certifications = Array.isArray(cv.certifications) ? cv.certifications : [];

  const badge: React.CSSProperties = {
    display: "inline-block", fontSize: "9pt", fontWeight: 700,
    letterSpacing: "0.06em", textTransform: "uppercase",
    color: "#1e293b", background: "#f1f5f9",
    borderRadius: "6px", padding: "4px 12px", marginBottom: "12px",
  };
  const dateChip: React.CSSProperties = {
    fontSize: "9pt", color: "#64748b", background: "#f8fafc",
    borderRadius: "999px", padding: "2px 10px", whiteSpace: "nowrap",
    flexShrink: 0, marginLeft: "12px",
  };

  return (
    <div
      className={watermark ? "cv-watermark" : ""}
      style={{
        width: "816px", minHeight: "1056px", background: "white",
        padding: "56px 50px", fontFamily: "Calibri, 'Segoe UI', Helvetica, Arial, sans-serif",
        fontSize: "10.5pt", color: "#1e1e1e", lineHeight: 1.55,
      }}
    >
      {/* Centred header */}
      <div style={{ textAlign: "center", marginBottom: "22px", paddingBottom: "18px", borderBottom: "1px solid #e2e8f0" }}>
        <h1 style={{ fontSize: "22pt", fontWeight: 700, margin: 0, color: "#0f172a" }}>{cv.name}</h1>
        <p style={{ fontSize: "11.5pt", color: "#64748b", marginTop: "4px" }}>{cv.jobTitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px", fontSize: "9pt", color: "#475569", marginTop: "10px" }}>
          {cv.email    && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><MailIcon />     {cv.email}</span>}
          {cv.phone    && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><PhoneIcon />    {cv.phone}</span>}
          {cv.location && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><LocationIcon /> {cv.location}</span>}
          {cv.website  && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><WebIcon />      {cv.website}</span>}
          {cv.linkedin && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><LinkedinIcon /> {cv.linkedin}</span>}
          {cv.github   && <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}><GithubIcon />   {cv.github}</span>}
        </div>
      </div>

      {cv.summary && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={badge}>{L.profile}</h2>
          <p style={{ color: "#334155" }}>{cv.summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={badge}>{L.skills}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "24px", rowGap: "4px" }}>
            {skills.map((s, i) => (
              <div key={i} style={{ color: "#334155", fontSize: "10pt" }}>{s}</div>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={badge}>{L.education}</h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <div>
                <div style={{ fontWeight: 700, color: "#0f172a" }}>
                  {edu.degree}{edu.field ? ` — ${edu.field}` : ""}
                </div>
                <div style={{ color: "#64748b", fontSize: "10pt" }}>
                  {edu.institution}{edu.grade ? ` · ${edu.grade}` : ""}
                </div>
              </div>
              <span style={dateChip}>{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={badge}>{L.experience}</h2>
          {experience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{exp.role}</div>
                  <div style={{ color: "#64748b", fontSize: "10pt" }}>{exp.company}</div>
                </div>
                <span style={dateChip}>{exp.startDate} – {exp.endDate}</span>
              </div>
              {exp.description && <p style={{ marginTop: "6px", color: "#334155" }}>{exp.description}</p>}
              {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                <ul style={{ paddingLeft: "18px", marginTop: "6px" }}>
                  {exp.achievements.map((a, i) => <li key={i} style={{ color: "#334155", marginBottom: "2px" }}>{a}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={badge}>{L.projects}</h2>
          {projects.map((p) => (
            <div key={p.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{p.name}</span>
                {p.url && <span style={{ color: "#64748b", fontSize: "9pt" }}>{p.url}</span>}
              </div>
              {p.description && <p style={{ color: "#334155", marginTop: "3px" }}>{p.description}</p>}
              {Array.isArray(p.technologies) && p.technologies.length > 0 && (
                <p style={{ color: "#64748b", fontSize: "9pt", marginTop: "3px" }}>{p.technologies.join(" · ")}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {languages.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={badge}>{L.languages}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: "24px", rowGap: "4px" }}>
            {languages.map((l) => (
              <div key={l.id} style={{ color: "#334155", fontSize: "10pt" }}>
                <strong>{l.name}</strong> — {l.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <h2 style={badge}>{L.certifications}</h2>
          {certifications.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: 700, color: "#0f172a" }}>{c.name}</span>
                <span style={{ color: "#64748b", fontSize: "10pt" }}>{c.issuer ? ` — ${c.issuer}` : ""}</span>
              </div>
              <span style={dateChip}>{c.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
