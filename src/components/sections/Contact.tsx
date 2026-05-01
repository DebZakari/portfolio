"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";
import { useIsMounted } from "@/hooks/useIsMounted";

const RESUME_DARK_URL = process.env.NEXT_PUBLIC_RESUME_URL?.trim() || null;
const RESUME_LIGHT_URL = "/resume-light.pdf";

const IconEmail = () => <span style={{ fontSize: 14 }}>✉</span>;
const IconLinkedIn = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const IconGitHub = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const IconResume = () => <span style={{ fontSize: 14 }}>↓</span>;

const BASE_LINKS: { label: string; value: string; icon: React.ReactNode; href: string }[] = [
  { label: "Email",    value: "mdavezachary@gmail.com",      icon: <IconEmail />,    href: "mailto:mdavezachary@gmail.com" },
  { label: "LinkedIn", value: "Dave Zachary Macarayo",       icon: <IconLinkedIn />, href: "https://www.linkedin.com/in/dave-zachary-macarayo-002304282/" },
  { label: "GitHub",   value: "DebZakari",                   icon: <IconGitHub />,   href: "https://github.com/DebZakari" },
];

type FormState = { name: string; email: string; message: string };
type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const { resolvedTheme } = useTheme();
  const mounted = useIsMounted();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const resumeUrl = mounted
    ? (resolvedTheme === "light" ? RESUME_LIGHT_URL : RESUME_DARK_URL)
    : RESUME_DARK_URL;
  const links = resumeUrl
    ? [
        ...BASE_LINKS,
        { label: "Résumé", value: "Download PDF", icon: <IconResume />, href: resumeUrl },
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
                title="Let's build something together."
                subtitle="Open to full-time roles, freelance projects, and AI-focused collaborations."
                style={{ marginBottom: "clamp(1.5rem, 3vw, 2rem)" }}
              />
              <div style={{ display: "grid", gap: 12, marginTop: 8 }}>
                {links.map((l, li) => {
                  const isHov = hoveredLink === li;
                  return (
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
                      border: `1px solid ${isHov ? "var(--accent)" : "var(--border)"}`,
                      borderRadius: 12,
                      transition: "border-color 0.2s",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                    onMouseEnter={() => setHoveredLink(li)}
                    onMouseLeave={() => setHoveredLink(null)}
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
                        color: isHov ? "var(--text)" : "var(--text-muted)",
                        flexShrink: 0,
                        transition: "color 0.2s",
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
                          transition: "color 0.2s",
                        }}
                      >
                        {l.label}
                      </div>
                      <div style={{ fontSize: 13, color: isHov ? "var(--text)" : "var(--text-muted)", transition: "color 0.2s" }}>
                        {l.value}
                      </div>
                    </div>
                  </a>
                );
                })}
              </div>

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
                <div role="status" aria-live="polite" style={{ textAlign: "center", padding: "40px 0" }}>
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
                              ? "var(--accent2)"
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
                      role="alert"
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        letterSpacing: "0.04em",
                        padding: "8px 12px",
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
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
