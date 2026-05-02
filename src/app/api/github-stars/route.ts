export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://api.github.com/repos/DebZakari/portfolio", {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return Response.json({ stars: null });
    const data = await res.json();
    return Response.json({ stars: data.stargazers_count ?? null });
  } catch {
    return Response.json({ stars: null });
  }
}
