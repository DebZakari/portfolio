"use client";

import SectionLabel from "@/components/SectionLabel";

const LOGS = [
  {
    date: "2025·04",
    tag: "Systems",
    title: "Building a RAG Pipeline from Scratch",
    excerpt:
      "Notes on chunking strategy, embedding models, and why naive similarity search fails at scale — and what to do instead.",
  },
  {
    date: "2025·02",
    tag: "Speech AI",
    title: "XTTS vs ElevenLabs: A Practical Comparison",
    excerpt:
      "Running SOTA TTS locally versus API. Latency tradeoffs, voice cloning accuracy, and integration patterns for production.",
  },
  {
    date: "2025·01",
    tag: "Computer Vision",
    title: "Liveness Detection Anti-Spoofing Techniques",
    excerpt:
      "How passive liveness models work, common attack vectors, and the architectural patterns that hold up under adversarial conditions.",
  },
  {
    date: "2024·11",
    tag: "Frontend",
    title: "Framer Motion Performance at Scale",
    excerpt:
      "Layout animations, exit animations, and the subtle reasons large motion trees cause paint storms. Profiling and fixes.",
  },
];

export default function MissionLogs() {
  return (
    <section
      id="logs"
      style={{
        padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel
        tag="04 · Mission Logs"
        title="Technical notes."
        subtitle="Short writeups on systems, experiments, and engineering decisions."
      />
      <div
        style={{
          display: "grid",
          gap: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        {LOGS.map((log, i) => (
          <div
            key={log.title}
            style={{
              background: "var(--surface)",
              padding: "24px 28px",
              borderBottom:
                i < LOGS.length - 1 ? "1px solid var(--border)" : "none",
              display: "grid",
              gridTemplateColumns: "80px 1fr auto",
              gap: 20,
              alignItems: "start",
              transition: "background 0.2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--surface2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--surface)")
            }
          >
            <div>
              <div
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: "var(--text-dim)",
                  letterSpacing: "0.06em",
                  marginBottom: 6,
                }}
              >
                {log.date}
              </div>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  fontSize: 10,
                  color: "var(--accent)",
                  fontFamily: "var(--font-jetbrains-mono), monospace",
                  whiteSpace: "nowrap",
                }}
              >
                {log.tag}
              </span>
            </div>
            <div>
              <h3
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                  lineHeight: 1.3,
                  color: "var(--text)",
                }}
              >
                {log.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                }}
              >
                {log.excerpt}
              </p>
            </div>
            <div
              style={{
                color: "var(--text-dim)",
                fontSize: 18,
                alignSelf: "center",
              }}
            >
              →
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
