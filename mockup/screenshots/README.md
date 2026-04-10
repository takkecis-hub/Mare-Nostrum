# Mare Nostrum — UI Screenshots & Annotations

Visual mockups of every gameplay phase, annotated with explanation balloons and improvement notes.

## Screenshots

| # | File | Phase | Description |
|---|------|-------|-------------|
| 1 | [01-main-menu.html](01-main-menu.html) | Main Menu | Cinematic hero screen with game title, era badge, and navigation |
| 2 | [02-fondaco-kahvehane.html](02-fondaco-kahvehane.html) | Fondaco → Kahvehane | Port phase: coffeehouse whispers, rumor system, map view |
| 3 | [03-fondaco-pazar.html](03-fondaco-pazar.html) | Fondaco → Pazar | Port phase: market trading, cargo management, price indicators |
| 4 | [04-fondaco-tersane.html](04-fondaco-tersane.html) | Fondaco → Tersane | Port phase: ship status, repairs, experience dashboard |
| 5 | [05-emir.html](05-emir.html) | Emir (Orders) | Navigation: route selection, intent choice, tactic system |
| 6 | [06-ruzgar.html](06-ruzgar.html) | Rüzgâr (Resolution) | Turn resolution: combat/trade results, log, rumor feed |

## How to View

Open any `.html` file directly in a browser — they are fully self-contained with embedded CSS. No server or build step required.

## Annotation Legend

- 🟡 **Gold balloons** — Feature explanations for stakeholders
- 🔵 **Blue balloons** — Technical notes for developers
- 🟢 **Green balloons** — Improvement suggestions for future work
- 🔴 **Red balloons** — Known issues or limitations

## Design System v2 Highlights

- **Glassmorphism**: Frosted glass cards with `backdrop-filter: blur()`
- **Richer palette**: Deeper navy (#060d1a) with warm gold (#f0a030) accents
- **Spring transitions**: `cubic-bezier(0.34, 1.56, 0.64, 1)` for playful micro-interactions
- **Pill navigation**: Phase switcher uses capsule-shaped tabs
- **Glass borders**: `rgba(148, 163, 184, 0.12)` for subtle depth
- **Layered shadows**: Multi-stop shadows for card depth
- **Focus styles**: Accessible focus rings with accent glow
- **Custom scrollbar**: Minimal 6px scrollbar
