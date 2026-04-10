# Changelog

## [0.2.0] - 2026-04-10

### Added
- Redesigned entire CSS design system with glassmorphism, refined typography, and micro-interactions.
- Added spring-like transitions (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for playful card interactions.
- Added custom scrollbar styling, focus ring accessibility, and branded text selection.
- Added annotated HTML screenshot mockups for all 6 gameplay phases in `screenshots/` folder.
- Added Inter font loading via Google Fonts with proper preconnect links.

### Changed
- Updated main menu with cinematic hero layout (era badge above title, deeper gradients).
- Redesigned phase navigation as pill-style capsule tabs with warm glow.
- Modernized fondaco tabs with underline indicator and gold glow shadow.
- Updated all card backgrounds to use frosted glass effect (`backdrop-filter: blur()`).
- Refined whisper cards with staggered slide-in animation and hover gold border.
- Updated market info into contained card with proper alignment.
- Redesigned ship display dashboard in Tersane with stat box hover effects.
- Updated choice cards in Emir with radial gradient overlay and elevation on hover.
- Refined Emir summary strip and Rüzgâr log items with colored left borders.
- Updated notifications with color-coded left borders (danger/success/info).
- Updated page metadata title to "Mare Nostrum — Akdeniz'in Efendisi".

## [0.1.0] - 2026-04-09

### Added
- Added action-level error/loading feedback, retry flow, and richer combat/trade result displays.
- Added kahvehane rumor spreading controls and market visibility-aware UI states.

### Changed
- Updated the market view to handle multiple local goods and visibility tiers.
- Tightened emir validation so only reachable, coherent orders can be locked.

### Fixed
- Fixed silent API failures across whispers, buying, cargo drops, repairs, and turn resolution.
