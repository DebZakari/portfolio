# Changelog

All notable changes to this project will be documented in this file.

Changelog tracking begins at `7766696c97ea96ef40be6ef32304175f60b1d9dc`.

## [0.3.0] - 2026-05-01

### Added
- Added enhanced galaxy scene objects including meteors, comets, planets, rings, and background stars
- Added keyboard-focus styling for clickable project cards

### Changed
- Rebuilt galaxy canvas interactions with stronger black-hole gravity, object capture, orbiting behavior, and reduced-motion handling
- Redesigned the Projects section with a featured NovelVerse card and refined project summaries
- Updated project content for NovelVerse, Enrollment V2, Iris Biometric Pipeline, and PCB Vision System
- Refined Mission Logs layout to show the latest entries with improved typography and archive navigation
- Improved theme toggle behavior by using the resolved theme value
- Refined copy, metadata punctuation, contact link hover states, and small typography details

### Fixed
- Restored focus to the About portrait trigger after closing the photo modal
- Moved focus to the About photo modal close button when the modal opens
- Marked the decorative galaxy canvas as presentation-only for assistive technologies

## [0.2.1] - 2026-04-30

### Added
- Added `StatsDrawer` with scroll-lock integration
- Added `stats.ts` for drawer content
- Added `logs.ts` extracted from Mission Logs for better organization
- Added the About section flip card interaction
- Added `scrollLock.ts` for shared scroll locking
- Added the `Skip to content` link for keyboard accessibility

### Changed
- Refined the About section layout and structure
- Updated Contact section links to use icons
- Refactored the footer for cleaner structure and consistent styling
- Improved the Skills section with keyboard accessibility and visual feedback
- Updated `SectionLabel` to accept custom styles
- Adjusted spring easing in `globals.css` for smoother animations
- Simplified scroll lock utility functions

## [0.2.0] - 2026-04-29

### Added
- Added reveal-on-scroll animations with `RevealBlock` and `useReveal`
- Added side navigation with active section tracking
- Added contact form email delivery via Resend
- Added downloadable resume assets in PDF and HTML formats

### Changed
- Refined the hero, header, About, Skills, Projects, Mission Logs, and Contact UX
- Improved cursor interactions and theme-toggle visuals
- Updated portfolio color consistency across the interface
- Updated resume downloads to respect the active theme

### Fixed
- Restored résumé download visibility when a public resume URL is configured
- Ensured light mode downloads `resume-light.pdf`
- Kept the About section anchored cleanly in the viewport when navigated to directly
