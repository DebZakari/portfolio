# Dave Zachary Macarayo - Portfolio

Universe-themed personal portfolio for Dave Zachary Macarayo, built with Next.js 16, React 19, Tailwind CSS v4, and Canvas 2D.

The site presents Dave as a web developer and Computer Engineering graduate focused on AI-integrated systems: LLM workflows, RAG, speech synthesis, biometrics, computer vision, edge AI, and production web applications.

## Current Site

- Home page with hero, about, skills, projects, mission logs, and contact sections.
- Immersive and Focus experience modes.
- Dark, light, and system theme support through `next-themes`.
- Interactive Canvas 2D galaxy in Immersive Mode on non-mobile viewports.
- Custom black-hole cursor in Immersive Mode when motion is allowed.
- Scroll reveal animations in Immersive Mode, with Focus Mode and reduced-motion fallbacks.
- Project showcase with a featured project card, supporting project grid, and project detail routes at `/projects/[slug]`.
- Mission logs section and `/logs` page.
- Contact form backed by `/api/contact` and Resend.
- Dynamic Open Graph image route at `/og`.
- Generated GitHub README image routes at `/api/readme-banner` and `/api/readme-stats`.
- Robots and sitemap routes through the Next.js App Router.

## Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties |
| Theme | `next-themes` |
| Icons | `lucide-react` |
| Galaxy | Canvas 2D |
| Email | Resend |
| Testing | Vitest, React Testing Library, jsdom |
| Deployment | Vercel |

`@react-three/fiber`, `@react-three/drei`, and `three` are not used by the current implementation.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

The contact API requires Resend in production:

```bash
RESEND_API_KEY=...
```

Optional resume link:

```bash
NEXT_PUBLIC_RESUME_URL=https://example.com/resume-dark.pdf
```

Light mode uses `/resume-light.pdf` when available.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local dev server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript with `--noEmit` |
| `npm run test` | Run the Vitest suite once |
| `npm run test:watch` | Run Vitest in watch mode |

## Project Structure

```text
src/
  app/
    api/contact/          # Resend-backed contact endpoint
    api/readme-banner/    # Generated GitHub profile banner image
    api/readme-stats/     # Generated GitHub stats image
    logs/                 # Mission logs page
    og/                   # Dynamic Open Graph image assets and route
    projects/[slug]/      # Static project detail pages
    layout.tsx            # Root layout, providers, header, side nav, footer
    page.tsx              # Home page composition
    robots.ts             # Robots route
    sitemap.ts            # Sitemap route
  components/
    hero/                 # Hero section and GalaxyCanvas
    sections/             # About, Skills, Projects, MissionLogs, Contact
    ProjectDetail.tsx     # Project case-study page UI
    RevealBlock.tsx       # Immersive scroll reveal wrapper
    Header.tsx            # Theme, experience, and mobile nav controls
    SideNav.tsx           # Desktop section dot navigation
  contexts/               # Experience mode provider
  data/                   # Projects, logs, stats content
  hooks/                  # Theme/motion/section/reveal helpers
  utils/                  # Shared utilities
```

## Experience Modes

The visitor can switch between:

- **Immersive** - interactive galaxy hero, black-hole cursor, atmospheric hover effects, and scroll reveals.
- **Focus** - content-first layout with the same content and minimal motion.

Reduced-motion preferences are respected globally. Heavy visual effects are not rendered in Focus Mode, on mobile where applicable, or when motion should be reduced.

## Deployment

The production site is deployed on Vercel at [dz-macarayo.vercel.app](https://dz-macarayo.vercel.app). Pushes to `main` trigger production deployment.
