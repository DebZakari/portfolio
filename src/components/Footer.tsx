export default function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm text-text-muted text-center">
          &copy; {new Date().getFullYear()} Dave Macarayo
        </p>
      </div>
    </footer>
  );
}
