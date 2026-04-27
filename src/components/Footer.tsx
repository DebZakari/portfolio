export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "24px clamp(1.5rem, 5vw, 4rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}
    >
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          color: "var(--text-dim)",
          letterSpacing: "0.06em",
        }}
      >
        © {new Date().getFullYear()} Dave Zachary Macarayo
      </span>
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          color: "var(--text-dim)",
          letterSpacing: "0.06em",
        }}
      >
        Built with precision · Deployed with intent
      </span>
    </footer>
  );
}
