import { ImageResponse } from "next/og";

// Default social share image for every route (generated at build time).
// X/Twitter falls back to og:image, so no separate twitter-image is needed.
export const alt = "Cvixeo — AI CV Builder & ATS Resume Optimizer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const steps = ["Resume", "Job description", "AI analysis", "Missing keywords", "ATS score", "Improve"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #ffffff 0%, #ecfdf5 60%, #d1fae5 100%)",
          color: "#0f172a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "#064e3b" }} />
          <div style={{ fontSize: 40, fontWeight: 800, color: "#064e3b" }}>Cvixeo</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, maxWidth: 980 }}>
            AI CV Builder & ATS Resume Optimizer
          </div>
          <div style={{ fontSize: 32, color: "#475569", maxWidth: 980 }}>
            Match your CV to any job description, find missing keywords and improve your score.
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: 999,
                  background: "#1e293b",
                  color: "#ffffff",
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {s}
              </div>
              {i < steps.length - 1 && <div style={{ fontSize: 24, color: "#94a3b8" }}>→</div>}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
