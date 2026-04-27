# Dave Zachary Macarayo — Portfolio

Personal portfolio website. Universe-themed, built with Next.js 16 and Canvas 2D.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, CSS custom properties
- **Theming:** next-themes (light / dark / system)
- **Canvas:** Canvas 2D (galaxy, black-hole cursor)
- **Testing:** Vitest, Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler check |
| `npm test` | Run tests |

## Experience Modes

The site ships with two modes the user can toggle:

- **Immersive** — interactive galaxy canvas, black-hole cursor, particle effects
- **Focus** — content-first, no animation, fast load

Both modes support light, dark, and system themes.

## Project Structure

```
src/
  app/              # Next.js App Router pages and layout
  components/       # UI components
    hero/           # Hero section and galaxy canvas
    sections/       # About, Skills, Projects, Logs, Contact
  contexts/         # Experience mode context
  hooks/            # useExperience, useTheme, useIsMounted
```

## Deployment

Deployed on Vercel. Push to `main` triggers a production deploy automatically.
