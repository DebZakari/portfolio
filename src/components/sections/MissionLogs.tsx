"use client";

import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";
import TerminalPrompt from "@/components/TerminalPrompt";
import { LOGS } from "@/data/logs";

const VISIBLE = 3;

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

export default function MissionLogs() {
  const visible = LOGS.slice(0, VISIBLE);
  return (
    <section
      id="logs"
      aria-label="Mission Logs"
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
            padding: "12px 20px",
            background: "var(--surface2)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ ...MONO, fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
            <span style={{ color: "var(--text-dim)", marginRight: 6 }}>$</span>
            tail -n {VISIBLE} logs/mission.log
          </span>
          <Link
            href="/logs"
            style={{
              ...MONO,
              fontSize: 10,
              color: "var(--text-dim)",
              letterSpacing: "0.08em",
              textDecoration: "none",
              opacity: 0.6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.6")}
            aria-label={`View all ${LOGS.length} log entries`}
          >
            {LOGS.length} entries →
          </Link>
        </div>

        {visible.map((log, i) => (
          <RevealBlock key={log.title} direction="up" delay={i * 80}>
            <article
              style={{
                background: "var(--surface)",
                padding: "20px 24px",
                borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Prompt row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px 12px",
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
                      fontSize: 11,
                      color: "var(--text-dim)",
                      letterSpacing: "0.08em",
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
                      fontSize: 11,
                      color: "var(--text-muted)",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {log.tag}
                  </span>
                </div>

                <span
                  style={{
                    ...MONO,
                    fontSize: 11,
                    color: "var(--text-dim)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {log.date}
                </span>
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  marginBottom: 8,
                  lineHeight: 1.2,
                  color: "var(--text)",
                }}
              >
                {log.title}
              </h3>

              {/* Excerpt */}
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-muted)",
                  lineHeight: 1.75,
                  maxWidth: "72ch",
                }}
              >
                {log.excerpt}
              </p>
            </article>
          </RevealBlock>
        ))}
        <TerminalPrompt />
      </div>
    </section>
  );
}
