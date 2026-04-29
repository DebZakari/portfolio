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
          display: "grid",
          gap: 1,
          borderRadius: 16,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        {LOGS.map((log, i) => (
          <RevealBlock key={log.title} direction="none" delay={i * 50}>
          <div
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
          </RevealBlock>
        ))}
      </div>
    </section>
  );
}
