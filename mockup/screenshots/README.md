# Mare Nostrum — UI Screenshots & Annotations

Visual mockups of every gameplay phase, annotated with explanation balloons and improvement notes.

## Screenshots

| # | File | Phase | Description |
|---|------|-------|-------------|
| 1 | [01-main-menu.html](01-main-menu.html) | Main Menu | Cinematic hero screen with game title, era badge, and navigation |
| 2 | [02-fondaco-kahvehane.html](02-fondaco-kahvehane.html) | Müzakere | Diplomacy phase: intelligence whispers, rumor controls, chat placeholder *(filename kept for compatibility — content is now the Müzakere phase)* |
| 3 | [03-fondaco-pazar.html](03-fondaco-pazar.html) | Fondaco → Pazar | Port phase: market trading, cargo management, price indicators |
| 4 | [04-fondaco-tersane.html](04-fondaco-tersane.html) | Fondaco → Tersane | Port phase: ship status, repairs, experience dashboard |
| 5 | [05-emir.html](05-emir.html) | Emir (Orders) | Navigation: **full SVG map** for destination selection, route choice, intent system, tactic system |
| 6 | [06-ruzgar.html](06-ruzgar.html) | Rüzgâr (Resolution) | Turn resolution: **voyage mini-map**, combat/trade results, log, rumor feed |
| 7 | [07-harita.html](07-harita.html) | Harita (Full Map) | **Complete Mediterranean map** with 15 ports, 29 routes, 3 chokepoints, coastlines, islands, legends |

## How to View

Open any `.html` file directly in a browser — they are fully self-contained with embedded CSS. No server or build step required.

## Annotation Legend

- 🟡 **Gold balloons** — Feature explanations for stakeholders
- 🔵 **Blue balloons** — Technical notes for developers
- 🟢 **Green balloons** — Improvement suggestions for future work
- 🔴 **Red balloons** — Known issues or limitations

## Design System v3 Highlights

- **Flat/Minimal**: No glassmorphism — transparent top bar with a single `border-bottom`, zero `backdrop-filter`
- **Smaller radii**: `--radius-sm:6px` · `--radius-md:8px` · `--radius-lg:10px` · `--radius-xl:12px`
- **Simpler shadow**: `0 2px 8px rgba(0,0,0,0.15)` replaces the heavy multi-stop shadow
- **Underline phase nav**: 4 tabs (`Fondaco | Müzakere | Emir | Rüzgâr`) with a 2px accent underline on active
- **Flat fondaco tabs**: 2-tab sub-nav (`Pazar | Tersane`) — Kahvehane and Müzakere moved to top-level phases
- **Altın notation**: Gold shown as `200 altın` — no emoji, no icon class
- **Intent trade-offs**: Emir intent cards show green reward tag + red risk tag for each option
- **No raw XP numbers**: Experience shown as star fill (★★★☆☆) — never exposed as integers
- **SVG map**: Full Mediterranean map (860×520 viewBox) with sea gradient, wave texture, coastlines, islands, 4 region overlays, and compass rose
- **Map in Emir**: Destination picker shows reachable ports bright, unreachable dimmed (30%), selected route animated with gold dashes
- **Voyage map in Rüzgâr**: Mini map shows origin→destination with animated path, encounter markers, and arrival confirmation
- **Glass borders**: `rgba(148, 163, 184, 0.08)` (`--line-light`) for ultra-subtle card depth
- **Focus styles**: Accessible focus rings with accent glow
