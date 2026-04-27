"use client";

import { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";

const LINKS = [
  { label: "Email", value: "mdavezachary@gmail.com", icon: "✉", href: "mailto:mdavezachary@gmail.com" },
  { label: "LinkedIn", value: "Dave Zachary Macarayo", icon: "◈", href: "https://www.linkedin.com/in/dave-zachary-macarayo-002304282/" },
  { label: "GitHub", value: "DebZakari", icon: "⎇", href: "https://github.com/DebZakari" },
  { label: "Résumé", value: "Download PDF", icon: "↓", href: "#" },
];

export default function Contact() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "var(--text)",
    fontFamily: "var(--font-space-grotesk), sans-serif",
    fontSize: 14,
    transition: "border-color 0.2s",
    outline: "none",
  };

  return (
    <div
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <section
        id="contact"
        style={{
          padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "start",
          }}
        >
          <div>
            <SectionLabel
              tag="05 · Transmission Dock"
              title="Let's build something."
              subtitle="Open to full-time roles, freelance projects, and AI-focused collaborations."
            />
            <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
              {LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    transition: "border-color 0.2s",
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                >
                  <span
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    {l.icon}
                  </span>
                  <div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: "var(--text-dim)",
                        letterSpacing: "0.08em",
                        marginBottom: 2,
                      }}
                    >
                      {l.label}
                    </div>
                    <div
                      style={{ fontSize: 13, color: "var(--text-muted)" }}
                    >
                      {l.value}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {immersive && (
              <div
                style={{
                  marginTop: 32,
                  padding: 20,
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--text-dim)",
                    letterSpacing: "0.08em",
                    marginBottom: 10,
                  }}
                >
                  {"// current status"}
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <span
                    className="animate-pulse-soft"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "oklch(70% 0.18 145)",
                      display: "inline-block",
                    }}
                  />
                  <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
                    Available for opportunities
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 32,
            }}
          >
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                marginBottom: 24,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              Send a message
            </h3>
            {sent ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
                  Message received. I&apos;ll be in touch soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                style={{ display: "grid", gap: 16 }}
              >
                {[
                  ["name", "Name", "Your name"],
                  ["email", "Email", "your@email.com"],
                ].map(([k, label, ph]) => (
                  <div key={k}>
                    <label
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-dim)",
                        letterSpacing: "0.08em",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={k === "email" ? "email" : "text"}
                      placeholder={ph}
                      required
                      value={form[k as keyof typeof form]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [k]: e.target.value }))
                      }
                      style={inputStyle}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor = "var(--accent)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor = "var(--border)")
                      }
                    />
                  </div>
                ))}
                <div>
                  <label
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      color: "var(--text-dim)",
                      letterSpacing: "0.08em",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    placeholder="Tell me about your project..."
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    style={{ ...inputStyle, resize: "vertical" }}
                    onFocus={(e) =>
                      (e.currentTarget.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = "var(--border)")
                    }
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    padding: 13,
                    borderRadius: 12,
                    border: "none",
                    background: "var(--grad)",
                    color: "var(--bg)",
                    fontFamily: "inherit",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.opacity = "0.85")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.opacity = "1")
                  }
                >
                  Transmit →
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
