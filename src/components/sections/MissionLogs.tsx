"use client";

import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";
import { LOGS } from "@/data/logs";

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
            <span style={{ color: "var(--text-dim)", marginRight: 6 }}>$</span>
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
                      color: "var(--accent2)",
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
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      fontSize: 10,
                      color: "var(--text-muted)",
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
