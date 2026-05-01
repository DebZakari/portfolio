import { ImageResponse } from "next/og";

export const runtime = "edge";
export const revalidate = 86400;

const spaceGroteskPromise = fetch(
  new URL("../../og/SpaceGrotesk-Bold.woff", import.meta.url)
).then((r) => r.arrayBuffer());

const jetbrainsMonoPromise = fetch(
  new URL("../../og/JetBrainsMono-Regular.woff", import.meta.url)
).then((r) => r.arrayBuffer());

const VOID_DEEP    = "#0f0f0f";
const BORDER       = "#262626";
const SIGNAL_WHITE = "#f0f0f0";
const FAINT_SIGNAL = "#888888";
const VOID_TEXT    = "#444444";

interface LangEntry { name: string; pct: number }
interface Stats {
  repos: number;
  stars: number;
  commits: number;
  followers: number;
  langs: LangEntry[];
}

async function fetchStats(): Promise<Stats> {
  const headers = { "User-Agent": "DebZakari-readme-stats" };
  try {
    const [userRes, reposRes, commitsRes] = await Promise.all([
      fetch("https://api.github.com/users/DebZakari", { headers }),
      fetch("https://api.github.com/users/DebZakari/repos?per_page=100&type=owner", { headers }),
      fetch("https://api.github.com/search/commits?q=author:DebZakari&per_page=1", {
        headers: { ...headers, Accept: "application/vnd.github.cloak-preview+json" },
      }),
    ]);

    const user    = userRes.ok    ? await userRes.json() : {};
    const repos   = reposRes.ok   ? await reposRes.json() : [];
    const commits = commitsRes.ok ? await commitsRes.json() : {};

    const stars = Array.isArray(repos)
      ? repos.reduce((s: number, r: { stargazers_count: number }) => s + r.stargazers_count, 0)
      : 0;

    const langMap: Record<string, number> = {};
    if (Array.isArray(repos)) {
      for (const repo of repos) {
        if (repo.language) langMap[repo.language] = (langMap[repo.language] ?? 0) + 1;
      }
    }

    const sorted = Object.entries(langMap).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const total  = sorted.reduce((s, [, n]) => s + n, 0);
    const langs  = sorted.map(([name, count]) => ({
      name,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

    return {
      repos:     user.public_repos ?? 0,
      stars,
      commits:   commits.total_count ?? 0,
      followers: user.followers ?? 0,
      langs,
    };
  } catch {
    return { repos: 0, stars: 0, commits: 0, followers: 0, langs: [] };
  }
}

export async function GET() {
  const [spaceGroteskData, jetbrainsMonoData, stats] = await Promise.all([
    spaceGroteskPromise,
    jetbrainsMonoPromise,
    fetchStats(),
  ]);

  const statItems = [
    { label: "COMMITS",   value: stats.commits > 0 ? stats.commits.toLocaleString("en-US") : "—" },
    { label: "REPOS",     value: stats.repos.toString() },
    { label: "STARS",     value: stats.stars.toString() },
    { label: "FOLLOWERS", value: stats.followers.toString() },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: 495,
          height: 175,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingLeft: 24,
          paddingRight: 24,
          gap: 14,
          background: VOID_DEEP,
          border: `1px solid ${BORDER}`,
          borderRadius: 8,
        }}
      >
        {/* Stats row */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {statItems.map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 9,
                  color: VOID_TEXT,
                  letterSpacing: "0.10em",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "Space Grotesk, system-ui, sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: SIGNAL_WHITE,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Language bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {stats.langs.map(({ name, pct }) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: FAINT_SIGNAL,
                  width: 88,
                  flexShrink: 0,
                }}
              >
                {name}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 3,
                  background: BORDER,
                  borderRadius: 2,
                  overflow: "hidden",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: 3,
                    background: SIGNAL_WHITE,
                    opacity: 0.55,
                  }}
                />
              </div>
              <span
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: 10,
                  color: VOID_TEXT,
                  width: 30,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 495,
      height: 175,
      fonts: [
        { name: "Space Grotesk", data: spaceGroteskData, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: jetbrainsMonoData, weight: 400, style: "normal" },
      ],
    }
  );
}
