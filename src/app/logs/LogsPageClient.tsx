"use client";

import Link from "next/link";
import { LOGS } from "@/data/logs";
import RevealBlock from "@/components/RevealBlock";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

export default function LogsPageClient() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingTop: 64 }}>
      {/* Terminal context bar */}
      <div
        style={{
          height: 44,
          background: "var(--surface2)",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <Link
          href="/"
          aria-label="Back to home"
          className="log-back-link"
          style={{
            ...MONO,
            fontSize: 11,
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          ← cd ~
        </Link>

        <span style={{ ...MONO, fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em" }}>
          <span aria-hidden="true" style={{ marginRight: 6 }}>$</span>
          cat logs/mission.log
          <span aria-hidden="true" style={{ opacity: 0.4, margin: "0 10px" }}>·</span>
          <span style={{ opacity: 0.6 }}>{LOGS.length} entries</span>
        </span>
      </div>

      {/* Log entries */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        <h1 className="sr-only">Mission Logs</h1>

        <div
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          {LOGS.map((log, i) => (
            <RevealBlock key={log.title} delay={i * 60} direction="up" distance={16}>
              <article
                className={log.slug ? "log-entry" : undefined}
                style={{
                  background: "var(--surface)",
                  padding: "28px 32px",
                  borderBottom: i < LOGS.length - 1 ? "1px solid var(--border)" : "none",
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
                    marginBottom: 12,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      aria-hidden="true"
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
                      aria-hidden="true"
                      style={{
                        ...MONO,
                        fontSize: 11,
                        color: "var(--text-dim)",
                        letterSpacing: "0.08em",
                        userSelect: "none",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}.log
                    </span>
                    <span
                      aria-hidden="true"
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
                <h2
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    margin: "0 0 10px",
                    lineHeight: 1.3,
                  }}
                >
                  {log.slug ? (
                    <Link
                      href={`/logs/${log.slug}`}
                      className="log-title-link"
                      style={{ color: "var(--text)", textDecoration: "none" }}
                    >
                      {log.title}
                    </Link>
                  ) : (
                    <span style={{ color: "var(--text)" }}>{log.title}</span>
                  )}
                </h2>

                {/* Excerpt */}
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--text-muted)",
                    lineHeight: 1.75,
                    maxWidth: "72ch",
                    margin: 0,
                  }}
                >
                  {log.excerpt}
                </p>
              </article>
            </RevealBlock>
          ))}

          {/* EOF marker */}
          <div
            aria-hidden="true"
            style={{
              padding: "20px 32px",
              background: "var(--surface2)",
              borderTop: "1px solid var(--border)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                ...MONO,
                fontSize: 11,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                opacity: 0.35,
              }}
            >
              · end of log ·
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
