"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";

const RESUME_DARK_URL = process.env.NEXT_PUBLIC_RESUME_URL?.trim() || null;
const RESUME_LIGHT_URL = "/resume-light.pdf";

const BASE_LINKS = [
  {
    label: "Email",
    value: "mdavezachary@gmail.com",
    icon: "✉",
    href: "mailto:mdavezachary@gmail.com",
  },
  {
    label: "LinkedIn",
    value: "Dave Zachary Macarayo",
    icon: "◈",
    href: "https://www.linkedin.com/in/dave-zachary-macarayo-002304282/",
  },
  {
    label: "GitHub",
    value: "DebZakari",
    icon: "⎇",
    href: "https://github.com/DebZakari",
  },
];

type FormState = { name: string; email: string; message: string };
type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { mode } = useExperience();
  const { resolvedTheme } = useTheme();
  const immersive = mode === "immersive";
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const resumeUrl =
    resolvedTheme === "light" ? RESUME_LIGHT_URL : RESUME_DARK_URL;
  const links = resumeUrl
    ? [
        ...BASE_LINKS,
        { label: "Résumé", value: "Download PDF", icon: "↓", href: resumeUrl },
      ]
    : BASE_LINKS;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    padding: "12px 16px",
    color: "var(--text)",
    fontFamily: "inherit",
    fontSize: 14,
    transition: "border-color 0.2s",
    outline: "none",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          (data as { error?: string }).error || "Something went wrong. Please try again."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

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
          style={{ gap: "clamp(2rem, 5vw, 5rem)", alignItems: "start" }}
        >
          <RevealBlock direction="left" delay={0}>
            <div>
              <SectionLabel
                tag="05 · Transmission Dock"
                title="Let's build something."
                subtitle="Open to full-time roles, freelance projects, and AI-focused collaborations."
              />
              <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      l.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    download={l.label === "Résumé" ? true : undefined}
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
                      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
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
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      className="animate-pulse-soft"
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "var(--accent2)",
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
          </RevealBlock>

          {/* Form */}
          <RevealBlock direction="right" delay={0}>
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

              {status === "success" ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
                  <p style={{ color: "var(--text-muted)", fontSize: 15 }}>
                    Message received. I&apos;ll be in touch soon.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: "grid", gap: 16 }}
                >
                  {(
                    [
                      ["name", "Name", "Your name", 100, "text"],
                      ["email", "Email", "your@email.com", 320, "email"],
                    ] as [keyof FormState, string, string, number, string][]
                  ).map(([k, label, ph, maxLen, type]) => (
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
                        type={type}
                        placeholder={ph}
                        required
                        maxLength={maxLen}
                        value={form[k]}
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
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: 6,
                      }}
                    >
                      <label
                        className="font-mono"
                        style={{
                          fontSize: 11,
                          color: "var(--text-dim)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        Message
                      </label>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: 10,
                          color:
                            form.message.length > 1800
                              ? "var(--accent-vivid)"
                              : "var(--text-dim)",
                          letterSpacing: "0.04em",
                          transition: "color 0.2s",
                        }}
                      >
                        {form.message.length}/2000
                      </span>
                    </div>
                    <textarea
                      placeholder="Tell me about your project..."
                      required
                      rows={5}
                      maxLength={2000}
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

                  {status === "error" && errorMsg && (
                    <p
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--accent-vivid)",
                        letterSpacing: "0.04em",
                        padding: "8px 12px",
                        background: "var(--accent-vivid-glow)",
                        border: "1px solid var(--accent-vivid-muted)",
                        borderRadius: 8,
                      }}
                    >
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    style={{
                      padding: "13px 22px",
                      borderRadius: 28,
                      border: "none",
                      background:
                        status === "loading"
                          ? "var(--surface2)"
                          : "var(--grad)",
                      color: status === "loading" ? "var(--text-muted)" : "var(--bg)",
                      fontFamily: "inherit",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: status === "loading" ? "not-allowed" : "pointer",
                      transition: "opacity 0.2s, background 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (status !== "loading")
                        e.currentTarget.style.opacity = "0.85";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {status === "loading" ? (
                      <>
                        <Spinner />
                        Transmitting...
                      </>
                    ) : (
                      "Transmit →"
                    )}
                  </button>
                </form>
              )}
            </div>
          </RevealBlock>
        </div>
      </section>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      style={{ animation: "spin 0.8s linear infinite", flexShrink: 0 }}
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.25"
      />
      <path
        d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
