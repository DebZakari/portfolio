"use client";

import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";

const LOGS = [
  {
    date: "2025·04",
    tag: "NovelVerse",
    title: "Building a Multi-Modal AI Reading Platform",
    excerpt:
      "Architecting a full-stack web novel platform with LangGraph agents, vLLM inference, RAG semantic search via pgvector, and SOTA TTS with voice cloning.",
  },
  {
    date: "2025·02",
    tag: "Speech AI",
    title: "Kokoro + Fish Speech: Local TTS Pipeline",
    excerpt:
      "Integrating ONNX Runtime TTS with Fish Speech S2 Pro for voice cloning. Latency optimization, audio caching via R2, and Redis-backed semantic caching.",
  },
  {
    date: "2024·12",
    tag: "Computer Vision",
    title: "Fine-Tuning YOLOv8 for PCB Detection",
    excerpt:
      "Training YOLOv8 on custom PCB datasets, optimizing for Coral Edge TPU deployment, and building a Tkinter UI for real-time manufacturing inspection.",
  },
  {
    date: "2024·09",
    tag: "Biometrics",
    title: "Iris Detection: YOLO + UNet Pipeline",
    excerpt:
      "End-to-end iris biometric system combining YOLO-based detection with UNet segmentation. PyTorch implementation with precision-focused post-processing.",
  },
];

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

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
      <RevealBlock direction="up" delay={0}>
        <SectionLabel
          tag="04 · Mission Logs"
          title="Technical notes."
          subtitle="Short writeups on systems, experiments, and engineering decisions."
        />
      </RevealBlock>

      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        {/* Terminal header bar */}
        <div
          style={{
            padding: "11px 20px",
            background: "var(--surface2)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ ...MONO, fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.06em" }}>
            <span style={{ color: "var(--accent-vivid)", marginRight: 6 }}>$</span>
            tail -n 4 logs/mission.log
          </span>
          <span style={{ ...MONO, fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em" }}>
            {LOGS.length} entries
          </span>
        </div>

        {/* Log entries */}
        {LOGS.map((log, i) => (
          <RevealBlock key={log.title} direction="none" delay={i * 60}>
            <div
              style={{
                background: "var(--surface)",
                padding: "20px 24px",
                borderBottom: i < LOGS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Prompt row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      ...MONO,
                      fontSize: 13,
                      color: "var(--accent-vivid)",
                      lineHeight: 1,
                      userSelect: "none",
                    }}
                  >
                    ›
                  </span>
                  <span
                    style={{
                      ...MONO,
                      fontSize: 10,
                      color: "var(--text-dim)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}.log
                  </span>
                  <span
                    style={{
                      ...MONO,
                      fontSize: 10,
                      color: "var(--text-dim)",
                      opacity: 0.4,
                      userSelect: "none",
                    }}
                  >
                    |
                  </span>
                  <span
                    style={{
                      ...MONO,
                      padding: "2px 8px",
                      borderRadius: 20,
                      background: "var(--accent-vivid-glow)",
                      border: "1px solid var(--accent-vivid-muted)",
                      fontSize: 10,
                      color: "var(--accent-vivid)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {log.tag}
                  </span>
                </div>

                <span
                  style={{
                    ...MONO,
                    fontSize: 10,
                    color: "var(--text-dim)",
                    letterSpacing: "0.06em",
                  }}
                >
                  {log.date}
                </span>
              </div>

              {/* Title */}
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

              {/* Excerpt */}
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  maxWidth: "72ch",
                }}
              >
                {log.excerpt}
              </p>
            </div>
          </RevealBlock>
        ))}
      </div>
    </section>
  );
}
