# File Audit Matrix

| Path | Class | Risk | Current role | Audit note |
|---|---|---:|---|---|
| `mockup/data/ports.json` | factual_world_data | High | Port identity + trade roles | Controllers, goods, trivia, and timeless claims need era scoping |
| `mockup/data/routes.json` | derived_game_data | High | Playable sea graph | Historical adjacency and balance-driven routing are mixed |
| `mockup/data/goods.json` | derived_game_data | High | Origin goods catalog | Some goods are gameplay catalog items, not yet externally sourced |
| `mockup/data/port-geo.json` | factual_world_data | High | Lat/lon source | Must stay aligned with `ports.json` and later external geo checks |
| `mockup/data/coastlines.json` | derived_game_data | Medium | SVG render geometry | Render asset, not exact coastline authority |
| `mockup/data/whispers.json` | narrative_flavor | High | Fallback whisper bank | Now structured and 10-line minimum per port; still fictionalized flavor |
| `mockup/data/trivia.json` | narrative_flavor | High | Static trivia bank | Placeholder grounded layer; marked for external verification |
| `mockup/data/provenance.json` | documentation | Medium | Machine-readable ledger | Source quality now explicit instead of implied |
| `mockup/data/grounding-manifest.json` | documentation | Low | File declarations + hierarchy | Declares category/risk for audited files |
| `mockup/packages/server/src/index.ts` | implementation_logic | High | Runtime data loading | Now validates JSON shape and cross-file integrity at startup |
| `mockup/packages/server/src/llm/mock-whispers.ts` | implementation_logic | High | Whisper selection | Now consumes structured fallback pool and returns 3 lines |
| `docs/wiki/harita-limanlar.md` | documentation | High | Secondary design page | Contains doc drift against implementation in several ports/routes |
| `docs/wiki/ekonomi.md` | documentation | High | Secondary design page | Ragusa and several trade pairings drift from implementation |
| `docs/wiki/llm-entegrasyon.md` | documentation | Medium | Narrative system doc | Previously referenced `trivia.json` and 10+ whispers before implementation existed |
| `mare_nostrum_master_v3.md` | documentation | High | Primary design authority | Still differs from current implementation on routes, Ragusa, and some goods |
