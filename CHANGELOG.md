# Changelog

All notable changes to this project will be documented in this file.

Changelog tracking begins at `7766696c97ea96ef40be6ef32304175f60b1d9dc`.

## [0.3.0] - 2026-05-01

### Added
- Enhanced galaxy scene objects including meteors, comets, planets, rings, and background stars
- Keyboard-focus styling for clickable project cards

### Changed
- Rebuilt galaxy canvas interactions with stronger black-hole gravity, object capture, orbiting behavior, and reduced-motion handling
- Redesigned Projects section with a featured NovelVerse card and refined project summaries
- Updated project content to better describe NovelVerse, Enrollment V2, Iris Biometric Pipeline, and PCB Vision System
- Refined Mission Logs layout to show the latest entries with improved typography and archive navigation
- Improved theme toggle behavior by using the resolved theme value
- Polished copy, metadata punctuation, contact link hover states, and small typography details

### Fixed
- Restored focus to the About portrait trigger after closing the photo modal
- Moved focus to the About photo modal close button when the modal opens
- Marked the decorative galaxy canvas as presentation-only for assistive technologies

## [0.2.1] - 2026-04-30

### Added
- `StatsDrawer` component with scroll-lock integration
- `stats.ts` data file for drawer content
- `logs.ts` data file extracted from MissionLogs for better organization
- Flip card feature in About section for enhanced interactivity
- Scroll lock utility (`scrollLock.ts`)
- "Skip to content" link in layout for keyboard accessibility

### Changed
- Refined About section layout with flip card and improved structure
- Contact section now uses icons for links
- Footer refactored for cleaner structure and consistent styling
- Skills section improved with keyboard accessibility and visual feedback
- `SectionLabel` component accepts custom styles
- Adjusted spring easing in `globals.css` for smoother animations
- Simplified scroll lock utility functions

## [0.2.0] - 2026-04-29

### Added
- Reveal-on-scroll animation system with `RevealBlock` and `useReveal`
- Side navigation with active section tracking
- Contact form email delivery via Resend API
- Downloadable resume assets in PDF and HTML formats

### Changed
- Refined hero, header, About, Skills, Projects, Mission Logs, and Contact UX
- Improved cursor interactions and theme toggle visuals
- Updated portfolio color consistency across the interface
- Added theme-aware resume download behavior

### Fixed
- Restored résumé download visibility when a public resume URL is configured
- Ensured light mode downloads `resume-light.pdf`
- Kept the About section anchored cleanly in the viewport when navigated to directly
