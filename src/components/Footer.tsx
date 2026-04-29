export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)" }}>
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "20px clamp(1.5rem, 5vw, 4rem)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          className="font-mono"
          style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.06em" }}
        >
          © {new Date().getFullYear()} Dave Zachary Macarayo
        </span>
        <span
          className="font-mono"
          style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.06em" }}
        >
          Next.js · Vercel
        </span>
      </div>
    </footer>
  );
}
