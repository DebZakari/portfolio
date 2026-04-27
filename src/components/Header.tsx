export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border/0 bg-transparent">
      {/* Nav — Phase 02 */}
      <nav
        className="mx-auto flex h-full max-w-7xl items-center justify-between px-6"
        aria-label="Main navigation"
      >
        <span className="font-semibold text-text tracking-tight">DM</span>
      </nav>
    </header>
  );
}
