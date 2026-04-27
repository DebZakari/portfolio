interface SectionLabelProps {
  tag: string;
  title: string;
  subtitle?: string;
}

export default function SectionLabel({ tag, title, subtitle }: SectionLabelProps) {
  return (
    <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
      <div
        className="font-mono"
        style={{
          fontSize: 11,
          color: "var(--accent)",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 20,
            height: 1,
            background: "var(--accent)",
            display: "inline-block",
          }}
        />
        {tag}
      </div>
      <h2
        style={{
          fontSize: "clamp(1.8rem, 4vw, 3rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          textWrap: "balance",
          color: "var(--text)",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            marginTop: 14,
            fontSize: "clamp(0.95rem, 1.8vw, 1.1rem)",
            color: "var(--text-muted)",
            maxWidth: 520,
            lineHeight: 1.65,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
